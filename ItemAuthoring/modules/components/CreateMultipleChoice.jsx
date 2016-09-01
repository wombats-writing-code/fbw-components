// CreateMultipleChoice.jsx
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

var CreateMultipleChoice = React.createClass({
    getInitialState: function () {
        return {
            correctAnswer: '',
            correctAnswerError: false,
            correctAnswerFeedback: '',
            itemDescription: '',
            itemDisplayName: '',
            itemDisplayNameError: false,
            newWrongAnswerIndices: [],
            questionFile: '',
            questionString: '',
            questionStringError: false,
            showAlert: false,
            showModal: true,
            wrongAnswers: [''],
            wrongAnswerErrors: [false]
        };
    },
    componentWillMount: function() {
    },
    componentDidUpdate: function () {
        setTimeout(this.checkNewEditorInstances, 500);
    },
    addWrongAnswer: function () {
        var newIndex = this.state.wrongAnswers.length + 1;
        this.setState({ wrongAnswers: this.state.wrongAnswers.concat(['']) });
        this.setState({ wrongAnswerErrors: this.state.wrongAnswerErrors.concat([false]) });

        this.setState({ newWrongAnswerIndices: [newIndex] });
    },
    checkNewEditorInstances: function () {
        if (this.state.newWrongAnswerIndices.length > 0) {
            this.initializeNewEditorInstances();
        }
    },
    close: function () {
        this.reset();
        this.props.close();
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
            wrongAnswers = this.getWrongAnswers();

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
            payload['solution'] = correctAnswerFeedback;

            _.each(wrongAnswers, function (wrongAnswer) {
                payload['question']['choices'].push(wrongAnswer);
            });
            payload['answers'] = [{
                genusTypeId: GenusTypes.CORRECT_ANSWER,
                choiceId: 0
            }];

            _.each(wrongAnswers, function (wrongAnswer, index) {
                var choiceIndex = index + 1,
                    data = {
                        genusTypeId: GenusTypes.WRONG_ANSWER,
                        choiceId: choiceIndex
                    };
                payload['answers'].push(data);
            });

            Dispatcher.dispatch({
                type: ActionTypes.CREATE_ITEM,
                content: payload
            });
            this.close();
        }
    },
    formatWrongAnswers: function () {
        var _this = this;
        return _.map(this.state.wrongAnswers, function (wrongAnswer, index) {
            var errorState = _this.state.wrongAnswerErrors[index];

            return <WrongAnswerEditor error={errorState}
                                      index={index}
                                      key={index}
                                      remove={_this.removeWrongAnswer}
                                      text={wrongAnswer.text} />
        });
    },
    getWrongAnswerFeedbacks: function () {
        var results = [];

        _.each(this.state.wrongAnswers, function (wrongAnswer, index) {
            var visibleIndex = index + 1,
                editorInstance = 'wrongAnswer' + visibleIndex,
                feedbackEditor = editorInstance + 'Feedback';
            results.push(CKEDITOR.instances[feedbackEditor].getData());
        });

        return results;
    },
    getWrongAnswers: function () {
        var results = [];
        _.each(this.state.wrongAnswers, function (wrongAnswer, index) {
            var visibleIndex = index + 1,
                editorInstance = 'wrongAnswer' + visibleIndex;
            results.push(CKEDITOR.instances[editorInstance].getData());
        });

        return results;
    },
    initializeEditorInstance: function (instance) {
        $s(MiddlewareService.ckEditor(), function () {
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
        $s(MiddlewareService.ckEditor(), function () {
            ConfigureCKEditor(CKEDITOR, repositoryId);
            _this.initializeEditorInstance('correctAnswer');
            _this.initializeEditorInstance('correctAnswerFeedback');
            _this.initializeEditorInstance('questionString');
            _this.initializeEditorInstance('wrongAnswer1');
            _this.initializeEditorInstance('wrongAnswer1Feedback');
        });
    },
    initializeNewEditorInstances: function () {
        var _this = this;
        _.each(this.state.newWrongAnswerIndices, function (index) {
            var visibleIndex = index,
                editorInstance = 'wrongAnswer' + visibleIndex;

            _this.initializeEditorInstance(editorInstance);
        });

        this.setState({ newWrongAnswerIndices: [] });
    },
    onChange: function(e) {
        var inputId = e.currentTarget.id,
            inputValue = e.target.value,
            update = {};

        update[inputId] = inputValue;
        this.setState(update);
    },
    removeWrongAnswer: function (index) {
        var editorInstance = 'wrongAnswer' + (index + 1),
            feedbackEditor = editorInstance + 'Feedback',
            updatedWrongAnswers = this.state.wrongAnswers,
            updatedWrongAnswerErrors = this.state.wrongAnswerErrors;

        updatedWrongAnswers.splice(index, 1);
        updatedWrongAnswerErrors.splice(index, 1);

        // remove wrong answer & feedback & errors with the given index
        this.setState({ wrongAnswers: updatedWrongAnswers });
        this.setState({ wrongAnswerErrors: updatedWrongAnswerErrors });

        if (this.state.wrongAnswers.length === 0) {
            this.setState({ wrongAnswers: [''] });
            this.setState({ wrongAnswerErrors: [false] });
        }

        this.resetEditorInstance(editorInstance);
        this.resetEditorInstance(feedbackEditor);
    },
    reset: function () {
        this.setState({ correctAnswer: '' });
        this.setState({ correctAnswerError: false });
        this.setState({ correctAnswerFeedback: '' });
        this.setState({ itemDescription: '' });
        this.setState({ itemDisplayName: '' });
        this.setState({ itemDisplayNameError: false });
        this.setState({ newWrongAnswerIndices: [] });
        this.setState({ questionFile: '' });
        this.setState({ questionString: '' });
        this.setState({ questionStringError: false });
        this.setState({ showAlert: false });
        this.setState({ wrongAnswers: [''] });
        this.setState({ wrongAnswerErrors: [false] });
    },
    resetEditorInstance: function (instance) {
        $s(MiddlewareService.ckEditor(), function () {
            CKEDITOR.instances[instance].setData('');
            CKEDITOR.instances[instance].destroy();
            CKEDITOR.replace(instance);
        });
    },
    render: function () {
        var alert = '',
            wrongAnswers = this.formatWrongAnswers(),
            correctAnswer, itemDisplayName, questionString;

        if (this.state.showAlert) {
            alert = <Alert bsStyle="danger">You are missing some required fields</Alert>
        }

        if (this.state.correctAnswerError) {
            correctAnswer = <FormGroup controlId="correctAnswer"
                                       validationState="error">
                <ControlLabel>Correct Answer</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.correctAnswer}
                             onChange={this.onChange}
                             placeholder="The correct answer"/>
                <FormControl.Feedback />
            </FormGroup>
        } else {
            correctAnswer = <FormGroup controlId="correctAnswer">
                <ControlLabel>Correct Answer</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.correctAnswer}
                             onChange={this.onChange}
                             placeholder="The correct answer"/>
            </FormGroup>
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

        return <Modal backdrop="static"
                      bsSize="lg"
                      show={this.props.showModal}
                      onHide={this.close}
                      onEntered={this.initializeEditors}>
            <Modal.Header closeButton>
                <Modal.Title>New Multiple Choice Question</Modal.Title>
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
                    {correctAnswer}
                    <FormGroup controlId="correctAnswerFeedback">
                        <ControlLabel>Solution Explanation (recommended)</ControlLabel>
                        <FormControl componentClass="textarea"
                                     value={this.state.correctAnswerFeedback}
                                     onChange={this.onChange}
                                     placeholder="Solution Explanation" />
                    </FormGroup>
                    {wrongAnswers}
                    <Button onClick={this.addWrongAnswer}
                            bsStyle="success">
                        <Glyphicon glyph="plus" />
                        Add Wrong Answer
                    </Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>Cancel</Button>
                <Button bsStyle="success" onClick={this.create}>Create</Button>
            </Modal.Footer>
        </Modal>
    }
});

module.exports = CreateMultipleChoice;