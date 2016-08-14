'use strict';

var React = require('react');

require('xoces');
require('rhumbl-dao');
var xoces = window.xoces;
var dao = window.dao;


const WRAPPER_ID = 'outcomeTree';

var OutcomeTree = React.createClass({

    shouldComponentUpdate(nextProps, nextState) {
      if (!nextProps.selectedOutcome && !nextProps.selectedModule) return false;

      if (nextProps.selectedOutcome !== this.props.selectedOutcome || nextProps.selectedModule !== this.props.selectedModule ||
            nextProps.entities !== this.props.entities || nextProps.relationships !== this.props.relationships || nextProps.assessmentItems != this.props.assessmentItems) {

        xoces.tree.clear(document.getElementById(WRAPPER_ID));

        let daoData = this._massageData({entities: nextProps.entities, relationships: nextProps.relationships});
        // console.log('daoData', daoData);

        let dag;
        if (nextProps.selectedOutcome) {
          dag = dao.getPathway(nextProps.selectedOutcome.id, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], 'OUTGOING_ALL', daoData);

        } else if (nextProps.selectedModule) {
          let nodes = dao.getOutgoingEntities(nextProps.selectedModule.id, ['mc3-relationship%3Amc3.lo.2.lo.parent.child%40MIT-OEIT'], daoData);
          dag = {
      	    nodes: nodes,
      	    edges: dao.getEdgeSet(_.map(nodes, 'id'), ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], daoData)
      	  };
        }

        let ranked = dao.rankDAG(dag, (item) => dao.getIncomingEntitiesAll(item.id, ['mc3-relationship%3Amc3.lo.2.lo.requisite%40MIT-OEIT'], daoData));
        let params = this._params();
        let layout = xoces.tree.layout(params, ranked, dag.edges);
        let styled = xoces.tree.style(params, layout);

        // console.log(ranked);

        xoces.tree.draw(styled, params, document.getElementById(WRAPPER_ID));
      }

      return false;
    },

    componentDidMount() {
      // === initialize the canvas
  		let wrapperEl = document.getElementById(WRAPPER_ID);
      let params = this._params();
  		wrapperEl.style.width = params.drawing.width + 'px';
  		wrapperEl.style.height = params.drawing.height + 'px';
    },

    render() {
      return (
        <div>
          <div id={WRAPPER_ID}></div>
        </div>
      )
    },

    _params() {
      return {
      	drawing: {
      		background: '#fff',
      		width: 1200,
      		height: 500
      	},
      	node: {
      		width: 15,
      		height: 15,
      		borderRadius: '50%',
      		fill: (outcome) => {
      			if (this._hasAssessmentItem(outcome.id, this.props.assessmentItems))	return '#AAD8B0';

      			return '#FF6F69';
      		}
      	},
      	nodeCenterLabel: {
      		fontSize: 10,
      		property: (outcome) => {
            // display the number of items that have this learning outcome
      			var items = _.filter(this.props.assessmentItems, function(item) {
      				return item.learningObjectiveIds.indexOf(outcome.id) > -1;
      			});

      			return items.length;
      		}
      	}
      };
    },

    _hasAssessmentItem(outcomeId, assessmentItems) {
      let taggedOutcomeIds = _.uniq(_.flatten(_.map(assessmentItems, 'learningObjectiveIds')));
      return taggedOutcomeIds.indexOf(outcomeId) > -1;
    },

    _massageData(data) {
      let entities = _.compact(_.map(data.entities, (o) => {
        return _.assign({}, o, {
          name: o.displayName.text
        })
      }));

      let relationships = _.map(data.relationships, (rel) => {
  			rel.type = rel.genusTypeId;
  			rel.targetId = rel.destinationId;
  			return rel;
  		});

      return {
        entities,
        relationships
      }
    }
});

module.exports = OutcomeTree;
