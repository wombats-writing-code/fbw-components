// AnswerText.js

'use strict';

require('./AnswerText.css');
require('../../../stylesheets/vendor/reactSelectOverride.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Select = require('react-select');

var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var AnswerFeedback = require('../AnswerFeedback');
var Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
var LORelatedItemsBadge = require('../lo-related-items-badge/LORelatedItemsBadge');
var SetIFrameHeight = require('../../utilities/SetIFrameHeight');
var WrapHTML = require('../../utilities/WrapHTML');

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
        SetIFrameHeight(this.refs.myFrame);
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
            linkButton = '',
            answerHTML = WrapHTML(this.props.answerText);

        if (!this.props.hideLinkBtn) {
            if (this.props.enableClickthrough) {
                linkButton = <div className="wrong-answer-actions">
                    <LORelatedItemsBadge confusedLO={this.state.confusedLO}
                                         libraryId={this.props.libraryId}
                                         relatedItems={this.props.relatedItems} />
                    <AnswerFeedback feedback={this.props.feedback}
                                    feedbackSource={this.props.label} />
                    <div>
                        <Button onClick={this.open}
                                bsSize="small"
                                title="Link to an Outcome">
                            <Glyphicon glyph="link" />
                        </Button>
                    </div>
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
            }
        } else {
            if (this.props.enableClickthrough) {
                linkButton = <div className="right-answer-actions">
                    <AnswerFeedback feedback={this.props.feedback}
                                    feedbackSource={this.props.label} />
                    <Glyphicon className="right-answer-check"
                                glyph="ok" />
                </div>
            } else {
                linkButton = <div className="right-answer-actions">
                    <Glyphicon className="right-answer-check"
                                glyph="ok" />
                </div>
            }
        }

        return <div className="taggable-text">
            <div className="text-blob">
                <iframe ref="myFrame"
                        srcDoc={answerHTML}
                        frameBorder={0}
                        width="100%"
                        sandbox="allow-scripts allow-same-origin"
                        ></iframe>
            </div>
            {linkButton}
        </div>

    }
});

module.exports = AnswerText;