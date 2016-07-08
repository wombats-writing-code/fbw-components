// EditMultipleChoice.jsx
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormControl = ReactBS.FormControl;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var ListGroup = ReactBS.ListGroup;
var Modal = ReactBS.Modal;

var $s = require('scriptjs');

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var AnswerExtraction = require('../utilities/AnswerExtraction');
var CKEditorModalHack = require('../utilities/CKEditorModalHack');
var ConfigureCKEditor = require('../utilities/ConfigureCKEditor');
var ConvertLibraryId2RepositoryId = require('../utilities/ConvertLibraryId2RepositoryId');
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');
var GenusTypes = require('../constants/AuthoringConstants').GenusTypes;
var LibraryItemsStore = require('../stores/LibraryItemsStore');
var MiddlewareService = require('../services/middleware.service.js');
var WrongAnswerEditor = require('./wrong-answer-editor/WrongAnswerEditor');

var EditMultipleChoice = React.createClass({
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
    componentWillReceiveProps: function (nextProps) {
        this.checkState(nextProps);
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
    checkState: function (nextProps) {
      var me = nextProps.item,
          answers = AnswerExtraction(me),
          wrongAnswerFeedbacks = [];

      if (answers.correctAnswerFeedback != this.state.correctAnswerFeedback) {
          this.setState({ correctAnswerFeedback: answers.correctAnswerFeedback });
      }

      _.each(answers.wrongAnswerFeedbacks, function (feedback) {
          wrongAnswerFeedbacks.push(feedback)
      });

      if (wrongAnswerFeedbacks != this.state.wrongAnswerFeedbacks) {
          this.setState({ wrongAnswerFeedbacks: wrongAnswerFeedbacks });
      }

      if (answers.correctAnswerText.text != this.state.correctAnswer) {
        this.setState({ correctAnswer: answers.correctAnswerText.text });
      }

      if (answers.correctAnswerId != this.state.correctAnswerId) {
        this.setState({ correctAnswerId: answers.correctAnswerId });
      }

      if (me.description.text != this.state.itemDescription) {
        this.setState({ itemDescription: me.description.text });
      }

      if (me.displayName.text != this.state.itemDisplayName) {
        this.setState({ itemDisplayName: me.displayName.text });
      }

      if (me.question.text.text != this.state.questionString) {
        this.setState({ questionString: me.question.text.text });
      }

      if (answers.wrongAnswerTexts != this.state.wrongAnswers) {
        this.setState({ wrongAnswers: answers.wrongAnswerTexts });
      }

      if (answers.wrongAnswerIds != this.state.wrongAnswerIds) {
        this.setState({ wrongAnswerIds: answers.wrongAnswerIds });
      }

      if (answers.wrongChoiceIds != this.state.wrongChoiceIds) {
        this.setState({ wrongChoiceIds: answers.wrongChoiceIds });
      }
    },
    close: function () {
        this.props.close();
    },
    closeAndReset: function () {
        this.reset();
        this.close();
    },
    formatWrongAnswers: function () {
        var _this = this;
        return _.map(this.state.wrongAnswers, function (wrongAnswer, index) {
            var errorState = _this.state.wrongAnswerErrors[index],
                feedback = _this.state.wrongAnswerFeedbacks[index],
                answerId = _this.state.wrongAnswerIds[index],
                choiceId = _this.state.wrongChoiceIds[index],
                key = typeof answerId === 'undefined' ? index : answerId;

            return <WrongAnswerEditor answerId={answerId}
                                      choiceId={choiceId}
                                      error={errorState}
                                      feedback={feedback}
                                      index={index}
                                      key={key}
                                      remove={_this.removeWrongAnswer}
                                      text={wrongAnswer.text} />
        });
    },
    getWrongAnswerChoiceIds: function () {
        var results = [];
        _.each(this.refs.wrongAnswers.props.children, function (wrongAnswerEditor) {
            if (wrongAnswerEditor.props.choiceId !== 'undefined') {
                results.push(wrongAnswerEditor.props.choiceId);
            } else {
                results.push(null);
            }
        });

        return results;
    },
    getWrongAnswerEditorIds: function () {
        var results = [];
        _.each(this.refs.wrongAnswers.props.children, function (wrongAnswerEditor) {
            if (wrongAnswerEditor.key !== 'undefined') {
                results.push(wrongAnswerEditor.key);
            } else {
                results.push(null);
            }
        });

        return results;
    },
    getWrongAnswerFeedbacks: function () {
        var results = [];

        _.each(this.refs.wrongAnswers.props.children, function (wrongAnswerEditor, index) {
            var visibleIndex = index + 1,
                editorInstance = 'wrongAnswer' + visibleIndex,
                feedbackEditor = editorInstance + 'Feedback';
            results.push(CKEDITOR.instances[feedbackEditor].getData());
        });

        return results;
    },
    getWrongAnswers: function () {
        var results = [];
        _.each(this.refs.wrongAnswers.props.children, function (wrongAnswerEditor, index) {
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
    removeWrongAnswer: function (index) {
        // remove wrong answer & feedback & errors with the given index
        // will also have to remove this from the actual item...
        // so store the choiceId + answerId in the component

        var editorInstance = 'wrongAnswer' + (index + 1),
            feedbackEditor = editorInstance + 'Feedback',
            wrongAnswerId = this.state.wrongAnswerIds[index],
            wrongChoiceId = this.state.wrongChoiceIds[index],
            updatedWrongAnswers = this.state.wrongAnswers,
            updatedWrongAnswerErrors = this.state.wrongAnswerErrors,
            updatedWrongAnswerFeedbacks = this.state.wrongAnswerFeedbacks,
            updatedWrongAnswerIds = this.state.wrongAnswerIds,
            updatedWrongChoiceIds = this.state.wrongChoiceIds,
            _this = this;

        // need to remove the CKEditor instances on wrongAnswers
        // before React re-renders the DOM, otherwise the instance
        // values won't match, i.e. wrongAnswer1 will have CKEditor instance wrongAnswer2
        _.each(this.state.wrongAnswers, function (wrongAnswer, index) {
            var remainingInstance = 'wrongAnswer' + (index + 1),
                feedbackInstance = remainingInstance + 'Feedback';
                CKEDITOR.instances[remainingInstance].destroy();
                CKEDITOR.instances[feedbackInstance].destroy();
        });

        updatedWrongAnswers.splice(index, 1);
        updatedWrongAnswerErrors.splice(index, 1);
        updatedWrongAnswerFeedbacks.splice(index, 1);
        updatedWrongAnswerIds.splice(index, 1);
        updatedWrongChoiceIds.splice(index, 1);

        this.setState({ wrongAnswers: updatedWrongAnswers });
        this.setState({ wrongAnswerErrors: updatedWrongAnswerErrors });
        this.setState({ wrongAnswerFeedbacks: updatedWrongAnswerFeedbacks });
        this.setState({ wrongAnswerIds: updatedWrongAnswerIds });
        this.setState({ wrongChoiceIds: updatedWrongChoiceIds });

        this.setState({ removedAnswerIds: this.state.removedAnswerIds.concat(wrongAnswerId) });
        this.setState({ removedChoiceIds: this.state.removedChoiceIds.concat(wrongChoiceId) });

        if (this.state.wrongAnswers.length === 0) {
            this.setState({ wrongAnswers: [''] });
            this.setState({ wrongAnswerErrors: [false] });
            this.setState({ wrongAnswerFeedbacks: [''] });
        }

        // can we re-add the CKEditors here? Is that enough time?
        setTimeout(function () {
            _.each(_this.state.wrongAnswers, function (wrongAnswer, index) {
            var remainingInstance = 'wrongAnswer' + (index + 1),
                feedbackInstance = remainingInstance + 'Feedback';
                CKEDITOR.replace(remainingInstance);
                CKEDITOR.replace(feedbackInstance);
        });
        }, 250);
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
        this.setState({ correctAnswerFeedback: answers.correctAnswerFeedback });
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
            wrongAnswers = this.getWrongAnswers(),
            wrongAnswerFeedbacks = this.getWrongAnswerFeedbacks(),
            wrongAnswerIds = this.getWrongAnswerEditorIds(),
            wrongChoiceIds = this.getWrongAnswerChoiceIds(),
            _this = this;

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
            var choiceData = AnswerExtraction(this.props.item);

            payload['displayName'] = this.state.itemDisplayName;
            payload['description'] = this.state.itemDescription;

            payload['question'] = {
                text: questionString,
                choices: [{
                    choiceId: choiceData.correctChoiceId,
                    text: correctAnswer
                }]
            };

            _.each(this.state.removedChoiceIds, function (choiceId) {
                payload.question.choices.push({
                    choiceId: choiceId,
                    delete: true
                });
            });

            _.each(wrongAnswers, function (wrongAnswer, index) {
                var wrongChoiceId = wrongChoiceIds[index];

                if (_this.state.removedChoiceIds.indexOf(wrongChoiceId) < 0) {
                    // choice was not deleted, so add it back to the
                    // payload with the given MC3 ID
                    if (wrongChoiceId != null) {
                        payload.question.choices.push({
                            choiceId: wrongChoiceId,
                            text: wrongAnswer
                        });
                    } else {
                        // or create a new choice here
                        payload.question.choices.push({
                            text: wrongAnswer
                        });
                    }
                }
            });

            payload['answers'] = [{
                answerId: this.state.correctAnswerId,
                choiceId: choiceData.correctChoiceId,
                feedback: correctAnswerFeedback
            }];

            _.each(this.state.removedAnswerIds, function (answerId) {
                payload.answers.push({
                    answerId: answerId,
                    delete: true
                });
            });

            _.each(wrongAnswerFeedbacks, function (feedback, index) {
                var wrongAnswerId = wrongAnswerIds[index],
                    wrongChoiceId = wrongChoiceIds[index];

                if (_this.state.removedAnswerIds.indexOf(wrongAnswerId) < 0) {
                    // answer was not deleted, so add it back to the
                    // payload with the given MC3 ID
                    if (wrongAnswerId.indexOf('assessment.Answer') >= 0) {
                        payload.answers.push({
                            answerId: wrongAnswerId,
                            choiceId: wrongChoiceId,
                            feedback: feedback
                        });
                    } else {
                        // or create a new answer mapping here
                        payload.answers.push({
                            choiceId: index + 1,
                            feedback: feedback,
                            genusTypeId: GenusTypes.WRONG_ANSWER
                        });
                    }
                }
            });

            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_ITEM,
                content: payload
            });
            this.close();
//            setTimeout(this.reset, 1000);
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

        return <Modal backdrop="static"
                      bsSize="lg"
                      show={this.props.showModal}
                      onHide={this.closeAndReset}
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
                    <ListGroup ref="wrongAnswers">
                        {wrongAnswers}
                    </ListGroup>
                    <Button onClick={this.addWrongAnswer}
                            bsStyle="success">
                        <Glyphicon glyph="plus" />
                        Add Wrong Answer
                    </Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.closeAndReset}>Cancel</Button>
                <Button bsStyle="success" onClick={this.save}>Save</Button>
            </Modal.Footer>
        </Modal>
    }
});

module.exports = EditMultipleChoice;