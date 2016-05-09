'use strict';

var LibrariesDispatcher = require('../dispatcher/LibrariesDispatcher');
var AuthoringConstants = require('../constants/AuthoringConstants');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var MiddlewareService = require('../services/middleware.service')

var ActionTypes = AuthoringConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _libraries = [];

var LibrariesStore = _.assign({}, EventEmitter.prototype, {
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
            cache: "no-store",
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
        if (MiddlewareService.shouldReturnStatic()) return '/raw_data/libraries.json';

        return MiddlewareService.host() + '/assessment/libraries/';
    }
});

LibrariesStore.dispatchToken = LibrariesDispatcher.register(function (action) {
    switch(action.type) {
    }
});

module.exports = LibrariesStore;
