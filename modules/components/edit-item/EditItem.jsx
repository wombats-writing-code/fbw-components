// EditItem.jsx
'use strict';

require('./EditItem.css');

let React = require('react');
let ReactBS = require('react-bootstrap');
let Alert = ReactBS.Alert;
let Button = ReactBS.Button;
let ControlLabel = ReactBS.ControlLabel;
let FormControl = ReactBS.FormControl;
let FormGroup = ReactBS.FormGroup;
let Glyphicon = ReactBS.Glyphicon;
let Modal = ReactBS.Modal;

let $s = require('scriptjs');

let ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
let AnswerExtraction = require('../../utilities/AnswerExtraction');
let CKEditorModalHack = require('../../utilities/CKEditorModalHack');
let Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
let GenusTypes = require('../../constants/AuthoringConstants').GenusTypes;
let LibraryItemsStore = require('../../stores/LibraryItemsStore');

let questionFile;

let EditItem = React.createClass({
    getInitialState: function () {
        let me = this.props.item,
            answers = AnswerExtraction(me),
            currentImage = me.question.hasOwnProperty('files') ? me.question.files.imageFile : '';

        return {
            correctAnswer: answers.correctAnswerText.text,
            correctAnswerError: false,
            correctAnswerId: answers.correctAnswerId,
            correctAnswerFeedback: answers.correctAnswerFeedback,
            itemDescription: me.description.text,
            itemDisplayName: me.displayName.text,
            itemDisplayNameError: false,
            originalQuestionFileURL: currentImage,
            questionFile: currentImage,
            questionString: me.question.text.text,
            questionStringError: false,
            removeImageFile: false,
            showAlert: false,
            showDeleteImageBtn: false,
            showModal: false,
            showRevertImageBtn: false,
            wrongAnswer1: answers.wrongAnswerTexts[0].text,
            wrongAnswer1Error: false,
            wrongAnswer1Id: answers.wrongAnswerIds[0],
            wrongAnswer1Feedback: answers.wrongAnswerFeedbacks[0],
            wrongAnswer2: answers.wrongAnswerTexts[1].text,
            wrongAnswer2Error: false,
            wrongAnswer2Id: answers.wrongAnswerIds[1],
            wrongAnswer2Feedback: answers.wrongAnswerFeedbacks[1],
            wrongAnswer3: answers.wrongAnswerTexts[2].text,
            wrongAnswer3Error: false,
            wrongAnswer3Id: answers.wrongAnswerIds[2],
            wrongAnswer3Feedback: answers.wrongAnswerFeedbacks[2]
        };
    },
    componentWillMount: function () {

    },
    close: function () {
        this.setState({showModal: false});
        this.setState({ showDeleteImageBtn: false });
        this.setState({ showRevertImageBtn: false });
    },
    closeAndReset: function () {
        this.setState({showModal: false});
        this.reset();
    },
    initializeEditors: function (e) {
        // CKEditor
        // Instructions from here
        // http://stackoverflow.com/questions/29703324/how-to-use-ckeditor-as-an-npm-module-built-with-webpack-or-similar
        CKEditorModalHack();
        $s('../static/fbw_author/js/vendor/ckeditor-custom/ckeditor.js', function () {
            CKEDITOR.replace('correctAnswer');
            CKEDITOR.replace('correctAnswerFeedback');
            CKEDITOR.replace('questionString');
            CKEDITOR.replace('wrongAnswer1');
            CKEDITOR.replace('wrongAnswer1Feedback');
            CKEDITOR.replace('wrongAnswer2');
            CKEDITOR.replace('wrongAnswer2Feedback');
            CKEDITOR.replace('wrongAnswer3');
            CKEDITOR.replace('wrongAnswer3Feedback');
        });
    },
    onChange: function(e) {
        let inputId = e.currentTarget.id,
            inputValue = e.target.value,
            URL = window.webkitURL || window.URL;
        if (inputId === "questionFile") {
            questionFile = e.target.files[0];
            this.setState({ showRevertImageBtn: true });
            this.refs.imagePreview.src = URL.createObjectURL(questionFile);
        } else {
            let update = {};
            update[inputId] = inputValue;
            this.setState(update);
        }
    },
    open: function (e) {
        // This seems un-React-like (i.e. should do it via a Store?),
        // but if we attach an event listener in componentWillMount,
        // that leads to an event emitter memory leak warning. Because
        // every single item on the page would attach an event...

        let _this = this;
        this.setState({showModal: true}, function () {
            LibraryItemsStore.getItemDetails(_this.props.libraryId,
                                             _this.props.item.id,
                                             function (item) {
                let fileURL = item.question.hasOwnProperty('files') ? item.question.files.imageFile : '';
                _this.setState({ originalQuestionFileURL: fileURL });
                _this.setState({ questionFile: fileURL });
                if (fileURL != '') {
                    _this.setState({ showDeleteImageBtn: true });
                }
            });
        });
    },
    removeImage: function () {
        questionFile = null;
        this.setState({ removeImageFile: true });
        this.setState({ showDeleteImageBtn: false });
        this.setState({ showRevertImageBtn: true });
        this.refs.imagePreview.src = '';
    },
    reset: function() {
        let me = this.props.item,
            answers = AnswerExtraction(me);

        questionFile = null;
        this.setState({ correctAnswer: answers.correctAnswerText.text });
        this.setState({ correctAnswerError: false });
        this.setState({ correctAnswerId: answers.correctAnswerId });
        this.setState({ correctAnswerFeedback: '' });
        this.setState({ itemDescription: me.description.text });
        this.setState({ itemDisplayName: me.displayName.text });
        this.setState({ itemDisplayNameError: false });
        this.setState({ originalQuestionFileURL: me.question.hasOwnProperty('files') ? me.question.files.imageFile : '' });
        this.setState({ questionFile: me.question.hasOwnProperty('files') ? me.question.files.imageFile : '' });
        this.setState({ questionString: me.question.text.text });
        this.setState({ questionStringError: false });
        this.setState({ removeImageFile: false });
        this.setState({ showAlert: false });
        this.setState({ showDeleteImageBtn: false });
        this.setState({ showRevertImageBtn: false });
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
    revertImage: function () {
        // undo the image preview changes and show the
        // original image file
        this.refs.imagePreview.src = this.state.originalQuestionFileURL;
        this.setState({ removeImageFile: false });
        if (this.state.originalQuestionFileURL != '') {
            this.setState({ showDeleteImageBtn: true });
        }
        this.setState({ showRevertImageBtn: false });
    },
    save: function (e) {
        let payload = {
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
            let choiceData = AnswerExtraction(this.props.item);

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

            if (questionFile != null && !this.state.removeImageFile) {
                payload['questionFile'] = questionFile;
            } else if (this.state.removeImageFile) {
                payload['question']['removeImageFile'] = true;
            }

            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_ITEM,
                content: payload
            });
            this.close();
        }
    },
    render: function () {
        let alert = '',
            deleteImageBtn = '',
            revertImageBtn = '',
            correctAnswer, itemDisplayName, questionString, wrongAnswer1,
            wrongAnswer2, wrongAnswer3;

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

        if (this.state.wrongAnswer1Error) {
            wrongAnswer1 = <FormGroup controlId="wrongAnswer1"
                                      validationState="error">
                <ControlLabel>Wrong Answer 1</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.wrongAnswer1}
                             onChange={this.onChange}
                             placeholder="The first mis-direction answer" />
                <FormControl.Feedback />
            </FormGroup>
        } else {
            wrongAnswer1 = <FormGroup controlId="wrongAnswer1">
                <ControlLabel>Wrong Answer 1</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.wrongAnswer1}
                             onChange={this.onChange}
                             placeholder="The first mis-direction answer" />
            </FormGroup>
        }

        if (this.state.wrongAnswer2Error) {
            wrongAnswer2 = <FormGroup controlId="wrongAnswer2"
                                      validationState="error">
                <ControlLabel>Wrong Answer 2</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.wrongAnswer2}
                             onChange={this.onChange}
                             placeholder="The second mis-direction answer" />
                <FormControl.Feedback />
            </FormGroup>
        } else {
            wrongAnswer2 = <FormGroup controlId="wrongAnswer2">
                <ControlLabel>Wrong Answer 2</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.wrongAnswer2}
                             onChange={this.onChange}
                             placeholder="The second mis-direction answer" />
            </FormGroup>
        }

        if (this.state.wrongAnswer3Error) {
            wrongAnswer3 = <FormGroup controlId="wrongAnswer3"
                                      validationState="error">
                <ControlLabel>Wrong Answer 3</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.wrongAnswer3}
                             onChange={this.onChange}
                             placeholder="The third mis-direction answer" />
                <FormControl.Feedback />
            </FormGroup>
        } else {
            wrongAnswer3 = <FormGroup controlId="wrongAnswer3">
                <ControlLabel>Wrong Answer 3</ControlLabel>
                <FormControl componentClass="textarea"
                             value={this.state.wrongAnswer3}
                             onChange={this.onChange}
                             placeholder="The third mis-direction answer" />
            </FormGroup>
        }

        if (this.state.showRevertImageBtn) {
            revertImageBtn = <Button onClick={this.revertImage}
                                     title="Revert to original image">
                <Glyphicon glyph="refresh" />
            </Button>
        }

        if (this.state.showDeleteImageBtn) {
            deleteImageBtn = <Button onClick={this.removeImage}
                                     title="Remove the image">
                <Glyphicon glyph="trash" />
            </Button>
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
                        <div className="image-preview">
                            <FormGroup controlId="questionFile">
                                <ControlLabel>Image File (optional)</ControlLabel>
                                <FormControl type="file"
                                             ref="imageFileInput"
                                             onChange={this.onChange} />
                            </FormGroup>
                            <img ref="imagePreview"
                                 src={this.state.questionFile} />
                            <div className="image-controls">
                                {deleteImageBtn}
                                {revertImageBtn}
                            </div>
                        </div>
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