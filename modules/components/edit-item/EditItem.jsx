// EditItem.jsx
'use strict';

require('./EditItem.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var EditMultipleChoice = require('../EditMultipleChoice');
var GenusTypes = require('../../constants/AuthoringConstants').GenusTypes;

var EditItem = React.createClass({
    getInitialState: function () {
        return {
            showModal: false
        };
    },
    componentWillMount: function () {

    },
    componentDidUpdate: function () {

    },
    close: function () {
        this.setState({ showModal: false });
    },
    open: function (e) {
        this.setState({ showModal: true});
    },
    render: function () {
        var questionForm = '';

        if (this.props.item.question.genusTypeId === GenusTypes.MC_QUESTION) {
            questionForm = <EditMultipleChoice close={this.close}
                                               item={this.props.item}
                                               libraryId={this.props.libraryId}
                                               showModal={this.state.showModal} />;
        }

        return <div>
            <Button onClick={this.open}
                    bsSize="large"
                    title="Edit Item">
                <Glyphicon glyph="pencil" />
            </Button>
            {questionForm}
        </div>
    }
});

module.exports = EditItem;