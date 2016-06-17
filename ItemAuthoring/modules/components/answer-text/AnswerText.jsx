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
var Panel = ReactBS.Panel;

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var AnswerFeedback = require('../AnswerFeedback');
var AnswerFeedbackPreviewBtn = require('../answer-feedback-preview-btn/AnswerFeedbackPreviewBtn');
var Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
var SetIFrameHeight = require('../../utilities/SetIFrameHeight');
var WrapHTML = require('../../utilities/WrapHTML');

var AnswerText = React.createClass({
  getInitialState: function () {
    var confusedLO = this.props.confusedLO === 'None linked yet' ? '' : this.props.confusedLO;
    return {
      confusedLO: confusedLO,
      showModal: false,
      showPreview: false
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
  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.showPreview) {
      SetIFrameHeight(this.refs.myPreviewFrame);
    }
  },
  render: function () {
    var formattedOutcomes = _.map(this.props.outcomes, function (outcome) {
      return {
        value: outcome.id,
        label: outcome.displayName.text
      };
    }),
      linkButton = '',
      answerHTML = WrapHTML(this.props.answerText),
      previewHTML = WrapHTML(this.props.feedback);

    if (this.props.enableClickthrough) {
      if (!this.props.correctAnswer) {
        linkButton = <div className="wrong-answer-actions">
        </div>
      } else {
        linkButton = <div className="right-answer-actions">
          <div className="right-answer-actions-top-row">
            <div className="actions-horizontal-row">
              <Glyphicon className="right-answer-check"
                         glyph="ok" />
              <AnswerFeedback answerId={this.props.answerId}
                              feedback={this.props.feedback}
                              feedbackSource={this.props.label}
                              itemId={this.props.itemId}
                              libraryId={this.props.libraryId} />
            </div>
            <AnswerFeedbackPreviewBtn feedback={this.props.feedback}
                                      togglePreview={this._togglePreview}/>
          </div>
          <div className="right-answer-feedback-preview">
            <Panel collapsible
                   expanded={this.state.showPreview}>
              <iframe ref="myPreviewFrame"
                      srcDoc={previewHTML}
                      frameBorder={0}
                      width="100%"
                      sandbox="allow-scripts allow-same-origin"
                      ></iframe>
            </Panel>
          </div>
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

  },
  _togglePreview: function () {
    this.setState({ showPreview: !this.state.showPreview });
  }
});

module.exports = AnswerText;