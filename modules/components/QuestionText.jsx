// QuestionText.js

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Modal = ReactBS.Modal;
var Button = ReactBS.Button;

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var dispatcher = require('../dispatcher/LibraryItemsDispatcher');

var QuestionText = React.createClass({
    getInitialState: function () {
        return {
        }
    },
    showLearningObjectives: function (e) {

    },
    render: function () {
        var childOutcomes = '';
        if (this.state.showChildren) {
            if (this.props.outcome.hasOwnProperty('childNodes')) {
                if (this.props.outcome.childNodes.length > 0) {
                    childOutcomes = this.props.outcome.childNodes.map(function (child) {
                        return (
                            <Outcome outcome={child} key={child.id}/>
                            );
                    });
                } else {
                    childOutcomes = <Alert bsStyle="danger">
                    No children
                    </Alert>
                }
            } else {
                childOutcomes = <Alert bsStyle="danger">
                No children
                </Alert>
            }
        }
        return <div>
            <ListGroupItem className={this.state.selfState}
                   data-raw-obj="{this.props.outcome}"
                   title="{this.props.outcome.description.text}"
                   onClick={this.toggleState}>
                <span className={this.state.toggleIcon} onClick={this.toggleChildren}></span>
                <span className="display-name">{this.props.outcome.displayName.text}</span>
            </ListGroupItem>
            {childOutcomes}
        </div>

    }
});

module.exports = QuestionText;