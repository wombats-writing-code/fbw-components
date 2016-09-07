// AnswerFeedback.jsx
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Button = ReactBS.Button;
var FormControl = ReactBS.FormControl;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var $s = require('scriptjs');

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var CKEditorModalHack = require('../utilities/CKEditorModalHack');
var ConfigureCKEditor = require('../utilities/ConfigureCKEditor');
var ConvertLibraryId2RepositoryId = require('../utilities/ConvertLibraryId2RepositoryId');
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');
var LibraryItemsStore = require('../stores/LibraryItemsStore');
var MiddlewareService = require('../services/middleware.service.js');

var AnswerFeedback = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    close: function () {
        this.setState({showModal: false});
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
            _this.initializeEditorInstance('solution');
        });
    },
    initializeEditorInstance: function (instance) {
        $s(MiddlewareService.ckEditor(), function () {
            CKEDITOR.replace(instance);
        });
    },
    onChange: function (e) {
        // do nothing, since we have to grab the data from CKEditor
    },
    open: function (e) {
      e.stopPropagation();
      this.setState({showModal: true}, function () {

      });
    },
    save: function () {
        var solution = CKEDITOR.instances.solution.getData(),
            payload = {
                itemId: this.props.itemId,
                libraryId: this.props.libraryId
            };

        if (solution != this.props.solution) {
            payload['solution'] = solution;

            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_ITEM,
                content: payload
            });
            this.close();
        }
    },
    render: function () {
        var title = "Solution Explanation for: " + this.props.feedbackSource;
        return <div>
            <Button onClick={this.open}
                    title="Edit Solution">
                Solution Explanation
            </Button>
            <Modal backdrop="static"
                   bsSize="lg" show={this.state.showModal}
                   onHide={this.close}
                   onEntered={this.initializeEditors}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup controlId="solution">
                        <FormControl componentClass="textarea"
                                     value={this.props.solution}
                                     onChange={this.onChange}
                                     placeholder={title} />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                    <Button onClick={this.save} bsStyle="success">Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
});

module.exports = AnswerFeedback;