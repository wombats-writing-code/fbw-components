// ItemsList.js

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Col = ReactBS.Col;
var Grid = ReactBS.Grid;
var Panel = ReactBS.Panel;
var Row = ReactBS.Row;

var AuthoringConstants = require('../constants/AuthoringConstants');
var GenusTypes = require('../constants/AuthoringConstants').GenusTypes;

var AnswerText = require('./AnswerText');
var ItemControls = require('./ItemControls');
var LibraryItemsStore = require('../stores/LibraryItemsStore');

var ItemsList = React.createClass({
    getInitialState: function () {
        return {
            showBSequence: false,
            showCSequence: false,
            showDSequence: false
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {
    },
    renderItems: function () {
        //TODO: Need to map the LOs to their displayNames...IDs are not useful
        var _this = this,
        // map the choiceIds, etc., in answers back to choices in questions
            items = [];

        _.each(this.props.items, function (item) {
            var answers = item.answers,
                rightAnswer = _.find(answers, {genusTypeId: "answer-type%3Aright-answer%40ODL.MIT.EDU"}),
                wrongAnswers = _.filter(answers, {genusTypeId: "answer-type%3Awrong-answer%40ODL.MIT.EDU"}),
                wrongAnswerIds = [],
                choices = item.question.choices,
                correctAnswerText, wrongAnswerTexts;

            correctAnswerText = _.find(choices, {"id": rightAnswer.choiceIds[0]});

            _.each(wrongAnswers, function (wrongAnswer) {
                wrongAnswerIds.push(wrongAnswer.choiceIds[0]);
            });

            wrongAnswerTexts = _.filter(choices, function (choice) {
                return wrongAnswerIds.indexOf(choice.id) >= 0;
            });

            item['correctAnswer'] = correctAnswerText.text;
            item['wrongAnswer1'] = wrongAnswerTexts[0].text;
            item['wrongAnswer2'] = wrongAnswerTexts[1].text;
            item['wrongAnswer3'] = wrongAnswerTexts[2].text;
            items.push(item);
        });

        return _.map(items, function (item) {
            return <Row key={item.id}>
                <Col sm={6} md={6} lg={6}>
                    <Panel header={item.displayName.text}>
                        <strong>Q:</strong>{item.question.text.text}
                        <br/>   a) <AnswerText answerText={item.correctAnswer} />
                        <br/>   b) <AnswerText answerText={item.wrongAnswer1} />
                        <br/>   c) <AnswerText answerText={item.wrongAnswer1} />
                        <br/>   d) <AnswerText answerText={item.wrongAnswer1} />
                        <br/>
                        <div className="itemControls">
                            <ItemControls item={item}
                                          libraryId={_this.props.libraryId} />
                        </div>
                    </Panel>
                </Col>
                <Col sm={6} md={6} lg={6}>
                    <Panel header="Learning Outcomes">
                        <strong>Q:</strong>{item.answers[0].confusedLearningObjectiveIds[0]}
                        <br/>
                        <strong>A:</strong>
                        <br/>
                    </Panel>
                </Col>
            </Row>
        });
    },
    render: function () {
        return <Grid>
            {this.renderItems()}
        </Grid>
    }
});

module.exports = ItemsList;