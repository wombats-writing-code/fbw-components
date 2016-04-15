// ItemModal.js
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Modal = ReactBS.Modal;
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;
var Input = ReactBS.Input;

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;

var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');

var LibraryItemsStore = require('../stores/LibraryItemsStore');

var questionFile;

var ItemModal = React.createClass({
    getInitialState: function () {
        if (this.props.item === '') {
            return {
                correctAnswer: '',
                modalButton: 'Create',
                modalHeader: 'New Question',
                questionFileUrl: '',
                questionString: '',
                showModal: this.props.show,
                wrongAnswer1: '',
                wrongAnswer2: '',
                wrongAnswer3: ''
            };
        } else {
            var answers = this.props.item.answers,
                rightAnswer = _.find(answers, {genusTypeId: "answer-type%3Aright-answer%40ODL.MIT.EDU"}),
                wrongAnswers = _.filter(answers, {genusTypeId: "answer-type%3Awrong-answer%40ODL.MIT.EDU"}),
                wrongAnswerIds = [],
                choices = this.props.item.question.choices,
                correctAnswerText, wrongAnswerTexts;

            correctAnswerText = _.find(choices, {"id": rightAnswer.choiceIds[0]});

            _.each(wrongAnswers, function (wrongAnswer) {
                wrongAnswerIds.push(wrongAnswer.choiceIds[0]);
            });

            wrongAnswerTexts = _.filter(choices, function (choice) {
                return wrongAnswerIds.indexOf(choice.id) >= 0;
            });

            return {
                correctAnswer: correctAnswerText,
                modalButton: 'Edit',
                modalHeader: 'Edit Question',
                questionFileUrl: this.props.item.question.files.image_file,
                questionString: this.props.item.question.text,
                showModal: this.props.show,
                wrongAnswer1: wrongAnswerTexts[0],
                wrongAnswer2: wrongAnswerTexts[1],
                wrongAnswer3: wrongAnswerTexts[2]
            };
        }
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {

    },
    close: function () {
        this.reset();
        this.props.close();
    },
    reset: function() {
        questionFile = null;
        if (this.props.item === '') {
            return {
                correctAnswer: '',
                modalButton: 'Create',
                modalHeader: 'New Question',
                questionFileUrl: '',
                questionString: '',
                showModal: this.props.show,
                wrongAnswer1: '',
                wrongAnswer2: '',
                wrongAnswer3: ''
            };
        } else {
            var answers = this.props.item.answers,
                rightAnswer = _.find(answers, {genusTypeId: "answer-type%3Aright-answer%40ODL.MIT.EDU"}),
                wrongAnswers = _.filter(answers, {genusTypeId: "answer-type%3Awrong-answer%40ODL.MIT.EDU"}),
                wrongAnswerIds = [],
                choices = this.props.item.question.choices,
                correctAnswerText, wrongAnswerTexts;

            correctAnswerText = _.find(choices, {"id": rightAnswer.choiceIds[0]});

            _.each(wrongAnswers, function (wrongAnswer) {
                wrongAnswerIds.push(wrongAnswer.choiceIds[0]);
            });

            wrongAnswerTexts = _.filter(choices, function (choice) {
                return wrongAnswerIds.indexOf(choice.id) >= 0;
            });

            return {
                correctAnswer: correctAnswerText,
                modalButton: 'Edit',
                modalHeader: 'Edit Question',
                questionFileUrl: this.props.item.question.files.image_file,
                questionString: this.props.item.question.text,
                showModal: this.props.show,
                wrongAnswer1: wrongAnswerTexts[0],
                wrongAnswer2: wrongAnswerTexts[1],
                wrongAnswer3: wrongAnswerTexts[2]
            };
        }
    },
    save: function (e) {
        this.props.save({

        });
    },
    onChange: function(e) {
        var inputId = e.currentTarget.id,
            inputValue = e.target.value;
        if (inputId === "questionString") {
            this.setState({ questionString: inputValue });
        } else if (inputId === "questionFile") {
            // is this how you handle files?
            questionFile = e.target.files[0];
        } else if (inputId === "correctAnswer") {
            this.setState({ correctAnswer: inputValue });
        } else if (inputId === "wrongAnswer1") {
            this.setState({ wrongAnswer1: inputValue });
        } else if (inputId === "wrongAnswer2") {
            this.setState({ wrongAnswer2: inputValue });
        } else {
            this.setState({ wrongAnswer3: inputValue });
        }
    },
    render: function () {
        // TODO: Add WYSIWYG editor so can add tables to questions / answers?
        return <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.state.modalHeader}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <Input type="textarea"
                           label="Question"
                           id="questionString"
                           value={this.state.questionString}
                           onChange={this.onChange}
                           placeholder="Please enter the question string, like 'What is your favorite color?'" />
                    <Input type="file"
                           label="Image file"
                           id="questionFile"
                           onChange={this.onChange}
                           placeholder="(Optional) Please include an image if the question references one" />
                    <Input type="text"
                           label="Correct Answer"
                           id="correctAnswer"
                           value={this.state.correctAnswer}
                           onChange={this.onChange}
                           placeholder="The correct answer" />
                    <Input type="text"
                           label="Wrong Answer 1"
                           id="wrongAnswer1"
                           value={this.state.wrongAnswer1}
                           onChange={this.onChange}
                           placeholder="The first mis-direction answer" />
                    <Input type="text"
                           label="Wrong Answer 2"
                           id="wrongAnswer2"
                           value={this.state.wrongAnswer2}
                           onChange={this.onChange}
                           placeholder="The second mis-direction answer" />
                    <Input type="text"
                           label="Wrong Answer 3"
                           id="wrongAnswer3"
                           value={this.state.wrongAnswer3}
                           onChange={this.onChange}
                           placeholder="The third mis-direction answer" />
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>Close</Button>
                <Button bsStyle="success" onClick={this.save}>{this.state.modalButton}</Button>
            </Modal.Footer>
        </Modal>
    }
});

module.exports = ItemModal;