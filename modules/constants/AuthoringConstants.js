var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        CHANGE_EVENT: null,
        CREATE_ITEM: null,
        DELETE_ITEM: null,
        UPDATE_ITEM: null,
        LINK_ANSWER_LO: null,
        LINK_ITEM_LO: null
    }),
    GenusTypes: {
        CORRECT_ANSWER: 'answer-type%3Aright-answer%40ODL.MIT.EDU',
        WRONG_ANSWER: 'answer-type%3Awrong-answer%40ODL.MIT.EDU'
    },
    ChoiceLabels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],  // for multi-choice choices
    SequenceNumberTexts: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']  // useful for labeling the Nth wrong answer
};