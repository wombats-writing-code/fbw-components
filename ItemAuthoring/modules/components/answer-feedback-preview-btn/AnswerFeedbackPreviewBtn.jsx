// AnswerFeedbackPreviewBtn.jsx
'use strict';
require('./AnswerFeedbackPreviewBtn.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Button = ReactBS.Button;

var SetIFrameHeight = require('../../utilities/SetIFrameHeight');
var WrapHTML = require('../../utilities/WrapHTML');

var AnswerFeedbackPreviewBtn = React.createClass({
  getInitialState: function () {
    return {
    };
  },
  toggle: function (e) {
    e.stopPropagation();
    this.props.togglePreview();
  },
  render: function () {
    return <div className="answer-feedback-preview">
      <Button onClick={this.toggle}
              title="Preview Solution Explanation">
          Preview Solution Explanation
      </Button>
    </div>
  }
});

module.exports = AnswerFeedbackPreviewBtn;