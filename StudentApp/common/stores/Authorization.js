// Authorization store

var AuthorizationDispatcher = require('../dispatchers/Authorization');
var AuthorizationConstants = require('../constants/Authorization');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var qbankCredentials = require('../../utilities/credentials/qbank_credentials');
var qbankFetch = require('../../utilities/fetch/qbankFetch');

var BaseBanks = AuthorizationConstants.BaseBanks;
var StudentAuthorizationFunctions = AuthorizationConstants.StudentAuthorizationFunctions;

var _data = {};

var AuthorizationStore = _.assign({}, EventEmitter.prototype, {
  hasAuthorizations: function (data, callback) {
    // data should include username and the schoolId (acc or qcc)
    var url = 'assessment/banks/' + qbankCredentials.SchoolNodes[data.schoolId] + '/assessments/cantake',
      params = {
        path: url,
        proxy: data.username
      };

    qbankFetch(params, function (response) {
      callback(response.canTake);
    }, function (response) {
      // indicates a non-200 response from QBank
      callback(false);
    });
  },
  setAuthorizations: function (data, callback) {
    // data should include username and the schoolId (acc or qcc)
    // TODO: should include an end-date for the authorizations??
    var qualifierIds = BaseBanks,
      schoolNodeId = qbankCredentials.SchoolNodes[data.schoolId],
      params = {
      data: {
        bulk: []
      },
      method: 'POST',
      path: 'authorization/authorizations'
    };

    qualifierIds = qualifierIds.concat([schoolNodeId]);
    _.each(qualifierIds, function (qualifierId) {
      _.each(StudentAuthorizationFunctions, function (functionId) {
        params.data.bulk.push({
          agentId: data.username,
          functionId: functionId,
          qualifierId: qualifierId
        });
      });
    });

    qbankFetch(params, function (response) {
      console.log('bulk created authorizations');
      callback();
    });
  }
});

AuthorizationStore.dispatchToken = AuthorizationDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.SET_AUTHORIZATIONS:
            AuthorizationStore.setAuthorizations(action.content);
            break;
    }
});

module.exports = AuthorizationStore;
