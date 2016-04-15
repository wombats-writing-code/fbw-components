// AddItem.js
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;
var Input = ReactBS.Input;
var Modal = ReactBS.Modal;

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');
var LibraryItemsStore = require('../stores/LibraryItemsStore');

var questionFile;

var AddItem = React.createClass({
    getInitialState: function () {
        return {
            correctAnswer: '',
            correctAnswerError: false,
            correctAnswerFeedback: '',
            itemDescription: '',
            itemDisplayName: '',
            itemDisplayNameError: false,
            questionFile: '',
            questionString: '',
            questionStringError: false,
            showAlert: false,
            showModal: false,
            wrongAnswer1: '',
            wrongAnswer1Error: false,
            wrongAnswer1Feedback: '',
            wrongAnswer2: '',
            wrongAnswer2Error: false,
            wrongAnswer2Feedback: '',
            wrongAnswer3: '',
            wrongAnswer3Error: false,
            wrongAnswer3Feedback: ''
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {

    },
    close: function () {
        this.setState({showModal: false});
    },
    create: function (e) {
        var payload = {
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
            Dispatcher.dispatch({
                type: ActionTypes.CREATE_ITEM,
                content: payload
            });
            this.close();
        }
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
    open: function () {
        this.setState({showModal: true});
    },
    reset: function() {
        questionFile = null;
        this.setState({ correctAnswer: '' });
        this.setState({ correctAnswerError: false });
        this.setState({ correctAnswerFeedback: '' });
        this.setState({ itemDescription: '' });
        this.setState({ itemDisplayName: '' });
        this.setState({ itemDisplayNameError: false });
        this.setState({ questionFileUrl: '' });
        this.setState({ questionString: '' });
        this.setState({ questionStringError: false });
        this.setState({ wrongAnswer1: '' });
        this.setState({ wrongAnswer1Error: false });
        this.setState({ wrongAnswer1Feedback: '' });
        this.setState({ wrongAnswer2: '' });
        this.setState({ wrongAnswer2Error: false });
        this.setState({ wrongAnswer2Feedback: '' });
        this.setState({ wrongAnswer3: '' });
        this.setState({ wrongAnswer3Error: false });
        this.setState({ wrongAnswer3Feedback: '' });
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
            correctAnswer = <Input type="text"
                               label="Correct Answer"
                               id="correctAnswer"
                               value={this.state.correctAnswer}
                               onChange={this.onChange}
                               bsStyle="error"
                               placeholder="The correct answer"
                               hasFeedback />
        } else {
            correctAnswer = <Input type="text"
                               label="Correct Answer"
                               id="correctAnswer"
                               value={this.state.correctAnswer}
                               onChange={this.onChange}
                               placeholder="The correct answer"
                               hasFeedback />
        }

        if (this.state.itemDisplayNameError) {
            itemDisplayName = <Input type="text"
                               label="Item Name"
                               id="itemDisplayName"
                               value={this.state.itemDisplayName}
                               onChange={this.onChange}
                               bsStyle="error"
                               placeholder="A name for the item"
                               hasFeedback />
        } else {
            itemDisplayName = <Input type="text"
                               label="Item Name"
                               id="itemDisplayName"
                               value={this.state.itemDisplayName}
                               onChange={this.onChange}
                               placeholder="A name for the item"
                               hasFeedback />
        }

        if (this.state.questionStringError) {
            questionString = <Input type="textarea"
                               label="Question"
                               id="questionString"
                               value={this.state.questionString}
                               onChange={this.onChange}
                               bsStyle="error"
                               placeholder="Please enter the question string, like 'What is your favorite color?'"
                               hasFeedback />
        } else {
            questionString = <Input type="textarea"
                               label="Question"
                               id="questionString"
                               value={this.state.questionString}
                               onChange={this.onChange}
                               placeholder="Please enter the question string, like 'What is your favorite color?'"
                               hasFeedback />
        }

        if (this.state.wrongAnswer1Error) {
            wrongAnswer1 = <Input type="text"
                               label="Wrong Answer 1"
                               id="wrongAnswer1"
                               value={this.state.wrongAnswer1}
                               onChange={this.onChange}
                               bsStyle="error"
                               placeholder="The first mis-direction answer"
                               hasFeedback />
        } else {
            wrongAnswer1 = <Input type="text"
                               label="Wrong Answer 1"
                               id="wrongAnswer1"
                               value={this.state.wrongAnswer1}
                               onChange={this.onChange}
                               placeholder="The first mis-direction answer"
                               hasFeedback />
        }

        if (this.state.wrongAnswer2Error) {
            wrongAnswer2 = <Input type="text"
                               label="Wrong Answer 2"
                               id="wrongAnswer2"
                               value={this.state.wrongAnswer2}
                               onChange={this.onChange}
                               bsStyle="error"
                               placeholder="The second mis-direction answer"
                               hasFeedback />
        } else {
            wrongAnswer2 = <Input type="text"
                               label="Wrong Answer 2"
                               id="wrongAnswer2"
                               value={this.state.wrongAnswer2}
                               onChange={this.onChange}
                               placeholder="The second mis-direction answer"
                               hasFeedback />
        }

        if (this.state.wrongAnswer3Error) {
            wrongAnswer3 = <Input type="text"
                               label="Wrong Answer 3"
                               id="wrongAnswer3"
                               value={this.state.wrongAnswer3}
                               onChange={this.onChange}
                               bsStyle="error"
                               placeholder="The third mis-direction answer"
                               hasFeedback />
        } else {
            wrongAnswer3 = <Input type="text"
                               label="Wrong Answer 3"
                               id="wrongAnswer3"
                               value={this.state.wrongAnswer3}
                               onChange={this.onChange}
                               placeholder="The third mis-direction answer"
                               hasFeedback />
        }

        return <div>
            <Button onClick={this.open}>
                <Glyphicon glyph="plus" />
                New Question
            </Button>
            <Modal bsSize="lg" show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>New Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {alert}
                    <form>
                        {itemDisplayName}
                        <Input type="text"
                               label="Item Description (optional)"
                               id="itemDescription"
                               value={this.state.itemDescription}
                               onChange={this.onChange}
                               placeholder="A description for this item" />
                        {questionString}
                        <Input type="file"
                               label="Image file (optional)"
                               id="questionFile"
                               onChange={this.onChange}
                               placeholder="(Optional) Please include an image if the question references one" />
                        {correctAnswer}
                        <Input type="textarea"
                               label="Correct Answer Feedback (recommended)"
                               id="correctAnswerFeedback"
                               value={this.state.correctAnswerFeedback}
                               onChange={this.onChange}
                               placeholder="Feedback for the correct answer" />
                        {wrongAnswer1}
                        <Input type="textarea"
                               label="Wrong Answer 1 Feedback (recommended)"
                               id="wrongAnswer1Feedback"
                               value={this.state.wrongAnswer1Feedback}
                               onChange={this.onChange}
                               placeholder="Feedback for the first mis-direction answer" />
                        {wrongAnswer2}
                        <Input type="textarea"
                               label="Wrong Answer 2 Feedback (recommended)"
                               id="wrongAnswer2Feedback"
                               value={this.state.wrongAnswer2Feedback}
                               onChange={this.onChange}
                               placeholder="Feedback for the second mis-direction answer" />
                        {wrongAnswer3}
                        <Input type="textarea"
                               label="Wrong Answer 3 Feedback (recommended)"
                               id="wrongAnswer3Feedback"
                               value={this.state.wrongAnswer3Feedback}
                               onChange={this.onChange}
                               placeholder="Feedback for the third mis-direction answer" />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                    <Button bsStyle="success" onClick={this.create}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
});

module.exports = AddItem;