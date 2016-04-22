// AnswerText.js

'use strict';

require('../../stylesheets/vendor/reactSelectOverride.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Select = require('react-select');

var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');

var AnswerText = React.createClass({
    getInitialState: function () {
        var confusedLO = this.props.confusedLO === 'None linked yet' ? '' : this.props.confusedLO;
        return {
            confusedLO: confusedLO,
            showModal: false
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
    onChange: function (e) {
        if (e == null) {
            this.setState({ confusedLO: '' });
        } else {
            this.setState({ confusedLO: e.value });
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
            answerId: this.props.answerId,
            confusedLearningObjectiveId: this.state.confusedLO,
            itemId: this.props.itemId,
            libraryId: this.props.libraryId
        };

        Dispatcher.dispatch({
            type: ActionTypes.LINK_ANSWER_LO,
            content: payload
        });
        this.close();
    },
    render: function () {
        var formattedOutcomes = _.map(this.props.outcomes, function (outcome) {
            return {
                value: outcome.id,
                label: outcome.displayName.text
            };
        }),
            linkButton = '';

        if (!this.props.hideLinkBtn) {
            linkButton = <div className="pull-right">
                <Button onClick={this.open} bsSize="small">
                    <Glyphicon glyph="link" />
                </Button>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Link Answer to Outcome</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup controlId="outcomeSelector">
                                <ControlLabel>Select a learning outcome ...</ControlLabel>
                                <Select name="confusedOutcomeSelector"
                                        placeholder="Select an outcome ... "
                                        value={this.state.confusedLO}
                                        onChange={this.onChange}
                                        options={formattedOutcomes}>
                                </Select>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                        <Button bsStyle="success" onClick={this.save}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        } else {
            linkButton = <div className="right-answer-check">
                <Glyphicon glyph="ok" />
            </div>
        }

        return <div className="taggable-text">
            <div className="text-blob">
                {this.props.answerText}
            </div>
            {linkButton}
        </div>

    }
});

module.exports = AnswerText;