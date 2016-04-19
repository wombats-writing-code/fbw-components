// Outcome.js

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var ListGroupItem = ReactBS.ListGroupItem;

var Outcome = React.createClass({
    getInitialState: function () {
        return {
            showChildren: false,
            toggleIcon: "fa fa-caret-right toggle-children",
            selfState: "outcome"
        }
    },
    stopPropagation: function (e) {
        e.preventDefault();
        e.stopPropagation();
    },
    toggleChildren: function (e) {
        var toggleIcon = "fa toggle-children",
            selfState = "outcome";
        this.setState({showChildren: !this.state.showChildren});
        toggleIcon += this.state.showChildren ? " fa-caret-right" : " fa-caret-down";
        selfState += this.state.showChildren ? "" : " expanded";
        this.setState({toggleIcon: toggleIcon});
        this.setState({selfState: selfState});
        console.log('toggle me');
        this.stopPropagation(e);
    },
    toggleState: function (e) {
        var $e = $(e.currentTarget);
        $('.outcome').removeClass('selected');
        $e.toggleClass('selected');
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

module.exports = Outcome;