var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        CHANGE_EVENT: null,
        CREATE_ITEM: null,
        DELETE_ITEM: null,
        UPDATE_ITEM: null
    })
};