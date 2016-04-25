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
var GenusTypes = require('../../constants/AuthoringConstants').GenusTypes;

var AnswerExtraction = require('../../utilities/AnswerExtraction');
var AnswerText = require('../AnswerText');
var ItemControls = require('../ItemControls');
var LibraryItemsStore = require('../../stores/LibraryItemsStore');
var LORelatedItems = require('../../utilities/LORelatedItems');
var OutcomesStore = require('../../stores/OutcomesStore');
var QuestionText = require('../QuestionText');


var ItemsList = React.createClass({
    getInitialState: function () {
        return {
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
    },
    componentDidMount: function () {
        OutcomesStore.getAll();
    },
    getOutcomeDisplayName: function (outcomeId) {
        var outcome = OutcomesStore.get(outcomeId);
        if (outcome == null) {
            return <p className="missing-lo">None linked yet</p>;
        } else {
            return outcome.displayName.text;
        }
    },
    renderItems: function () {
        //TODO: Need to map the LOs to their displayNames...IDs are not useful
        var _this = this,
        // map the choiceIds, etc., in answers back to choices in questions
            items = [];

        function getRelatedItems(loId) {
            if (_this.state.sortedItems.hasOwnProperty(loId)) {
                return _this.state.sortedItems[loId];
            } else {
                return [];
            }
        }

        _.each(this.props.items, function (item) {
            var answers = AnswerExtraction(item);

            item['correctAnswer'] = answers.correctAnswerText.text;
            item['wrongAnswer1'] = answers.wrongAnswerTexts[0].text;
            item['wrongAnswer1ID'] = answers.wrongAnswerIds[0];
            item['wrongAnswer1LO'] = answers.wrongAnswerLOs[0];
            item['wrongAnswer1RelatedItems'] = getRelatedItems(answers.wrongAnswerLOs[0]);
            item['wrongAnswer2'] = answers.wrongAnswerTexts[1].text;
            item['wrongAnswer2ID'] = answers.wrongAnswerIds[1];
            item['wrongAnswer2LO'] = answers.wrongAnswerLOs[1];
            item['wrongAnswer2RelatedItems'] = getRelatedItems(answers.wrongAnswerLOs[1]);
            item['wrongAnswer3'] = answers.wrongAnswerTexts[2].text;
            item['wrongAnswer3ID'] = answers.wrongAnswerIds[2];
            item['wrongAnswer3LO'] = answers.wrongAnswerLOs[2];
            item['wrongAnswer3RelatedItems'] = getRelatedItems(answers.wrongAnswerLOs[2]);
            items.push(item);
        });

        return _.map(items, function (item) {
            var questionLO, itemControls;

            if (item.question.learningObjectiveIds.length > 0) {
                questionLO = item.question.learningObjectiveIds[0];
            } else {
                questionLO = '';
            }

            if (_this.props.enableClickthrough) {
                itemControls = <div className="item-controls">
                    <ItemControls item={item}
                                  libraryId={_this.props.libraryId} />
                </div>
            } else {
                itemControls = '';
            }

            return <Row key={item.id}>
                <Col sm={6} md={6} lg={6}>
                    <Panel header={item.displayName.text}>
                        <div className="text-row-wrapper">
                            <p className="question-label">Q:</p>
                            <QuestionText questionId={item.id}
                                          questionLO={questionLO}
                                          questionText={item.question.text.text}
                                          enableClickthrough={_this.props.enableClickthrough}
                                          libraryId={_this.props.libraryId}
                                          outcomes={_this.state.outcomes} />
                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">a)</p>
                            <AnswerText answerText={item.correctAnswer}
                                        outcomes={_this.state.outcomes}
                                        hideLinkBtn="true"/>
                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">b)</p>
                            <AnswerText answerId={item.wrongAnswer1ID}
                                        answerText={item.wrongAnswer1}
                                        confusedLO={item.wrongAnswer1LO}
                                        enableClickthrough={_this.props.enableClickthrough}
                                        itemId={item.id}
                                        libraryId={_this.props.libraryId}
                                        outcomes={_this.state.outcomes}
                                        relatedItems={item.wrongAnswer1RelatedItems} />
                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">c)</p>
                            <AnswerText answerId={item.wrongAnswer2ID}
                                        answerText={item.wrongAnswer2}
                                        confusedLO={item.wrongAnswer2LO}
                                        enableClickthrough={_this.props.enableClickthrough}
                                        itemId={item.id}
                                        libraryId={_this.props.libraryId}
                                        outcomes={_this.state.outcomes}
                                        relatedItems={item.wrongAnswer2RelatedItems}  />
                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">d)</p>
                            <AnswerText answerId={item.wrongAnswer3ID}
                                        answerText={item.wrongAnswer3}
                                        confusedLO={item.wrongAnswer3LO}
                                        enableClickthrough={_this.props.enableClickthrough}
                                        itemId={item.id}
                                        libraryId={_this.props.libraryId}
                                        outcomes={_this.state.outcomes}
                                        relatedItems={item.wrongAnswer3RelatedItems}  />
                        </div>
                        {itemControls}
                    </Panel>
                </Col>
                <Col sm={6} md={6} lg={6}>
                    <Panel header="Learning Outcomes">
                        <div className="text-row-wrapper">
                            <p className="question-label">Q:</p>
                            {_this.getOutcomeDisplayName(questionLO)}
                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">a)</p>
                            <p className="correct-answer-lo">
                                Correct answer -- no confused LO
                            </p>
                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">b)</p>
                            {_this.getOutcomeDisplayName(item.wrongAnswer1LO)}
                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">c)</p>
                            {_this.getOutcomeDisplayName(item.wrongAnswer2LO)}
                        </div>
                        <div className="text-row-wrapper">
                            <p className="answer-label">d)</p>
                            {_this.getOutcomeDisplayName(item.wrongAnswer3LO)}
                        </div>
                    </Panel>
                </Col>
            </Row>
        });
    },
    sortItemsByOutcome: function () {
        // get a pre-sorted list of all items, organized by learning outcome
        this.setState({ sortedItems: LORelatedItems(this.props.items, this.state.outcomes) });
    },
    render: function () {
        return <Grid>
            {this.renderItems()}
        </Grid>
    }
});

module.exports = ItemsList;
