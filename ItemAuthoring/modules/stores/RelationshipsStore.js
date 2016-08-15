// RelationshipsStore.js

'use strict';

var AuthoringConstants = require('../constants/AuthoringConstants');
var MiddlewareService = require('../services/middleware.service');

var EventEmitter = require('events').EventEmitter;

var ActionTypes = AuthoringConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _relationships = [];

var RelationshipsStore = _.assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT, _relationships);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getAll: function (familyId) {
        var _this = this,
            url = this.url() + familyId + '/relationships';
        fetch(url, {
            cache: "no-store",
            credentials: "same-origin"
        }).then(function (response) {
            response.json().then(function (data) {
                _relationships = data;
                _this.emitChange();
            });
        })
        .catch(function (error) {
            console.log('Problem with getting relationships: ' + error.message);
        });
    },
    url: function () {
      if (MiddlewareService.shouldReturnStatic()) return '/modules/components/dashboard/relationships.json';

      return MiddlewareService.host() + '/learning/objectivebanks/';
    }
});


module.exports = RelationshipsStore;
