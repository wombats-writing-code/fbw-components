// QuestionText.js

'use strict';

require('./QuestionText.css');
require('../../../stylesheets/vendor/reactSelectOverride.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Select = require('react-select');
var ReactTooltip = require('react-tooltip');

var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
var OsidId = require('../../utilities/OsidId');
var SetIFrameHeight = require('../../utilities/SetIFrameHeight');
var WrapHTML = require('../../utilities/WrapHTML');

var QuestionText = React.createClass({
    getInitialState: function () {
        var questionLO = this.props.questionLO === '' ? '' : this.props.questionLO;
        return {
            questionLO: questionLO,
            showModal: false
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.expanded) {
            SetIFrameHeight(this.refs.myFrame);
        }
    },
    close: function () {
        this.setState({showModal: false});
        this.reset();
    },
    onChange: function (e) {
        if (e == null) {
            this.setState({ questionLO: '' });
        } else {
            this.setState({ questionLO: e.value });
        }
    },
    open: function (e) {
        this.setState({showModal: true}, function () {

        });
    },
    renderOutcomes: function () {
        return _.map(this.props.outcomes, function (outcome) {
            return <option value={outcome.id}
                           title={outcome.description.text}
                           key={outcome.id}>
                {outcome.displayName.text}
            </option>;
        });
    },
    reset: function () {

    },
    save: function (e) {
        var payload = {
            learningObjectiveId: this.state.questionLO,
            itemId: this.props.questionId,
            libraryId: this.props.libraryId
        };

        Dispatcher.dispatch({
            type: ActionTypes.LINK_ITEM_LO,
            content: payload
        });
        this.close();
    },
    render: function () {
        var questionText = WrapHTML(this.props.questionText),
            agent = OsidId.getIdentifier(this.props.itemCreator);

        return <div className="taggable-text">
            <div className="text-blob">
                <iframe ref="myFrame"
                        srcDoc={questionText}
                        frameBorder={0}
                        width="100%"
                        sandbox="allow-same-origin allow-scripts"
                        ></iframe>
            </div>
            <Glyphicon glyph="envelope"
                       data-tip={agent} />
            <ReactTooltip />
        </div>

    }
});

module.exports = QuestionText;