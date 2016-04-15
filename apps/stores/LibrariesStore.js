'use strict';

var LibrariesDispatcher = require('../dispatcher/LibrariesDispatcher');
var AuthoringConstants = require('../constants/AuthoringConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');

var ActionTypes = AuthoringConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _libraries = [];

var LibrariesStore = assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT, _libraries);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getAll: function () {
        var _this = this;
        fetch(this.url(), {
            credentials: "same-origin"
        }).then(function (response) {
            response.json().then(function (data) {
                _libraries = data;
                _this.emitChange();
            });
        })
        .catch(function (error) {
            console.log('Problem with getting libraries: ' + error.message);
        });
    },
    url: function () {
        var location = window.location.href;
        if (location.indexOf('localhost') >= 0 || location.indexOf('127.0.0.1') >= 0) {
            return '/api/v1/assessment/libraries/';
        } else {
            return '/fbw_author/api/v1/assessment/libraries/';
        }

    }
});

LibrariesStore.dispatchToken = LibrariesDispatcher.register(function (action) {
    switch(action.type) {
    }
});

module.exports = LibrariesStore;