// OutcomeTree.js

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var ListGroup = ReactBS.ListGroup;

var OutcomesStore = require('../stores/OutcomesStore');
var Outcome = require('./Outcome');

var OutcomeTree = React.createClass({
    getInitialState: function () {
        var outcomesSeed = this.props.outcomes,
            outcomes = [];
        if (outcomesSeed != null) {
            outcomes = outcomesSeed;
        }
        return {
            outcomes: outcomes
        };
    },
    componentWillMount: function() {
        var _this = this;
        OutcomesStore.addChangeListener(function(outcomes) {
            _this.setState({ outcomes: outcomes });
        });
    },
    componentDidMount: function () {
        OutcomesStore.getAll();
    },
    renderOutcomes: function () {
        return _.map(this.state.outcomes, function (outcome) {
            return <Outcome outcome={outcome} key={outcome.id} />;
        });
    },
    render: function () {
        return <div className="outcome-list">
            <ListGroup>
                {this.renderOutcomes()}
            </ListGroup>
        </div>
    }
});

module.exports = OutcomeTree;