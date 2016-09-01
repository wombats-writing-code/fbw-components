// AnswerExtraction.js
'use strict';

var _ = require('lodash');

var AnswerExtraction = function (item) {
    if (item.hasOwnProperty('answers')) {
        var answers = item.answers,
            rightAnswer = _.find(answers, {genusTypeId: "answer-type%3Aright-answer%40ODL.MIT.EDU"}),
            correctChoiceId = rightAnswer.choiceIds[0],
            wrongAnswers = _.filter(answers, {genusTypeId: "answer-type%3Awrong-answer%40ODL.MIT.EDU"}),
            wrongAnswerIds = [],
            wrongAnswerLOs = [],
            wrongChoiceIds = [],
            choices = item.question.choices,
            correctAnswerFeedback = item.solution.text,
            correctAnswerId = rightAnswer.id,
            correctAnswerText, wrongAnswerTexts;

        correctAnswerText = _.find(choices, {"id": correctChoiceId});

        _.each(wrongAnswers, function (wrongAnswer) {
            wrongAnswerIds.push(wrongAnswer.choiceIds[0]);
        });

        wrongAnswerTexts = _.filter(choices, function (choice) {
            return wrongAnswerIds.indexOf(choice.id) >= 0;
        });

        // need to get these in the same order as wrongAnswerTexts
        wrongAnswerIds = [];

        _.each(wrongAnswerTexts, function (wrongAnswerText) {
            var wrongAnswer = _.find(wrongAnswers, function (wrongAnswer) {
                return wrongAnswer.choiceIds[0] == wrongAnswerText.id;
            });
            wrongAnswerIds.push(wrongAnswer.id);
            wrongChoiceIds.push(wrongAnswer.choiceIds[0]);

            if (wrongAnswer.confusedLearningObjectiveIds.length > 0) {
                wrongAnswerLOs.push(wrongAnswer.confusedLearningObjectiveIds[0]);
            } else {
                wrongAnswerLOs.push('None linked yet');
            }
        });

        return {
            correctAnswerFeedback: correctAnswerFeedback,
            correctAnswerId: correctAnswerId,
            correctAnswerText: correctAnswerText,
            correctChoiceId: correctChoiceId,
            wrongAnswerIds: wrongAnswerIds,
            wrongAnswerLOs: wrongAnswerLOs,
            wrongAnswerTexts: wrongAnswerTexts,
            wrongChoiceIds: wrongChoiceIds
        };
    } else {
        return {
            correctAnswerFeedback: '',
            correctAnswerId: '',
            correctAnswerText: '',
            correctChoiceId: '',
            wrongAnswerIds: [],
            wrongAnswerLOs: [],
            wrongAnswerTexts: [],
            wrongChoiceIds: []
        };
    }
};

module.exports = AnswerExtraction;