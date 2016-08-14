var React = require('react');
var Q = require('q');
var Select = require('react-select');
require('react-select/dist/react-select.css');

var OutcomeTree = require('./OutcomeTree')

var Dashboard = React.createClass({

  getInitialState () {
     return {
       selectedOutcome: null,
       selectedModule: null,
       outcomes: null,
       modules: null,
       relationships: null,
       assessmentItems: null
     };
  },

  componentDidMount() {
    // remove this when done. this data should be passed down from props,
    // because I think you're already grabbing outcomes and items from above
    Q.all([fetch('/modules/components/dashboard/objectives.json'), fetch('/modules/components/dashboard/relationships.json'), fetch('/modules/components/dashboard/items.json')])
    .then( (res) => {
      return Q.all([res[0].json(), res[1].json(), res[2].json()]);
    })
    .then( (data) => {
      let outcomes = _.map(_.filter(data[0], {genusTypeId: "mc3-objective%3Amc3.learning.outcome%40MIT-OEIT"}), (item) => {
        return _.assign({}, item, {
          value: item.id,
          label: item.displayName.text
        })
      });
      let modules = _.map(_.filter(data[0], {genusTypeId: "mc3-objective%3Amc3.learning.topic%40MIT-OEIT"}), (item) => {
        return _.assign({}, item, {
          value: item.id,
          label: item.displayName.text
        })
      });
      let relationships = data[1];
      let assessmentItems = data[2];

      this.setState({
        outcomes, modules, relationships, assessmentItems
      })
    });
  },

  render() {
    let entities = this.state.outcomes ? this.state.outcomes.concat(this.state.modules) : null;

    return (
      <div className="">

        <div className="row">
          <div className="medium-6 columns">
            <p>Select a learning outcome to visualize it.</p>
            <p>(root node is selected outcome).</p>
            <Select label="Outcomes"
                name="select-outcome"
                value={null}
                options={this.state.outcomes}
                onChange={this.onSelectOutcome}
            />
          </div>
          <div className="medium-6 columns">
            <p>or select a module to visualize its outcomes</p>
            <p>(node rank is global).</p>
            <Select label="Modules"
                name="select-module"
                value={null}
                options={this.state.modules}
                onChange={this.onSelectModule}
                valueRenderer={(item) => item.displayName.text}
            />
          </div>
        </div>

        <OutcomeTree selectedOutcome={this.state.selectedOutcome}
                    selectedModule={this.state.selectedModule}
                    entities={entities}
                    relationships={this.state.relationships}
                    assessmentItems={this.state.assessmentItems}
        />
      </div>
    )
  },

  onSelectOutcome(outcome) {
    // console.log(outcome);

    this.setState({
      selectedOutcome: outcome,
      selectedModule: null,
    })
  },

  onSelectModule(module) {
    // console.log(module);

    this.setState({
      selectedOutcome: null,
      selectedModule: module,
    })
  }

});

module.exports = Dashboard;
