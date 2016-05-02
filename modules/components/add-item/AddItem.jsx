// AddItem.js
'use strict';

require('./AddItem.css');

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
let CKEditorModalHack = require('../../utilities/CKEditorModalHack');
let ConfigureCKEditor = require('../../utilities/ConfigureCKEditor');
let ConvertLibraryId2RepositoryId = require('../../utilities/ConvertLibraryId2RepositoryId');
let GenusTypes = require('../../constants/AuthoringConstants').GenusTypes;
let Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
let LibraryItemsStore = require('../../stores/LibraryItemsStore');
let MiddlewareService = require('../../services/middleware.service.js');

let questionFile;

let AddItem = React.createClass({
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
            showImagePreviewDeleteBtn: false,
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
        this.reset();
    },
    create: function (e) {
        // With CKEditor, need to get the data from CKEditor,
        // not this.state. http://docs.ckeditor.com/#!/guide/dev_savedata
        // let data = CKEDITOR.instances.correctAnswer.getData();
        let payload = {
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

            payload['displayName'] = this.state.itemDisplayName;
            payload['description'] = this.state.itemDescription;
            payload['question'] = {
                text: questionString,
                choices: [correctAnswer,
                          wrongAnswer1,
                          wrongAnswer2,
                          wrongAnswer3]
            };
            payload['answers'] = [{
                genusTypeId: GenusTypes.CORRECT_ANSWER,
                choiceId: 0,
                feedback: correctAnswerFeedback
            },{
                genusTypeId: GenusTypes.WRONG_ANSWER,
                choiceId: 1,
                feedback: wrongAnswer1Feedback
            },{
                genusTypeId: GenusTypes.WRONG_ANSWER,
                choiceId: 2,
                feedback: wrongAnswer2Feedback
            },{
                genusTypeId: GenusTypes.WRONG_ANSWER,
                choiceId: 3,
                feedback: wrongAnswer3Feedback
            }];
            if (questionFile != null) {
                payload['questionFile'] = questionFile;
            }

            Dispatcher.dispatch({
                type: ActionTypes.CREATE_ITEM,
                content: payload
            });
            this.close();
        }
    },
    initializeEditors: function (e) {
        var repositoryId = ConvertLibraryId2RepositoryId(this.props.libraryId);
        // CKEditor
        // Instructions from here
        // http://stackoverflow.com/questions/29703324/how-to-use-ckeditor-as-an-npm-module-built-with-webpack-or-similar
        CKEditorModalHack();
        $s(MiddlewareService.staticFiles() + '/fbw_author/js/vendor/ckeditor-custom/ckeditor.js', function () {
            ConfigureCKEditor(CKEDITOR, repositoryId);
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
            this.setState({ showImagePreviewDeleteBtn: true });
            this.refs.imagePreview.src = URL.createObjectURL(questionFile);
        } else {
            let update = {};
            update[inputId] = inputValue;
            this.setState(update);
        }
    },
    open: function () {
        this.setState({showModal: true});
    },
    removeImage: function () {
        this.refs.imagePreview.src = '';
        this.refs.imageFileInput.value = '';
        this.setState({ showImagePreviewDeleteBtn: false });
        questionFile = null;
    },
    reset: function() {
        questionFile = null;
        this.refs.imagePreview.src = '';
        this.setState({ correctAnswer: '' });
        this.setState({ correctAnswerError: false });
        this.setState({ correctAnswerFeedback: '' });
        this.setState({ itemDescription: '' });
        this.setState({ itemDisplayName: '' });
        this.setState({ itemDisplayNameError: false });
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
        // TODO: allow choices to be image files (i.e. graphs)
        let alert = '',
            correctAnswer, itemDisplayName, questionString, wrongAnswer1,
            wrongAnswer2, wrongAnswer3, imagePreviewDeleteBtn;

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

        if (this.state.showImagePreviewDeleteBtn) {
            imagePreviewDeleteBtn = <Button onClick={this.removeImage}
                                   className="remove-image-button"
                                   title="Remove the image">
                <Glyphicon glyph="trash" />
            </Button>
        } else {
            imagePreviewDeleteBtn = '';
        }

        return <div>
            <Button onClick={this.open}>
                <Glyphicon glyph="plus" />
                New Question
            </Button>
            <Modal bsSize="lg"
                   show={this.state.showModal}
                   onHide={this.close}
                   onEntered={this.initializeEditors}>
                <Modal.Header closeButton>
                    <Modal.Title>New Question</Modal.Title>
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
                                 src="" />
                            {imagePreviewDeleteBtn}
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
                    <Button onClick={this.close}>Close</Button>
                    <Button bsStyle="success" onClick={this.create}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
});

module.exports = AddItem;