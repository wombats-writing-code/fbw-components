// CopyItem.jsx
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;

var $s = require('scriptjs');

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var AnswerExtraction = require('../utilities/AnswerExtraction');
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');
var GenusTypes = require('../constants/AuthoringConstants').GenusTypes;
var LibraryItemsStore = require('../stores/LibraryItemsStore');
var MiddlewareService = require('../services/middleware.service.js');

var CopyItem = React.createClass({
    getInitialState: function () {
      return {}
    },
    componentWillMount: function () {
    },
    componentDidUpdate: function () {
    },
    componentWillReceiveProps: function (nextProps) {
    },
    copyItem: function (e) {
      var payload = {
        itemType: 'multiple-choice',
        libraryId: this.props.libraryId,
        provenanceId: this.props.item.id
      },
        originalItem = this.props.item,
        choiceData = AnswerExtraction(this.props.item);

      payload['displayName'] = 'Copy of ' + originalItem.displayName.text;
      payload['description'] = originalItem.description.text;

      payload['question'] = {
        text: originalItem.question.text.text,
        choices: [choiceData.correctAnswerText]
      };
      payload['learningObjectiveId'] = originalItem.learningObjectiveIds[0];

      payload['answers'] = [{
        choiceId: 0,
        feedback: choiceData.correctAnswerFeedback,
        genusTypeId: GenusTypes.CORRECT_ANSWER,
      }];

      _.each(choiceData.wrongAnswerTexts, function (wrongAnswerText, index) {
        var wrongChoiceId = index + 1,  // because right answer is already there
          wrongChoiceFeedback = choiceData.wrongAnswerFeedbacks[index],
          wrongChoiceLO = choiceData.wrongAnswerLOs[index];

        payload.question.choices.push(wrongAnswerText);

        payload.answers.push({
          choiceId: wrongChoiceId,
          feedback: wrongChoiceFeedback,
          genusTypeId: GenusTypes.WRONG_ANSWER,
          learningObjectiveId: wrongChoiceLO
        });
      });

      Dispatcher.dispatch({
          type: ActionTypes.CREATE_ITEM,
          content: payload
      });
    },
    render: function () {
        return <span>
            <Button onClick={this.copyItem}
                    bsSize="large"
                    title="Copy Item">
                <Glyphicon glyph="copy" />
            </Button>
        </span>
    }
});

module.exports = CopyItem;