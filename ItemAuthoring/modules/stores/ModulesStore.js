// ModulesStore.js

'use strict';

var AuthoringConstants = require('../constants/AuthoringConstants');
var MiddlewareService = require('../services/middleware.service');

var EventEmitter = require('events').EventEmitter;

var ActionTypes = AuthoringConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _modules = [];

var ModulesStore = _.assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT, _modules);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    get: function (id) {
        return _.find(_modules, function (module) {
            return module.id == id;
        });
    },
    getAll: function (libraryId) {
        var _this = this,
            url = this.url() + libraryId + '/modules';
        fetch(url, {
            cache: "no-store",
            credentials: "same-origin"
        }).then(function (response) {
            response.json().then(function (data) {
                _modules = data;
                _this.emitChange();
            });
        })
        .catch(function (error) {
            console.log('Problem with getting modules: ' + error.message);
        });
    },
    url: function () {
      if (MiddlewareService.shouldReturnStatic()) return '/raw_data/objectives.json';

      return MiddlewareService.host() + '/learning/objectivebanks/';
    }
});


module.exports = ModulesStore;
