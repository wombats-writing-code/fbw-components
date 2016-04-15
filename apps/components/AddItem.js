// AddItem.js
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');
var ItemModal = require('./ItemModal');
var LibraryItemsStore = require('../stores/LibraryItemsStore');

var questionFile;

var AddItem = React.createClass({
    getInitialState: function () {
        return {
            correctAnswer: '',
            itemDescription: '',
            itemDisplayName: '',
            questionFile: '',
            questionString: '',
            showModal: false,
            wrongAnswer1: '',
            wrongAnswer2: '',
            wrongAnswer3: ''
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {

    },
    close: function () {
        this.setState({showModal: false});
    },
    create: function (payload) {
        payload['libraryId'] = this.props.libraryId;

        Dispatcher.dispatch({
            type: ActionTypes.CREATE_ITEM,
            content: payload
        });
        this.close();
    },
    open: function () {
        this.setState({showModal: true});
    },
    render: function () {
        // TODO: Add WYSIWYG editor so can add tables to questions / answers?
        return <div>
            <Button onClick={this.open}>
                <Glyphicon glyph="plus" />
                New Question
            </Button>
            <ItemModal show={this.state.showModal}
                       close={this.close}
                       save={this.create}
                       item='' />
        </div>
    }
});

module.exports = AddItem;