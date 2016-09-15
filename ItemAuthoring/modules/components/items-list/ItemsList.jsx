// ItemsList.js

'use strict';

require('./ItemsList.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Col = ReactBS.Col;
var Grid = ReactBS.Grid;
var Panel = ReactBS.Panel;
var Row = ReactBS.Row;

var AuthoringConstants = require('../../constants/AuthoringConstants');
var ChoiceLabels = AuthoringConstants.ChoiceLabels;
var GenusTypes = AuthoringConstants.GenusTypes;

var AnswerExtraction = require('../../utilities/AnswerExtraction');
var AnswerText = require('../answer-text/AnswerText');
var ItemControls = require('../ItemControls');
var ItemRow = require('../item-row/ItemRow');
var LOText = require('../lo-text/LOText');
var OutcomesStore = require('../../stores/OutcomesStore');
var QuestionText = require('../question-text/QuestionText');


var ItemsList = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {
      renderMathInElement(document.body);
    },
    componentDidUpdate: function () {
    },
    renderItems: function () {
      var _this = this;
      return _.map(this.props.sortedItems, function (item) {
        return <ItemRow enableClickthrough={_this.props.enableClickthrough}
                        item={item}
                        key={item.id}
                        libraries={_this.props.libraries}
                        libraryId={_this.props.libraryId}
                        outcomes={_this.props.outcomes}
                        refreshModulesAndOutcomes={_this.props.refreshModulesAndOutcomes}
                        relatedItems={_this.props.relatedItems} />
      });
    },
    render: function () {
        return <Grid>
            {this.renderItems()}
        </Grid>
    }
});

module.exports = ItemsList;
