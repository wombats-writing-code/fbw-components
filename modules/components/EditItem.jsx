// EditItem.jsx
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

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var AnswerExtraction = require('../utilities/AnswerExtraction');
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');
var GenusTypes = require('../constants/AuthoringConstants').GenusTypes;

var questionFile;

var EditItem = React.createClass({
    getInitialState: function () {
        var me = this.props.item,
            answers = AnswerExtraction(me),
            currentImage = me.question.hasOwnProperty('files') ? me.question.files.imageFile : '';

        return {
            correctAnswer: answers.correctAnswerText.text,
            correctAnswerError: false,
            correctAnswerId: answers.correctAnswerId,
            correctAnswerFeedback: '',
            itemDescription: me.description.text,
            itemDisplayName: me.displayName.text,
            itemDisplayNameError: false,
            questionFile: currentImage,
            questionString: me.question.text.text,
            questionStringError: false,
            showAlert: false,
            showModal: false,
            wrongAnswer1: answers.wrongAnswerTexts[0].text,
            wrongAnswer1Error: false,
            wrongAnswer1Id: answers.wrongAnswerIds[0],
            wrongAnswer1Feedback: '',
            wrongAnswer2: answers.wrongAnswerTexts[1].text,
            wrongAnswer2Error: false,
            wrongAnswer2Id: answers.wrongAnswerIds[1],
            wrongAnswer2Feedback: '',
            wrongAnswer3: answers.wrongAnswerTexts[2].text,
            wrongAnswer3Error: false,
            wrongAnswer3Id: answers.wrongAnswerIds[2],
            wrongAnswer3Feedback: ''
        };
    },
    close: function () {
        this.setState({showModal: false});
    },
    closeAndReset: function () {
        this.setState({showModal: false});
        this.reset();
    },
    onChange: function(e) {
        var inputId = e.currentTarget.id,
            inputValue = e.target.value;
        if (inputId === "questionFile") {
            questionFile = e.target.files[0];
        } else {
            var update = {};
            update[inputId] = inputValue;
            this.setState(update);
        }
    },
    open: function (e) {
        this.setState({showModal: true}, function () {

        });
    },
    reset: function() {
        var me = this.props.item,
            answers = AnswerExtraction(me);
        questionFile = null;
        this.setState({ correctAnswer: answers.correctAnswerText.text });
        this.setState({ correctAnswerError: false });
        this.setState({ correctAnswerId: answers.correctAnswerId });
        this.setState({ correctAnswerFeedback: '' });
        this.setState({ itemDescription: me.description.text });
        this.setState({ itemDisplayName: me.displayName.text });
        this.setState({ itemDisplayNameError: false });
        this.setState({ questionFile: me.question.hasOwnProperty('files') ? me.question.files.imageFile : '' });
        this.setState({ questionString: me.question.text.text });
        this.setState({ questionStringError: false });
        this.setState({ showAlert: false });
        this.setState({ wrongAnswer1: answers.wrongAnswerTexts[0].text });
        this.setState({ wrongAnswer1Error: false });
        this.setState({ wrongAnswer1Id: answers.wrongAnswerIds[0] });
        this.setState({ wrongAnswer1Feedback: '' });
        this.setState({ wrongAnswer2: answers.wrongAnswerTexts[1].text });
        this.setState({ wrongAnswer2Error: false });
        this.setState({ wrongAnswer2Id: answers.wrongAnswerIds[1] });
        this.setState({ wrongAnswer2Feedback: '' });
        this.setState({ wrongAnswer3: answers.wrongAnswerTexts[2].text });
        this.setState({ wrongAnswer3Error: false });
        this.setState({ wrongAnswer3Id: answers.wrongAnswerIds[2] });
        this.setState({ wrongAnswer3Feedback: '' });
    },
    save: function (e) {
        var payload = {
            itemId: this.props.item.id,
            libraryId: this.props.libraryId
        };

        if (this.state.itemDisplayName === '' ||
            this.state.correctAnswer === '' ||
            this.state.questionString === '' ||
            this.state.wrongAnswer1 === '' ||
            this.state.wrongAnswer2 === '' ||
            this.state.wrongAnswer3 === '') {
            this.setState({ showAlert: true });

            this.setState({ itemDisplayNameError: this.state.itemDisplayName === '' });
            this.setState({ correctAnswerError: this.state.correctAnswer === '' });
            this.setState({ questionStringError: this.state.questionString === '' });
            this.setState({ wrongAnswer1Error: this.state.wrongAnswer1 === '' });
            this.setState({ wrongAnswer2Error: this.state.wrongAnswer2 === '' });
            this.setState({ wrongAnswer3Error: this.state.wrongAnswer3 === '' });
        } else {
            var choiceData = AnswerExtraction(this.props.item);

            payload['displayName'] = this.state.itemDisplayName;
            payload['description'] = this.state.itemDescription;

            payload['question'] = {
                text: this.state.questionString,
                choices: [{
                    choiceId: choiceData.correctChoiceId,
                    text: this.state.correctAnswer
                },{
                    choiceId: choiceData.wrongChoiceIds[0],
                    text: this.state.wrongAnswer1
                },{
                    choiceId: choiceData.wrongChoiceIds[1],
                    text: this.state.wrongAnswer2
                },{
                    choiceId: choiceData.wrongChoiceIds[2],
                    text: this.state.wrongAnswer3
                }]
            };
            payload['answers'] = [{
                answerId: this.state.correctAnswerId,
                choiceId: choiceData.correctChoiceId,
                feedback: this.state.correctAnswerFeedback
            },{
                answerId: this.state.wrongAnswer1Id,
                choiceId: choiceData.wrongChoiceIds[0],
                feedback: this.state.wrongAnswer1Feedback
            },{
                answerId: this.state.wrongAnswer2Id,
                choiceId: choiceData.wrongChoiceIds[1],
                feedback: this.state.wrongAnswer2Feedback
            },{
                answerId: this.state.wrongAnswer3Id,
                choiceId: choiceData.wrongChoiceIds[2],
                feedback: this.state.wrongAnswer3Feedback
            }];
            if (questionFile != null) {
                payload['questionFile'] = questionFile;
            }

            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_ITEM,
                content: payload
            });
            this.close();
        }
    },
    render: function () {
        // TODO: Add WYSIWYG editor so can add tables to questions / answers?
        var alert = '',
            correctAnswer, itemDisplayName, questionString, wrongAnswer1,
            wrongAnswer2, wrongAnswer3;

        if (this.state.showAlert) {
            alert = <Alert bsStyle="danger">You are missing some required fields</Alert>
        }

        if (this.state.correctAnswerError) {
            correctAnswer = <FormGroup controlId="correctAnswer"
                                       validationState="error">
                <ControlLabel>Correct Answer</ControlLabel>
                <FormControl type="text"
                             value={this.state.correctAnswer}
                             onChange={this.onChange}
                             placeholder="The correct answer"/>
                <FormControl.Feedback />
            </FormGroup>
        } else {
            correctAnswer = <FormGroup controlId="correctAnswer">
                <ControlLabel>Correct Answer</ControlLabel>
                <FormControl type="text"
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

        if (this.state.wrongAnswer1Error) {
            wrongAnswer1 = <FormGroup controlId="wrongAnswer1"
                                      validationState="error">
                <ControlLabel>Wrong Answer 1</ControlLabel>
                <FormControl type="text"
                             value={this.state.wrongAnswer1}
                             onChange={this.onChange}
                             placeholder="The first mis-direction answer" />
                <FormControl.Feedback />
            </FormGroup>
        } else {
            wrongAnswer1 = <FormGroup controlId="wrongAnswer1">
                <ControlLabel>Wrong Answer 1</ControlLabel>
                <FormControl type="text"
                             value={this.state.wrongAnswer1}
                             onChange={this.onChange}
                             placeholder="The first mis-direction answer" />
            </FormGroup>
        }

        if (this.state.wrongAnswer2Error) {
            wrongAnswer2 = <FormGroup controlId="wrongAnswer2"
                                      validationState="error">
                <ControlLabel>Wrong Answer 2</ControlLabel>
                <FormControl type="text"
                             value={this.state.wrongAnswer2}
                             onChange={this.onChange}
                             placeholder="The second mis-direction answer" />
                <FormControl.Feedback />
            </FormGroup>
        } else {
            wrongAnswer2 = <FormGroup controlId="wrongAnswer2">
                <ControlLabel>Wrong Answer 2</ControlLabel>
                <FormControl type="text"
                             value={this.state.wrongAnswer2}
                             onChange={this.onChange}
                             placeholder="The second mis-direction answer" />
            </FormGroup>
        }

        if (this.state.wrongAnswer3Error) {
            wrongAnswer3 = <FormGroup controlId="wrongAnswer3"
                                      validationState="error">
                <ControlLabel>Wrong Answer 3</ControlLabel>
                <FormControl type="text"
                             value={this.state.wrongAnswer3}
                             onChange={this.onChange}
                             placeholder="The third mis-direction answer" />
                <FormControl.Feedback />
            </FormGroup>
        } else {
            wrongAnswer3 = <FormGroup controlId="wrongAnswer3">
                <ControlLabel>Wrong Answer 3</ControlLabel>
                <FormControl type="text"
                             value={this.state.wrongAnswer3}
                             onChange={this.onChange}
                             placeholder="The third mis-direction answer" />
            </FormGroup>
        }

        return <div>
            <Button onClick={this.open} bsSize="large">
                <Glyphicon glyph="pencil" />
            </Button>
            <Modal bsSize="lg" show={this.state.showModal} onHide={this.close}>
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
                        <FormGroup controlId="questionFile">
                            <ControlLabel>Image File (optional)</ControlLabel>
                            <FormControl type="file"
                                         onChange={this.onChange} />
                        </FormGroup>
                        {correctAnswer}
                        <FormGroup controlId="correctAnswerFeedback">
                            <ControlLabel>Correct Answer Feedback (recommended)</ControlLabel>
                            <FormControl componentClass="textarea"
                                         value={this.state.correctAnswerFeedback}
                                         onChange={this.onChange}
                                         placeholder="Feedback for the correct answer" />
                        </FormGroup>
                        {wrongAnswer1}
                        <FormGroup controlId="wrongAnswer1Feedback">
                            <ControlLabel>Wrong Answer 1 Feedback (recommended)</ControlLabel>
                            <FormControl componentClass="textarea"
                                         value={this.state.wrongAnswer1Feedback}
                                         onChange={this.onChange}
                                         placeholder="Feedback for the first mis-direction answer" />
                        </FormGroup>
                        {wrongAnswer2}
                        <FormGroup controlId="wrongAnswer2Feedback">
                            <ControlLabel>Wrong Answer 2 Feedback (recommended)</ControlLabel>
                            <FormControl componentClass="textarea"
                                         value={this.state.wrongAnswer2Feedback}
                                         onChange={this.onChange}
                                         placeholder="Feedback for the second mis-direction answer" />
                        </FormGroup>
                        {wrongAnswer3}
                        <FormGroup controlId="wrongAnswer3Feedback">
                            <ControlLabel>Wrong Answer 3 Feedback (recommended)</ControlLabel>
                            <FormControl componentClass="textarea"
                                         value={this.state.wrongAnswer3Feedback}
                                         onChange={this.onChange}
                                         placeholder="Feedback for the third mis-direction answer" />
                        </FormGroup>
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