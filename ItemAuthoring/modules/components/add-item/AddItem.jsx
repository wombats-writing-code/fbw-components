// AddItem.js
'use strict';

require('./AddItem.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormControl = ReactBS.FormControl;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var _ = require('lodash');

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var CreateMultipleChoice = require('../CreateMultipleChoice');
var GenusTypes = require('../../constants/AuthoringConstants').GenusTypes;
var ItemTypesStore = require('../../stores/ItemTypesStore');


var AddItem = React.createClass({
    getInitialState: function () {
        return {
            itemTypes: [],
            questionType: '',
            showFormModal: false,
            showTypeModal: false
        };
    },
    componentWillMount: function() {
        var _this = this;
        ItemTypesStore.addChangeListener(function(itemTypes) {
            _this.setState({ itemTypes: itemTypes });
        });
    },
    componentDidMount: function () {
        ItemTypesStore.getSupportedItemTypes(this.props.libraryId);
    },
    closeFormModal: function () {
        this.setState({ showFormModal: false });
    },
    closeTypeModal: function () {
        this.setState({ showTypeModal: false });
    },
    onChange: function (e) {
        var option = e.currentTarget.selectedOptions[0],
            questionType = option.value;
        if (questionType !== '-1') {
            this.setState({ questionType: questionType });
        }
    },
    openTypeModal: function () {
        this.setState({ showTypeModal: true });
    },
    renderQuestionTypes: function () {
        return _.map(this.state.itemTypes, function (itemType, key) {
            return <option value={key}
                           key={key}>{itemType}</option>;
        });
    },
    showForm: function () {
        this.closeTypeModal();
        this.setState({ showFormModal: true });
    },
    render: function () {
        var questionForm = '';

        if (this.state.questionType === 'multiple-choice') {
            questionForm = <CreateMultipleChoice close={this.closeFormModal}
                                                 libraryId={this.props.libraryId}
                                                 showModal={this.state.showFormModal} />
        }

        return <div>
            <Button onClick={this.openTypeModal}>
                <Glyphicon glyph="plus" />
                New Question
            </Button>
            <Modal bsSize="lg"
                   show={this.state.showTypeModal}
                   onHide={this.closeTypeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Question Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup controlId="itemType">
                            <ControlLabel>Question Type</ControlLabel>
                            <FormControl componentClass="select"
                                         onChange={this.onChange}
                                         placeholder="Select a question type ...">
                                <option value="-1">Please select a question type ... </option>
                                {this.renderQuestionTypes()}
                            </FormControl>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.closeTypeModal}>Cancel</Button>
                    <Button bsStyle="success" onClick={this.showForm}>Next</Button>
                </Modal.Footer>
            </Modal>
            {questionForm}
        </div>
    }
});

module.exports = AddItem;