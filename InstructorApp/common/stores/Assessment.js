// assessment store

var AssessmentDispatcher = require('../dispatchers/Assessment');
var AssessmentConstants = require('../constants/Assessment');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var credentials = require('../constants/qbank_credentials');
var qbankFetch = require('../../utilities/fetch/fetch');

var ActionTypes = AssessmentConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _assessments = [];

var AssessmentStore = _.assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT, _assessments);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getAssessment: function (id) {
        return _.find(_assessments, function (assessment) {
            return assessment.id == id;
        });
    },
    getAssessments: function (bankId) {
        var _this = this,
            params = {
                path: 'assessment/banks/' + bankId + '/assessments?page=all'
            };
        qbankFetch(params, function (data) {
            _assessments = data.data.results;
            _this.emitChange();
        });
    }
});

AssessmentStore.dispatchToken = AssessmentDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.CREATE_OBJECTIVE:
            AssessmentStore.createObjective(action.content);
            break;
        case ActionTypes.UPDATE_OBJECTIVE:
            AssessmentStore.updateObjective(action.content);
            break;
        case ActionTypes.DELETE_OBJECTIVE:
            AssessmentStore.deleteObjective(action.content);
            break;
    }
});

module.exports = AssessmentStore;