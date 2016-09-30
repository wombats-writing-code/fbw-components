// ItemRow.js

'use strict';

require('./ItemRow.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Col = ReactBS.Col;
var Grid = ReactBS.Grid;
var Panel = ReactBS.Panel;
var Row = ReactBS.Row;

var AuthoringConstants = require('../../constants/AuthoringConstants');
var ChoiceLabels = AuthoringConstants.ChoiceLabels;
var GenusTypes = AuthoringConstants.GenusTypes;

var AnswerExtraction = require('../../utilities/AnswerExtraction');
var AnswerText = require('../answer-text/AnswerText');
var ItemControls = require('../ItemControls');
var LOText = require('../lo-text/LOText');
var OutcomesStore = require('../../stores/OutcomesStore');
var QuestionText = require('../question-text/QuestionText');
var SetIFrameHeight = require('../../utilities/SetIFrameHeight');
var WrapHTML = require('../../utilities/WrapHTML');


var ItemRow = React.createClass({
  getInitialState: function () {
    return {
      itemExpanded: false,
      showPreview: false,
      updateableItem: JSON.parse(JSON.stringify(this.props.item)), // make a clone so that this changes when item updated
    };
  },
  componentWillMount: function() {
  },
  componentDidMount: function () {
  },
  componentDidUpdate: function () {
    renderMathInElement(this.refs.textContainer);
  },
  componentWillReceiveProps: function (nextProps) {
  },
  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.showPreview) {
      SetIFrameHeight(this.refs.myPreviewFrame);
    }
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    var equalityKeys = ["minStringLength", "displayName", "description",
                        "license", "texts", "bankId", "question", "answers",
                        "id", "recordTypeIds", "providerId", "brandingIds",
                        "assignedBankIds", "genusTypeId", "type",
                        "maxStringLength", "learningObjectiveIds"],
      _this = this,
      unequalPropsItem;

    unequalPropsItem = _.some(equalityKeys, function (key) {
      var unequalProp = !_.isEqual(nextProps.item[key], _this.props.item[key]);
      if (key == 'answers') {
        _.each(nextProps.item[key], function (answer, index) {
          unequalProp = unequalProp || answer['confusedLearningObjectiveIds'][0] != _this.state.updateableItem[key][index]['confusedLearningObjectiveIds'][0];
        });
      }
      return unequalProp;
    });

    var shouldUpdate = unequalPropsItem ||
      this.state.itemExpanded !== nextState.itemExpanded ||
      this.state.showPreview !== nextState.showPreview;

    return shouldUpdate;
  },
  filterOutcomes: function (item) {
    // return outcomes that are not currently being used somewhere
    // in a specific item
    return _.filter(this.props.outcomes, function (outcome) {
      return item.usedLOs.indexOf(outcome.id) < 0;
    })
  },
  getOutcomeDescription: function (outcomeId) {
    var outcome = OutcomesStore.get(outcomeId);
    if (outcome == null) {
      return '';
    } else {
      return outcome.description.text;
    }
  },
  getOutcomeDisplayName: function (outcomeId) {
    var outcome = OutcomesStore.get(outcomeId);
    if (outcome == null) {
      return <p className="missing-lo">None linked yet</p>;
    } else {
      return outcome.displayName.text;
    }
  },
  getQuestionLO: function (item) {
    var questionLO;
    if (item.question.learningObjectiveIds.length > 0) {
      questionLO = item.question.learningObjectiveIds[0];
    } else {
      questionLO = '';
    }

    return questionLO;
  },
  getRelatedItems: function (outcomeId) {
    var items = this.props.relatedItems[outcomeId];

    if (typeof items !== 'undefined') {
      return items;
    } else {
      return [];
    }
  },
  renderItemAnswerLOs: function (item) {
    // just generate the answer los
    var _this = this;
    return _.map(item.wrongAnswerLOs, function (outcomeId, index) {
      var visibleIndex = index + 1,
          answerId = item.wrongAnswerIds[index],
          relatedItems = _this.getRelatedItems(outcomeId),
          choiceLetter = ChoiceLabels[visibleIndex];

      return <div className="text-row-wrapper"
                  key={index}>
        <p className="answer-label">{choiceLetter})</p>
        <LOText answerId={answerId}
                component="answer"
                enableClickthrough={_this.props.enableClickthrough}
                itemId={item.id}
                libraryId={_this.props.libraryId}
                outcomeDescription={_this.getOutcomeDescription(outcomeId)}
                outcomeDisplayName={_this.getOutcomeDisplayName(outcomeId)}
                outcomeId={_this.getQuestionLO(item)}
                outcomes={_this.filterOutcomes(item)}
                refreshModulesAndOutcomes={_this.props.refreshModulesAndOutcomes}
                relatedItems={relatedItems}
                updateAnswerLO={_this.updateAnswerLO} />
      </div>
    });
  },
  renderItemAnswerTexts: function (item) {
    var _this = this;
    // just generate the answer objects
    return _.map(item.wrongAnswers, function (answer, index) {
      var visibleIndex = index + 1,
          wrongAnswerId = item.wrongAnswerIds[index],
          wrongAnswerLabel = 'Wrong Answer ' + visibleIndex,
          choiceLetter = ChoiceLabels[visibleIndex];

      return <div className="text-row-wrapper"
                  key={index}>
        <p className="answer-label">{choiceLetter})</p>
        <AnswerText answerId={wrongAnswerId}
                    answerText={answer.text}
                    enableClickthrough={_this.props.enableClickthrough}
                    expanded={_this.state.itemExpanded}
                    itemId={item.id}
                    label={wrongAnswerLabel}
                    libraryId={_this.props.libraryId} />
      </div>
    });
  },
  toggleItemState: function (e) {
    // NOTE: Do NOT add any sort of validation check here
    //       It seems to break Jennifer's set up for whatever reason...
    //if (e.target.className == 'panel-title') {
    this.setState({ itemExpanded: !this.state.itemExpanded });
    //}
  },
  updateAnswerLO: function (answerId, confusedLearningObjectiveId) {
    var updatedItem = this.state.updateableItem,
      updatedWrongAnswerLOs = [];
    _.each(updatedItem.answers, function (answer) {
        if (answer.id == answerId) {
          answer.confusedLearningObjectiveIds = [confusedLearningObjectiveId];
          updatedWrongAnswerLOs.push(confusedLearningObjectiveId);
        } else {
          updatedWrongAnswerLOs.push(answer.confusedLearningObjectiveIds[0]);
        }
      });
    updatedItem.wrongAnswerLOs = updatedWrongAnswerLOs;
    this.setState({ updateableItem: updatedItem });
  },
  render: function () {
    var _this = this;
      // map the choiceIds, etc., in answers back to choices in questions

    var answers = AnswerExtraction(_this.state.updateableItem),
      previewHTML = {__html: answers.correctAnswerFeedback};
//      previewHTML = WrapHTML(answers.correctAnswerFeedback);

    _this.state.updateableItem['correctAnswer'] = answers.correctAnswerText.text;
    _this.state.updateableItem['correctAnswerId'] = answers.correctAnswerId;
    _this.state.updateableItem['correctAnswerFeedback'] = answers.correctAnswerFeedback;
    _this.state.updateableItem['questionRelatedItems'] = _this.getRelatedItems(_this.state.updateableItem.learningObjectiveIds[0]);
    _this.state.updateableItem['usedLOs'] = this.state.updateableItem.learningObjectiveIds;
    _this.state.updateableItem['wrongAnswers'] = answers.wrongAnswerTexts;
    _this.state.updateableItem['wrongAnswerIds'] = answers.wrongAnswerIds;
    _this.state.updateableItem['wrongAnswerLOs'] = answers.wrongAnswerLOs;

    var questionLO = _this.getQuestionLO(_this.state.updateableItem),
      itemCreator = 'Unknown',
      itemControls;

    if (_this.props.enableClickthrough) {
      itemControls = <div className="item-controls">
        <ItemControls item={_this.state.updateableItem}
                      libraries={_this.props.libraries}
                      libraryId={_this.props.libraryId} />
      </div>
    } else {
      itemControls = '';
    }

    if (_this.state.updateableItem.hasOwnProperty('providerId')) {
      if (_this.state.updateableItem.providerId != '') {
        itemCreator = _this.state.updateableItem.providerId;
      }
    }

    return <Row>
      <Col sm={8} md={8} lg={8}>
        <Panel header={_this.state.updateableItem.displayName.text}
               collapsible
               data-id={_this.state.updateableItem.id}
               data-type="item"
               expanded={_this.state.itemExpanded}
               onClick={_this.toggleItemState} >
          <div className="text-row-wrapper">
            <p className="question-label">Q:</p>
            <QuestionText expanded={_this.state.itemExpanded}
                          questionText={_this.state.updateableItem.question.text.text}
                          itemCreator={itemCreator} />
          </div>
          <div className="text-row-wrapper">
            <p className="answer-label">a)</p>
            <AnswerText answerId={_this.state.updateableItem.correctAnswerId}
                        answerText={_this.state.updateableItem.correctAnswer}
                        correctAnswer="true"
                        enableClickthrough={_this.props.enableClickthrough}
                        expanded={_this.state.itemExpanded}
                        solution={_this.state.updateableItem.correctAnswerFeedback}
                        itemId={_this.state.updateableItem.id}
                        label="Correct Answer"
                        libraryId={_this.props.libraryId}
                        togglePreview={_this._togglePreview} />
          </div>
          <div className="right-answer-feedback-preview">
            <Panel collapsible
                   expanded={_this.state.showPreview}>
              <div dangerouslySetInnerHTML={previewHTML}
                   ref="textContainer">
              </div>
            </Panel>
          </div>
          {_this.renderItemAnswerTexts(_this.state.updateableItem)}
          {itemControls}
        </Panel>
      </Col>
      <Col sm={4} md={4} lg={4}>
        <Panel header="Learning Outcomes"
               collapsible
               expanded={_this.state.itemExpanded}>
          <div className="text-row-wrapper">
            <p className="question-label">Q:</p>
            <LOText component="question"
                    enableClickthrough={_this.props.enableClickthrough}
                    itemId={_this.state.updateableItem.id}
                    libraryId={_this.props.libraryId}
                    outcomeDescription={_this.getOutcomeDescription(questionLO)}
                    outcomeDisplayName={_this.getOutcomeDisplayName(questionLO)}
                    outcomeId={questionLO}
                    outcomes={_this.filterOutcomes(_this.state.updateableItem)}
                    refreshModulesAndOutcomes={_this.props.refreshModulesAndOutcomes}
                    relatedItems={_this.state.updateableItem.questionRelatedItems} />
          </div>
            <div className="text-row-wrapper">
              <p className="answer-label">a)</p>
              <p className="correct-answer-lo">
                Correct answer -- no confused LO
              </p>
            </div>
            {_this.renderItemAnswerLOs(_this.state.updateableItem)}
        </Panel>
      </Col>
    </Row>
  },
  _togglePreview: function () {
    this.setState({ showPreview: !this.state.showPreview });
  }
});

module.exports = ItemRow;
