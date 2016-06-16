// assessment store

var AssessmentDispatcher = require('../dispatchers/Assessment');
var AssessmentConstants = require('../constants/Assessment');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var qbankFetch = require('../../utilities/qbank/fetch');

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
  getAssessments: function (bankIds) {
    var _this = this,
      numObjects = bankIds.length,
      finalAssessments = [];

    _.each(bankIds, function (bankId) {
      qbankFetch(params, function (data) {
        var assessments = data.data.results;

        numObjects = numObjects + assessments.length;
        if (numObjects != 0) {
          _.each(assessments, function (assessment) {
            var assessmentParams = {
              path: 'assessment/banks/' + bankId + '/assessments/' + assessment.id + '/assessmentsoffered?page=all'
            };
            qbankFetch(assessmentParams, function (offeredData) {
              var mashUp = assessment;
              offered = offeredData.data.results[0];  // Assume only one offered per assessment,
              //   given how we are authoring them in this app
              numObjects++;

              mashUp.startTime = offered.startTime;
              mashUp.deadline = offered.deadline;
              mashUp.assessmentOfferedId = offered.id;

              finalAssessments.push(mashUp);

              numObjects--;
              if (numObjects === 0) {
                _assessments = finalAssessments;
                _this.emitChange();
              }
            });
            numObjects--;
          });
        }

        numObjects--;
      });
    });
  }
});

AssessmentStore.dispatchToken = AssessmentDispatcher.register(function (action) {
    switch(action.type) {
    }
});

module.exports = AssessmentStore;
