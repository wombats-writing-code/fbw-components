'use strict';

var OutcomesDispatcher = require('../dispatcher/OutcomesDispatcher');
var AuthoringConstants = require('../constants/AuthoringConstants');
var MiddlewareService = require('./middleware.service');

var EventEmitter = require('events').EventEmitter;

var ActionTypes = AuthoringConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _outcomes = [];

var OutcomesStore = _.assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT, _outcomes);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    get: function (id) {
        return _.find(_outcomes, function (outcome) {
            return outcome.id == id;
        });
    },
    getAll: function () {
        var _this = this;
        fetch(this.url(), {
            credentials: "same-origin"
        }).then(function (response) {
            response.json().then(function (data) {
                _outcomes = data;
                _this.emitChange();
            });
        })
        .catch(function (error) {
            console.log('Problem with getting objectives: ' + error.message);
        });
    },
    url: function () {
      return MiddlewareService.host() + '/learning/objectives/';
    }
});

OutcomesStore.dispatchToken = OutcomesDispatcher.register(function (action) {
    switch(action.type) {
    }
});

module.exports = OutcomesStore;
