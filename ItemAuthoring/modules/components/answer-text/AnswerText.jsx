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
//    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  },
  componentWillReceiveProps: function (nextProps) {
  },
  componentDidUpdate: function (nextProps, nextState) {
//    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    renderMathInElement(this.refs.textContainer);
  },
  getAnswerText: function () {
    return {__html: this.props.answerText};
  },
  render: function () {
    var formattedOutcomes = _.map(this.props.outcomes, function (outcome) {
      return {
        value: outcome.id,
        label: outcome.displayName.text
      };
    }),
      linkButton = '';

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
                              solution={this.props.solution}
                              feedbackSource={this.props.label}
                              itemId={this.props.itemId}
                              libraryId={this.props.libraryId} />
            </div>
            <AnswerFeedbackPreviewBtn togglePreview={this.props.togglePreview}/>
          </div>
        </div>
      }
    }

    return <div className="taggable-text">
      <div className="text-blob">
        <div dangerouslySetInnerHTML={this.getAnswerText()}
             ref="textContainer">
        </div>
      </div>
      {linkButton}
    </div>

  }
});

module.exports = AnswerText;