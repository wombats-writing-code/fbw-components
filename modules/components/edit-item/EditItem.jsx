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
var ListGroup = ReactBS.ListGroup;
var Modal = ReactBS.Modal;

var $s = require('scriptjs');

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var AnswerExtraction = require('../../utilities/AnswerExtraction');
var CKEditorModalHack = require('../../utilities/CKEditorModalHack');
var ConfigureCKEditor = require('../../utilities/ConfigureCKEditor');
var ConvertLibraryId2RepositoryId = require('../../utilities/ConvertLibraryId2RepositoryId');
var Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
var EditMultipleChoice = require('../EditMultipleChoice');
var GenusTypes = require('../../constants/AuthoringConstants').GenusTypes;
var LibraryItemsStore = require('../../stores/LibraryItemsStore');
var MiddlewareService = require('../../services/middleware.service.js');
var WrongAnswerEditor = require('../wrong-answer-editor/WrongAnswerEditor');

var EditItem = React.createClass({
    getInitialState: function () {
        return {
            showModal: false
        };
    },
    componentWillMount: function () {

    },
    componentDidUpdate: function () {

    },
    close: function () {
        this.setState({ showModal: false });
    },
    open: function (e) {
        this.setState({ showModal: true});
    },
    render: function () {
        var questionForm = '';

        if (this.props.item.question.genusTypeId === GenusTypes.MC_QUESTION) {
            questionForm = <EditMultipleChoice close={this.close}
                                               item={this.props.item}
                                               libraryId={this.props.libraryId}
                                               showModal={this.state.showModal} />;
        }

        return <div>
            <Button onClick={this.open}
                    bsSize="large"
                    title="Edit Item">
                <Glyphicon glyph="pencil" />
            </Button>
            {questionForm}
        </div>
    }
});

module.exports = EditItem;