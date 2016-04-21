'use strict';

var OutcomesDispatcher = require('../dispatcher/OutcomesDispatcher');
var AuthoringConstants = require('../constants/AuthoringConstants');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

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
        var location = window.location.href;
        if (location.indexOf('localhost') >= 0 || location.indexOf('127.0.0.1') >= 0) {
            return '/api/v1/learning/objectives/';
        } else {
            return '/fbw-author/api/v1/learning/objectives/';
        }

    }
});

OutcomesStore.dispatchToken = OutcomesDispatcher.register(function (action) {
    switch(action.type) {
    }
});

module.exports = OutcomesStore;