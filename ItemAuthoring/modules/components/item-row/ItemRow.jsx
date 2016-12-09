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


var answerLOchanged = false; // horrible hack ..

var ItemRow = React.createClass({
  getInitialState: function () {
    return {
      itemExpanded: false,
      showPreview: false,
      forceUpdate: false
    };
  },
  componentWillMount: function() {
  },
  componentDidMount: function () {
  },
  componentDidUpdate: function (prevProps, prevState) {
    renderMathInElement(this.refs.textContainer);
    answerLOchanged = false;
  },
  componentWillReceiveProps: function (nextProps) {
    var _this = this;
    _.each(nextProps.item['answers'], function (answer, index) {
      if (answer['confusedLearningObjectiveIds'][0] != _this.props.item['answers'][index]['confusedLearningObjectiveIds'][0]) {
        answerLOchanged = true;
        console.log("an answer LO changed!");
      }
    });
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
                        "solution",
                        "assignedBankIds", "genusTypeId", "type",
                        "maxStringLength", "learningObjectiveIds"],
      _this = this,
      unequalPropsItem;

    unequalPropsItem = !_.isEqual(nextProps.item, _this.props.item);
//    unequalPropsItem = _.some(equalityKeys, function (key) {
//      var unequalProp = !_.isEqual(nextProps.item[key], _this.props.item[key]);
////      if (key == 'answers') {
////        _.each(nextProps.item[key], function (answer, index) {
////          unequalProp = unequalProp || answer['confusedLearningObjectiveIds'][0] != _this.props.item[key][index]['confusedLearningObjectiveIds'][0];
////          if (answer.id == 'assessment.Answer%3A57bd9b2471e482b4e5522159%40bazzim.MIT.EDU') {
////            console.log(answer['confusedLearningObjectiveIds'][0]);
////            console.log(_this.props.item[key][index]['confusedLearningObjectiveIds'][0]);
////          }
////        });
////      }
////      } else if (key == 'question') {
////        unequalProp = unequalProp || nextProps.item['question']['text']['text'] != _this.state.updateableItem['question']['text']['text'];
////        _.each(nextProps.item[key]['choices'], function (choice, index) {
////          unequalProp = unequalProp || choice['text'] != _this.state.updateableItem[key]['choices'][index]['text'];
////        });
////      }
//      return unequalProp;
//    });

    var shouldUpdate = unequalPropsItem ||
      this.state.itemExpanded !== nextState.itemExpanded ||
      this.state.showPreview !== nextState.showPreview ||
      nextState.forceUpdate;

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
  forceUpdate: function () {
    // ugly hack to get the UI to update
    this.setState({ forceUpdate: true }, function () {
      this.setState({ forceUpdate: false });
    });
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
                triggerStateChange={_this.forceUpdate} />
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
  render: function () {
    var _this = this,
      updateItem = JSON.parse(JSON.stringify(this.props.item));
      // map the choiceIds, etc., in answers back to choices in questions

    var answers = AnswerExtraction(updateItem),
      previewHTML = {__html: answers.correctAnswerFeedback};
    //      previewHTML = WrapHTML(answers.correctAnswerFeedback);

    updateItem['correctAnswer'] = answers.correctAnswerText.text;
    updateItem['correctAnswerId'] = answers.correctAnswerId;
    updateItem['correctAnswerFeedback'] = answers.correctAnswerFeedback;
    updateItem['questionRelatedItems'] = _this.getRelatedItems(updateItem.learningObjectiveIds[0]);
    updateItem['usedLOs'] = updateItem.learningObjectiveIds;
    updateItem['wrongAnswers'] = answers.wrongAnswerTexts;
    updateItem['wrongAnswerIds'] = answers.wrongAnswerIds;
    updateItem['wrongAnswerLOs'] = answers.wrongAnswerLOs;

    var questionLO = _this.getQuestionLO(updateItem),
      itemCreator = 'Unknown',
      itemControls;

    if (_this.props.enableClickthrough) {
      itemControls = <div className="item-controls">
        <ItemControls item={updateItem}
                      libraries={_this.props.libraries}
                      libraryId={_this.props.libraryId}
                      triggerStateChange={_this.forceUpdate} />
      </div>
    } else {
      itemControls = '';
    }

    if (updateItem.hasOwnProperty('providerId')) {
      if (updateItem.providerId != '') {
        itemCreator = updateItem.providerId;
      }
    }

    let panelContent = <div></div>
    let objectiveContent = <div></div>

    if (_this.state.expanded) {
      panelContent = (
        <div>
          <div className="text-row-wrapper">
            <p className="question-id">ID: {updateItem.id}</p>
          </div>
          <div className="text-row-wrapper">
            <p className="question-label">Q:</p>
            <QuestionText expanded={_this.state.itemExpanded}
            questionText={updateItem.question.text.text}
            itemCreator={itemCreator} />
          </div>
          <div className="text-row-wrapper">
            <p className="answer-label">a)</p>
            <AnswerText answerId={updateItem.correctAnswerId}
                        answerText={updateItem.correctAnswer}
                        correctAnswer="true"
                        enableClickthrough={_this.props.enableClickthrough}
                        expanded={_this.state.itemExpanded}
                        solution={updateItem.correctAnswerFeedback}
                        itemId={updateItem.id}
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
          {_this.renderItemAnswerTexts(updateItem)}
          {itemControls}
        </div>
      )

      objectiveContent = (
        <div>
          <div className="text-row-wrapper">
            <p className="question-label">Q:</p>
            <LOText component="question"
                    enableClickthrough={_this.props.enableClickthrough}
                    itemId={updateItem.id}
                    libraryId={_this.props.libraryId}
                    outcomeDescription={_this.getOutcomeDescription(questionLO)}
                    outcomeDisplayName={_this.getOutcomeDisplayName(questionLO)}
                    outcomeId={questionLO}
                    outcomes={_this.filterOutcomes(updateItem)}
                    refreshModulesAndOutcomes={_this.props.refreshModulesAndOutcomes}
                    relatedItems={updateItem.questionRelatedItems} />
          </div>
          <div className="text-row-wrapper">
            <p className="answer-label">a)</p>
            <p className="correct-answer-lo">
            Correct answer -- no confused LO
            </p>
          </div>
            {_this.renderItemAnswerLOs(updateItem)}
        </div>
        )
    }

    return <Row>
      <Col sm={8} md={8} lg={8}>
        <Panel header={updateItem.displayName.text}
        collapsible
        data-id={updateItem.id}
        data-type="item"
        expanded={_this.state.itemExpanded}
        onClick={_this.toggleItemState} >
          {panelContent}
        </Panel>
      </Col>
      <Col sm={4} md={4} lg={4}>
        <Panel header="Learning Outcomes"
        collapsible
        expanded={_this.state.itemExpanded}>
          {objectiveContent}
        </Panel>
      </Col>
    </Row>
  },
  _togglePreview: function () {
    this.setState({ showPreview: !this.state.showPreview });
  }
});

module.exports = ItemRow;
