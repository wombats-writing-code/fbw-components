// ItemsList.js

'use strict';

require('./ItemsList.css');

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
var LibraryItemsStore = require('../../stores/LibraryItemsStore');
var LORelatedItems = require('../../utilities/LORelatedItems');
var LOText = require('../lo-text/LOText');
var OutcomesStore = require('../../stores/OutcomesStore');
var QuestionText = require('../question-text/QuestionText');


var ItemsList = React.createClass({
    getInitialState: function () {
        return {
            itemExpandedState: {},
            outcomes: [],
            sortedItems: {}  // loId => [itemsList]
        };
    },
    componentWillMount: function() {
        var _this = this;
        OutcomesStore.addChangeListener(function(outcomes) {
            _this.setState({ outcomes: outcomes });
            _this.sortItemsByOutcome();
        });
        LibraryItemsStore.addChangeListener(function(items) {
            _this.sortItemsByOutcome();
        });

        this.initializeItemsAsClosed();
    },
    componentDidMount: function () {
        OutcomesStore.getAll();
    },
    filterOutcomes: function (item) {
        // return outcomes that are not currently being used somewhere
        // in a specific item
        return _.filter(this.state.outcomes, function (outcome) {
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
    getRelatedItems: function (loId) {
        if (this.state.sortedItems.hasOwnProperty(loId)) {
            return this.state.sortedItems[loId];
        } else {
            return [];
        }
    },
    initializeItemsAsClosed: function () {
        var itemState = {};
        _.each(this.props.items, function (item) {
            itemState[item.id] = false;
        });

        this.setState({ itemExpandedState: itemState });
    },
    itemState: function (itemId) {
        return this.state.itemExpandedState[itemId];
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
                        itemId={item.id}
                        libraryId={_this.props.libraryId}
                        outcomeDisplayName={_this.getOutcomeDisplayName(outcomeId)}
                        outcomeId={_this.getQuestionLO(item)}
                        outcomes={_this.filterOutcomes(item)}
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
                            expanded={_this.itemState(item.id)}
                            feedback={feedback}
                            itemId={item.id}
                            label={wrongAnswerLabel}
                            libraryId={_this.props.libraryId} />
            </div>
        });
    },
    renderItems: function () {
        var _this = this,
        // map the choiceIds, etc., in answers back to choices in questions
            items = [];

        _.each(this.props.items, function (item) {
            var answers = AnswerExtraction(item);

            item['correctAnswer'] = answers.correctAnswerText.text;
            item['correctAnswerId'] = answers.correctAnswerId;
            item['correctAnswerFeedback'] = answers.correctAnswerFeedback;
            item['questionRelatedItems'] = _this.getRelatedItems(item.learningObjectiveIds[0]);
            item['usedLOs'] = answers.wrongAnswerLOs.concat(item.learningObjectiveIds);
            item['wrongAnswers'] = answers.wrongAnswerTexts;
            item['wrongAnswerFeedbacks'] = answers.wrongAnswerFeedbacks;
            item['wrongAnswerIds'] = answers.wrongAnswerIds;
            item['wrongAnswerLOs'] = answers.wrongAnswerLOs;
            items.push(item);
        });

        return _.map(items, function (item) {
            var questionLO = _this.getQuestionLO(item),
                itemCreator = 'Unknown',
                itemControls;

            if (_this.props.enableClickthrough) {
                itemControls = <div className="item-controls">
                    <ItemControls item={item}
                                  libraries={_this.props.libraries}
                                  libraryId={_this.props.libraryId} />
                </div>
            } else {
                itemControls = '';
            }

            if (item.hasOwnProperty('providerId')) {
                if (item.providerId != '') {
                    itemCreator = item.providerId;
                }
            }

            return <Row key={item.id}>
                <Col sm={6} md={6} lg={6}>
                    <Panel header={item.displayName.text}
                           collapsible
                           data-id={item.id}
                           expanded={_this.itemState(item.id)}
                           onClick={_this.toggleItemState} >
                        <div className="text-row-wrapper">
                            <p className="question-label">Q:</p>
                            <QuestionText expanded={_this.itemState(item.id)}
                                          questionText={item.question.text.text}
                                          itemCreator={itemCreator} />

                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">a)</p>
                            <AnswerText answerId={item.correctAnswerId}
                                        answerText={item.correctAnswer}
                                        correctAnswer="true"
                                        expanded={_this.itemState(item.id)}
                                        feedback={item.correctAnswerFeedback}
                                        itemId={item.id}
                                        label="Correct Answer"
                                        libraryId={_this.props.libraryId} />
                        </div>
                        {_this.renderItemAnswerTexts(item)}
                        {itemControls}
                    </Panel>
                </Col>
                <Col sm={6} md={6} lg={6}>
                    <Panel header="Learning Outcomes"
                           collapsible
                           expanded={_this.itemState(item.id)}>
                        <div className="text-row-wrapper">
                            <p className="question-label">Q:</p>
                            <LOText component="question"
                                    itemId={item.id}
                                    libraryId={_this.props.libraryId}
                                    outcomeDisplayName={_this.getOutcomeDisplayName(questionLO)}
                                    outcomeId={questionLO}
                                    outcomes={_this.filterOutcomes(item)}
                                    relatedItems={item.questionRelatedItems} />
                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">a)</p>
                            <p className="correct-answer-lo">
                                Correct answer -- no confused LO
                            </p>
                        </div>
                        {_this.renderItemAnswerLOs(item)}
                    </Panel>
                </Col>
            </Row>
        });
    },
    sortItemsByOutcome: function () {
        // get a pre-sorted list of all items, organized by learning outcome
        this.setState({ sortedItems: LORelatedItems(this.props.items, this.state.outcomes) });
    },
    toggleItemState: function (e) {
        var targetClassName = e.target.className,
            updatedState = this.state.itemExpandedState,
            itemId = e.currentTarget.dataset.id;

        if (targetClassName.indexOf('panel-title') >= 0) {
            updatedState[itemId] = !updatedState[itemId];

            this.setState({ itemExpandedState: updatedState });
        }
    },
    render: function () {
        return <Grid>
            {this.renderItems()}
        </Grid>
    }
});

module.exports = ItemsList;
