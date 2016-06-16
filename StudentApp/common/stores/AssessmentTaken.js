// assessment taken store

var AssessmentTakenDispatcher = require('../dispatchers/AssessmentTaken');
var AssessmentTakenConstants = require('../constants/AssessmentTaken');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var qbankFetch = require('../../utilities/qbank/fetch');

var ActionTypes = AssessmentTakenConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _assessmentstaken = {};

var AssessmentTakenStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT, _assessmentstaken);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getAssessmentTaken: function (id) {
    return _.find(_assessmentstaken, function (assessment) {
      return assessment.id == id;
    });
  },
  getAssessmentsTaken: function (bankId, assessmentOfferedId) {
    var _this = this,
      numObjects = 0,
      params = {
        path: 'assessment/banks/' + bankId + '/assessments?page=all'
      },
      finalAssessments = [];

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
      } else {
        _assessments = [];
        _this.emitChange();
      }
    });
  }
});

AssessmentTakenStore.dispatchToken = AssessmentTakenDispatcher.register(function (action) {
    switch(action.type) {
    }
});

module.exports = AssessmentTakenStore;
