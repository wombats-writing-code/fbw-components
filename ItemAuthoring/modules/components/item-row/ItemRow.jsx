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


var ItemRow = React.createClass({
  getInitialState: function () {
    return {
      itemExpanded: false
    };
  },
  componentWillMount: function() {
  },
  componentDidMount: function () {
  },
  componentDidUpdate: function () {
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
      var unequalProp = nextProps.item[key] != _this.props.item[key];
      if (unequalProp) {
        console.log(key + ' is the unequal prop for item ' + _this.props.item.id);
        console.log(nextProps.item[key]);
        console.log(_this.props.item[key]);
      }
      return unequalProp;
    });

    var shouldUpdate = unequalPropsItem ||
      this.state.itemExpanded !== nextState.itemExpanded;
    console.log('should update item ' + this.props.item.id + ': ' + shouldUpdate);
    if (shouldUpdate) {
      if (unequalPropsItem) {
        console.log('props changed');
      }

      if (this.state.itemExpanded !== nextState.itemExpanded) {
        console.log('expanded state changed');
      }
    }
    return shouldUpdate;
  },
  filterOutcomes: function (item) {
    // return outcomes that are not currently being used somewhere
    // in a specific item
    return _.filter(this.props.outcomes, function (outcome) {
      return item.usedLOs.indexOf(outcome.id) < 0;
    })
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
                outcomeDisplayName={_this.getOutcomeDisplayName(outcomeId)}
                outcomeId={_this.getQuestionLO(item)}
                outcomes={_this.filterOutcomes(item)}
                refreshModulesAndOutcomes={_this.props.refreshModulesAndOutcomes}
                relatedItems={relatedItems} />
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
          feedback = item.wrongAnswerFeedbacks[index],
          choiceLetter = ChoiceLabels[visibleIndex];

      return <div className="text-row-wrapper"
                  key={index}>
        <p className="answer-label">{choiceLetter})</p>
        <AnswerText answerId={wrongAnswerId}
                    answerText={answer.text}
                    enableClickthrough={_this.props.enableClickthrough}
                    expanded={_this.state.itemExpanded}
                    feedback={feedback}
                    itemId={item.id}
                    label={wrongAnswerLabel}
                    libraryId={_this.props.libraryId} />
      </div>
    });
  },
  toggleItemState: function (e) {
    var clickedElement = e.target,
      targetClassName = clickedElement.className,
      updatedState = this.state.itemExpanded,
      itemId = e.currentTarget.dataset.id,
      isItem = clickedElement.parentElement.parentElement.dataset.type === 'item';

    if (targetClassName.indexOf('panel-title') >= 0 && isItem) {
      updatedState = !updatedState;

      this.setState({ itemExpanded: updatedState });
    }
  },
  render: function () {
    var _this = this,
      // map the choiceIds, etc., in answers back to choices in questions
      updatedItem = this.props.item;

    var t0 = performance.now();

    var answers = AnswerExtraction(updatedItem);

    updatedItem['correctAnswer'] = answers.correctAnswerText.text;
    updatedItem['correctAnswerId'] = answers.correctAnswerId;
    updatedItem['correctAnswerFeedback'] = answers.correctAnswerFeedback;
    updatedItem['questionRelatedItems'] = _this.getRelatedItems(updatedItem.learningObjectiveIds[0]);
    updatedItem['usedLOs'] = updatedItem.learningObjectiveIds;
    updatedItem['wrongAnswers'] = answers.wrongAnswerTexts;
    updatedItem['wrongAnswerFeedbacks'] = answers.wrongAnswerFeedbacks;
    updatedItem['wrongAnswerIds'] = answers.wrongAnswerIds;
    updatedItem['wrongAnswerLOs'] = answers.wrongAnswerLOs;

    var t1 = performance.now();

    console.log('call to each item sort block: ' + (t1 - t0) + ' milliseconds');

    var questionLO = _this.getQuestionLO(updatedItem),
      itemCreator = 'Unknown',
      itemControls;

    if (_this.props.enableClickthrough) {
      itemControls = <div className="item-controls">
        <ItemControls item={updatedItem}
                      libraries={_this.props.libraries}
                      libraryId={_this.props.libraryId} />
      </div>
    } else {
      itemControls = '';
    }

    if (updatedItem.hasOwnProperty('providerId')) {
      if (updatedItem.providerId != '') {
        itemCreator = updatedItem.providerId;
      }
    }

    return <Row>
      <Col sm={6} md={6} lg={6}>
        <Panel header={updatedItem.displayName.text}
               collapsible
               data-id={updatedItem.id}
               data-type="item"
               expanded={_this.state.itemExpanded}
               onClick={_this.toggleItemState} >
          <div className="text-row-wrapper">
            <p className="question-label">Q:</p>
            <QuestionText expanded={_this.state.itemExpanded}
                          questionText={updatedItem.question.text.text}
                          itemCreator={itemCreator} />

          </div>
          <div className="text-row-wrapper">
            <p className="answer-label">a)</p>
            <AnswerText answerId={updatedItem.correctAnswerId}
                        answerText={updatedItem.correctAnswer}
                        correctAnswer="true"
                        enableClickthrough={_this.props.enableClickthrough}
                        expanded={_this.state.itemExpanded}
                        feedback={updatedItem.correctAnswerFeedback}
                        itemId={updatedItem.id}
                        label="Correct Answer"
                        libraryId={_this.props.libraryId} />
          </div>
          {_this.renderItemAnswerTexts(updatedItem)}
          {itemControls}
        </Panel>
      </Col>
      <Col sm={6} md={6} lg={6}>
        <Panel header="Learning Outcomes"
               collapsible
               expanded={_this.state.itemExpanded}>
          <div className="text-row-wrapper">
            <p className="question-label">Q:</p>
            <LOText component="question"
                    enableClickthrough={_this.props.enableClickthrough}
                    itemId={updatedItem.id}
                    libraryId={_this.props.libraryId}
                    outcomeDisplayName={_this.getOutcomeDisplayName(questionLO)}
                    outcomeId={questionLO}
                    outcomes={_this.filterOutcomes(updatedItem)}
                    refreshModulesAndOutcomes={_this.props.refreshModulesAndOutcomes}
                    relatedItems={updatedItem.questionRelatedItems} />
          </div>
            <div className="text-row-wrapper">
              <p className="answer-label">a)</p>
              <p className="correct-answer-lo">
                Correct answer -- no confused LO
              </p>
            </div>
            {_this.renderItemAnswerLOs(updatedItem)}
        </Panel>
      </Col>
    </Row>
  }
});

module.exports = ItemRow;
