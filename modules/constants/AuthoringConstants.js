var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        CHANGE_EVENT: null,
        CREATE_ITEM: null,
        DELETE_ITEM: null,
        UPDATE_ITEM: null
    }),
    GenusTypes: {
        CORRECT_ANSWER: 'answer-type%3Aright-answer%40ODL.MIT.EDU',
        WRONG_ANSWER: 'answer-type%3Awrong-answer%40ODL.MIT.EDU'
    }
};