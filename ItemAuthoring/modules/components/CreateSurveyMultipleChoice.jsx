// CreateSurveyMultipleChoice.jsx
'use strict';

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

var $s = require('scriptjs');

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var CKEditorModalHack = require('../utilities/CKEditorModalHack');
var ConfigureCKEditor = require('../utilities/ConfigureCKEditor');
var ConvertLibraryId2RepositoryId = require('../utilities/ConvertLibraryId2RepositoryId');
var GenusTypes = require('../constants/AuthoringConstants').GenusTypes;
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');
var LibraryItemsStore = require('../stores/LibraryItemsStore');
var MiddlewareService = require('../services/middleware.service.js');
var WrongAnswerEditor = require('./wrong-answer-editor/WrongAnswerEditor');

var CreateSurveyMultipleChoice = React.createClass({
    getInitialState: function () {
        return {
            choices: [''],
            itemDescription: '',
            itemDisplayName: '',
            itemDisplayNameError: false,
            questionFile: '',
            questionString: '',
            questionStringError: false,
            showAlert: false,
            showModal: true
        };
    },
    componentWillMount: function() {
    },
    componentDidUpdate: function () {
        setTimeout(this.checkNewEditorInstances, 500);
    },
    addChoice: function () {
        var newIndex = this.state.choices.length + 1;

        this.setState({ choices: this.state.choices.concat(['']) });

        this.setState({ newChoiceIndices: [newIndex] });
    },
    checkNewEditorInstances: function () {
        if (this.state.newChoiceIndices.length > 0) {
            this.initializeNewEditorInstances();
        }
    },
    create: function (e) {
        // With CKEditor, need to get the data from CKEditor,
        // not this.state. http://docs.ckeditor.com/#!/guide/dev_savedata
        // var data = CKEDITOR.instances.correctAnswer.getData();
        var payload = {
            libraryId: this.props.libraryId
        },
            correctAnswer = CKEDITOR.instances.correctAnswer.getData(),
            correctAnswerFeedback = CKEDITOR.instances.correctAnswerFeedback.getData(),
            questionString = CKEDITOR.instances.questionString.getData(),
            wrongAnswers = this.getWrongAnswers(),
            wrongAnswerFeedbacks = this.getWrongAnswerFeedbacks();

        if (this.state.itemDisplayName === '' ||
            correctAnswer === '' ||
            questionString === '' ||
            wrongAnswers.indexOf('') >= 0) {

            var firstEmptyWrongAnswer = wrongAnswers.indexOf(''),
                validationState = [];
            _.each(this.state.wrongAnswerErrors, function (errorState) {
                validationState.push(false);
            });

            if (firstEmptyWrongAnswer >= 0) {
                _.each(wrongAnswers, function (wrongAnswer, index) {
                    if (wrongAnswer === '') {
                        validationState[index] = true;
                    }
                });
            }

            this.setState({ showAlert: true });

            this.setState({ itemDisplayNameError: this.state.itemDisplayName === '' });
            this.setState({ correctAnswerError: correctAnswer === '' });
            this.setState({ questionStringError: questionString === '' });
            this.setState({ wrongAnswerErrors: validationState });
        } else {
            payload['itemType'] = 'multiple-choice';
            payload['displayName'] = this.state.itemDisplayName;
            payload['description'] = this.state.itemDescription;
            payload['question'] = {
                text: questionString,
                choices: [correctAnswer]
            };

            _.each(wrongAnswers, function (wrongAnswer) {
                payload['question']['choices'].push(wrongAnswer);
            });
            payload['answers'] = [{
                genusTypeId: GenusTypes.CORRECT_ANSWER,
                choiceId: 0,
                feedback: correctAnswerFeedback
            }];

            _.each(wrongAnswerFeedbacks, function (feedback, index) {
                var choiceIndex = index + 1,
                    data = {
                        genusTypeId: GenusTypes.WRONG_ANSWER,
                        choiceId: choiceIndex,
                        feedback: feedback
                    };
                payload['answers'].push(data);
            });

            Dispatcher.dispatch({
                type: ActionTypes.CREATE_ITEM,
                content: payload
            });
            this.props.close();
        }
    },
    formatChoices: function () {
        var _this = this;
        return _.map(this.state.choices, function (choice, index) {
            return <ChoiceEditor index={index}
                                 key={index}
                                 remove={_this.removeChoice}
                                 text={choice.text} />
        });
    },
    getChoices: function () {
        var results = [];
        _.each(this.state.choices, function (wrongAnswer, index) {
            var visibleIndex = index + 1,
                editorInstance = 'wrongAnswer' + visibleIndex;
            results.push(CKEDITOR.instances[editorInstance].getData());
        });

        return results;
    },
    initializeEditorInstance: function (instance) {
        $s(MiddlewareService.staticFiles() + '/fbw_author/js/vendor/ckeditor-custom/ckeditor.js', function () {
            CKEDITOR.replace(instance);
        });
    },
    initializeEditors: function (e) {
        var repositoryId = ConvertLibraryId2RepositoryId(this.props.libraryId),
            _this = this;
        // CKEditor
        // Instructions from here
        // http://stackoverflow.com/questions/29703324/how-to-use-ckeditor-as-an-npm-module-built-with-webpack-or-similar
        CKEditorModalHack();
        $s(MiddlewareService.staticFiles() + '/fbw_author/js/vendor/ckeditor-custom/ckeditor.js', function () {
            ConfigureCKEditor(CKEDITOR, repositoryId);
            _this.initializeEditorInstance('questionString');
        });
    },
    initializeNewEditorInstances: function () {
        var _this = this;
        _.each(this.state.newChoiceIndices, function (index) {
            var visibleIndex = index,
                editorInstance = 'choice' + visibleIndex;

            _this.initializeEditorInstance(editorInstance);
        });

        this.setState({ newChoiceIndices: [] });
    },
    onChange: function(e) {
        var inputId = e.currentTarget.id,
            inputValue = e.target.value,
            update = {};

        update[inputId] = inputValue;
        this.setState(update);
    },
    removeChoice: function (index) {
        var editorInstance = 'choice' + (index + 1),
            updatedChoices = this.state.choices;

        updatedChoices.splice(index, 1);

        // remove choice with the given index
        this.setState({ choices: updatedChoices });

        if (this.state.choices.length === 0) {
            this.setState({ choices: [''] });
        }

        this.resetEditorInstance(editorInstance);
    },
    resetEditorInstance: function (instance) {
        $s(MiddlewareService.staticFiles() + '/fbw_author/js/vendor/ckeditor-custom/ckeditor.js', function () {
            CKEDITOR.instances[instance].setData('');
            CKEDITOR.instances[instance].destroy();
            CKEDITOR.replace(instance);
        });
    },
    render: function () {
        var alert = '',
            choices = this.formatChoices(),
            itemDisplayName, questionString;

        if (this.state.showAlert) {
            alert = <Alert bsStyle="danger">You are missing some required fields</Alert>
        }

        if (this.state.itemDisplayNameError) {
            itemDisplayName = <FormGroup controlId="itemDisplayName"
                                         validationState="error">
                <ControlLabel>Item Name</ControlLabel>
                <FormControl type="text"
                             value={this.state.itemDisplayName}
                             onChange={this.onChange}
                             placeholder="A name for the item" />
                <FormControl.Feedback />
            </FormGroup>
        } else {
            itemDisplayName = <FormGroup controlId="itemDisplayName">
                <ControlLabel>Item Name</ControlLabel>
                <FormControl type="text"
                             value={this.state.itemDisplayName}
                             onChange={this.onChange}
                             placeholder="A name for the item" />
            </FormGroup>
        }

        if (this.state.questionStringError) {
            questionString = <FormGroup controlId="questionString"
                                        validationState="error">
                <ControlLabel>Question</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.questionString}
                             onChange={this.onChange}
                             placeholder="Please enter the question string, like 'What is your favorite color?'" />
                <FormControl.Feedback />
            </FormGroup>
        } else {
            questionString = <FormGroup controlId="questionString">
                <ControlLabel>Question</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.questionString}
                             onChange={this.onChange}
                             placeholder="Please enter the question string, like 'What is your favorite color?'" />
            </FormGroup>
        }

        return <Modal bsSize="lg"
                      show={this.props.showModal}
                      onHide={this.props.close}
                      onEntered={this.initializeEditors}>
            <Modal.Header closeButton>
                <Modal.Title>New Multiple Choice Survey Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {alert}
                <form>
                    {itemDisplayName}
                    <FormGroup controlId="itemDescription">
                        <ControlLabel>Item Description (optional)</ControlLabel>
                        <FormControl type="text"
                                     value={this.state.itemDescription}
                                     onChange={this.onChange}
                                     placeholder="A description for this item" />
                    </FormGroup>
                    {questionString}
                    {choices}
                    <Button onClick={this.addChoice}
                            bsStyle="success">
                        <Glyphicon glyph="plus" />
                        Add Choice
                    </Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.props.close}>Cancel</Button>
                <Button bsStyle="success" onClick={this.create}>Create</Button>
            </Modal.Footer>
        </Modal>
    }
});

module.exports = CreateSurveyMultipleChoice;