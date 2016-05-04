// EditItem.jsx
'use strict';

require('./EditItem.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormControl = ReactBS.FormControl;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var $s = require('scriptjs');

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var AnswerExtraction = require('../../utilities/AnswerExtraction');
var CKEditorModalHack = require('../../utilities/CKEditorModalHack');
var ConfigureCKEditor = require('../../utilities/ConfigureCKEditor');
var ConvertLibraryId2RepositoryId = require('../../utilities/ConvertLibraryId2RepositoryId');
var Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
var GenusTypes = require('../../constants/AuthoringConstants').GenusTypes;
var LibraryItemsStore = require('../../stores/LibraryItemsStore');
var MiddlewareService = require('../../services/middleware.service.js');
var WrongAnswerEditor = require('../wrong-answer-editor/WrongAnswerEditor');

var EditItem = React.createClass({
    getInitialState: function () {
        var me = this.props.item,
            answers = AnswerExtraction(me),
            wrongAnswerErrors = [];

        _.each(answers.wrongAnswers, function (wrongAnswer) {
            wrongAnswerErrors.push(false);
        });

        return {
            correctAnswer: answers.correctAnswerText.text,
            correctAnswerError: false,
            correctAnswerId: answers.correctAnswerId,
            correctAnswerFeedback: answers.correctAnswerFeedback,
            itemDescription: me.description.text,
            itemDisplayName: me.displayName.text,
            itemDisplayNameError: false,
            newWrongAnswerIndices: [],
            questionString: me.question.text.text,
            questionStringError: false,
            removedAnswerIds: [],
            removedChoiceIds: [],
            showAlert: false,
            showModal: false,
            wrongAnswers: answers.wrongAnswerTexts,
            wrongAnswerErrors: wrongAnswerErrors,
            wrongAnswerIds: answers.wrongAnswerIds,
            wrongAnswerFeedbacks: answers.wrongAnswerFeedbacks,
            wrongChoiceIds: answers.wrongChoiceIds
        };
    },
    componentWillMount: function () {

    },
    componentDidUpdate: function () {
        setTimeout(this.checkNewEditorInstances, 500);
    },
    addWrongAnswer: function () {
        var newIndex = this.state.wrongAnswers.length + 1;
        this.setState({ wrongAnswers: this.state.wrongAnswers.concat(['']) });
        this.setState({ wrongAnswerErrors: this.state.wrongAnswerErrors.concat([false]) });
        this.setState({ wrongAnswerFeedbacks: this.state.wrongAnswerFeedbacks.concat(['']) });

        this.setState({ newWrongAnswerIndices: [newIndex] });
    },
    checkNewEditorInstances: function () {
        if (this.state.newWrongAnswerIndices.length > 0) {
            this.initializeNewEditorInstances();
        }
    },
    close: function () {
        this.setState({ showModal: false });
    },
    closeAndReset: function () {
        this.setState({ showModal: false });
        this.reset();
    },
    formatWrongAnswers: function () {
        var _this = this;
        return _.map(this.state.wrongAnswers, function (wrongAnswer, index) {
            var errorState = _this.state.wrongAnswerErrors[index],
                feedback = _this.state.wrongAnswerFeedbacks[index];

            return <WrongAnswerEditor error={errorState}
                                      feedback={feedback}
                                      index={index}
                                      key={index}
                                      remove={_this.removeWrongAnswer}
                                      text={wrongAnswer.text} />
        });
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
            _this.initializeEditorInstance('correctAnswer');
            _this.initializeEditorInstance('correctAnswerFeedback');
            _this.initializeEditorInstance('questionString');

            _.each(_this.state.wrongAnswers, function (wrongAnswer, index) {
                var visibleIndex = index + 1,
                    editorInstance = 'wrongAnswer' + visibleIndex,
                    feedbackInstance = editorInstance + 'Feedback';

                _this.initializeEditorInstance(editorInstance);
                _this.initializeEditorInstance(feedbackInstance);
            });
        });
    },
    initializeNewEditorInstances: function () {
        var _this = this;
        _.each(this.state.newWrongAnswerIndices, function (index) {
            var visibleIndex = index,
                editorInstance = 'wrongAnswer' + visibleIndex,
                feedbackInstance = editorInstance + 'Feedback';

            _this.initializeEditorInstance(editorInstance);
            _this.initializeEditorInstance(feedbackInstance);
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
    open: function (e) {
        // This seems un-React-like (i.e. should do it via a Store?),
        // but if we attach an event listener in componentWillMount,
        // that leads to an event emitter memory leak warning. Because
        // every single item on the page would attach an event...

        var _this = this;
        this.setState({showModal: true});
    },
    removeWrongAnswer: function (index) {
        // remove wrong answer & feedback & errors with the given index
        // will also have to remove this from the actual item...
        // so store the choiceId + answerId in the component

        var editorInstance = 'wrongAnswer' + (index + 1),
            feedbackEditor = editorInstance + 'Feedback',
            wrongAnswerId = this.state.wrongAnswerIds[index],
            wrongChoiceId = this.state.wrongChoiceIds[index];

        this.setState({ wrongAnswers: this.state.wrongAnswers.splice(index, 1) });
        this.setState({ wrongAnswerErrors: this.state.wrongAnswerErrors.splice(index, 1) });
        this.setState({ wrongAnswerFeedbacks: this.state.wrongAnswerFeedbacks.splice(index, 1) });
        this.setState({ wrongAnswerIds: this.state.wrongAnswerIds.splice(index, 1) });
        this.setState({ wrongChoiceIds: this.state.wrongChoiceIds.splice(index, 1) });

        this.setState({ removedAnswerIds: this.state.removedAnswerIds.concat(wrongAnswerId) });
        this.setState({ wrongChoiceIds: this.state.wrongChoiceIds.concat(wrongChoiceId) });

        if (this.state.wrongAnswers.length === 0) {
            this.setState({ wrongAnswers: [''] });
            this.setState({ wrongAnswerErrors: [false] });
            this.setState({ wrongAnswerFeedbacks: [''] });
        }

        this.resetEditorInstance(editorInstance);
        this.resetEditorInstance(feedbackEditor);
    },
    reset: function() {
        var me = this.props.item,
            answers = AnswerExtraction(me),
            wrongAnswerErrors = [];

        _.each(answers.wrongAnswers, function (wrongAnswer) {
            wrongAnswerErrors.push(false);
        });

        this.setState({ correctAnswer: answers.correctAnswerText.text });
        this.setState({ correctAnswerError: false });
        this.setState({ correctAnswerId: answers.correctAnswerId });
        this.setState({ correctAnswerFeedback: '' });
        this.setState({ itemDescription: me.description.text });
        this.setState({ itemDisplayName: me.displayName.text });
        this.setState({ itemDisplayNameError: false });
        this.setState({ questionString: me.question.text.text });
        this.setState({ questionStringError: false });
        this.setState({ removedAnswerIds: [] });
        this.setState({ removedChoiceIds: [] });
        this.setState({ showAlert: false });
        this.setState({ wrongAnswers: answers.wrongAnswerTexts });
        this.setState({ wrongAnswerErrors: wrongAnswerErrors });
        this.setState({ wrongAnswerIds: answers.wrongAnswerIds });
        this.setState({ wrongAnswerFeedbacks: answers.wrongAnswerFeedbacks });
        this.setState({ wrongChoiceIds: answers.wrongChoiceIds });
    },
    save: function (e) {
        // NOTE: include all the deleted choices and answers
        //     up front in the wrongAnswer sections, with the "delete": true flag set
        // NOTE: the choiceId index for any new choices / answers should
        //     assume the index position post-delete

        var payload = {
            itemId: this.props.item.id,
            libraryId: this.props.libraryId
        },
            correctAnswer = CKEDITOR.instances.correctAnswer.getData(),
            correctAnswerFeedback = CKEDITOR.instances.correctAnswerFeedback.getData(),
            questionString = CKEDITOR.instances.questionString.getData(),
            wrongAnswer1 = CKEDITOR.instances.wrongAnswer1.getData(),
            wrongAnswer1Feedback = CKEDITOR.instances.wrongAnswer1Feedback.getData(),
            wrongAnswer2 = CKEDITOR.instances.wrongAnswer2.getData(),
            wrongAnswer2Feedback = CKEDITOR.instances.wrongAnswer2Feedback.getData(),
            wrongAnswer3 = CKEDITOR.instances.wrongAnswer3.getData(),
            wrongAnswer3Feedback = CKEDITOR.instances.wrongAnswer3Feedback.getData();

        if (this.state.itemDisplayName === '' ||
            correctAnswer === '' ||
            questionString === '' ||
            wrongAnswer1 === '' ||
            wrongAnswer2 === '' ||
            wrongAnswer3 === '') {
            this.setState({ showAlert: true });

            this.setState({ itemDisplayNameError: this.state.itemDisplayName === '' });
            this.setState({ correctAnswerError: correctAnswer === '' });
            this.setState({ questionStringError: questionString === '' });
            this.setState({ wrongAnswer1Error: wrongAnswer1 === '' });
            this.setState({ wrongAnswer2Error: wrongAnswer2 === '' });
            this.setState({ wrongAnswer3Error: wrongAnswer3 === '' });
        } else {
            var choiceData = AnswerExtraction(this.props.item);

            payload['displayName'] = this.state.itemDisplayName;
            payload['description'] = this.state.itemDescription;

            payload['question'] = {
                text: questionString,
                choices: [{
                    choiceId: choiceData.correctChoiceId,
                    text: correctAnswer
                },{
                    choiceId: choiceData.wrongChoiceIds[0],
                    text: wrongAnswer1
                },{
                    choiceId: choiceData.wrongChoiceIds[1],
                    text: wrongAnswer2
                },{
                    choiceId: choiceData.wrongChoiceIds[2],
                    text: wrongAnswer3
                }]
            };
            payload['answers'] = [{
                answerId: this.state.correctAnswerId,
                choiceId: choiceData.correctChoiceId,
                feedback: correctAnswerFeedback
            },{
                answerId: this.state.wrongAnswer1Id,
                choiceId: choiceData.wrongChoiceIds[0],
                feedback: wrongAnswer1Feedback
            },{
                answerId: this.state.wrongAnswer2Id,
                choiceId: choiceData.wrongChoiceIds[1],
                feedback: wrongAnswer2Feedback
            },{
                answerId: this.state.wrongAnswer3Id,
                choiceId: choiceData.wrongChoiceIds[2],
                feedback: wrongAnswer3Feedback
            }];

            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_ITEM,
                content: payload
            });
            this.close();
        }
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

        return <div>
            <Button onClick={this.open}
                    bsSize="large"
                    title="Edit Item">
                <Glyphicon glyph="pencil" />
            </Button>
            <Modal bsSize="lg"
                   show={this.state.showModal}
                   onHide={this.close}
                   onEntered={this.initializeEditors}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Question</Modal.Title>
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
                            <ControlLabel>Correct Answer Feedback (recommended)</ControlLabel>
                            <FormControl componentClass="textarea"
                                         value={this.state.correctAnswerFeedback}
                                         onChange={this.onChange}
                                         placeholder="Feedback for the correct answer" />
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
                    <Button onClick={this.closeAndReset}>Close</Button>
                    <Button bsStyle="success" onClick={this.save}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
});

module.exports = EditItem;