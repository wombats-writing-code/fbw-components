// ItemTypesStore.js
'use strict';

var AuthoringConstants = require('../constants/AuthoringConstants');
var EventEmitter = require('events').EventEmitter;
var MiddlewareService = require('../services/middleware.service.js');
var _ = require('lodash');

var ActionTypes = AuthoringConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _itemTypes = [];

var ItemTypesStore = _.assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT, _itemTypes);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    getSupportedItemTypes: function (libraryId) {
        var url = this.url() + libraryId + '/items/types',
            _this = this;

        fetch(url, {
            cache: "no-store",
            credentials: "same-origin"
        }).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    _itemTypes = data;
                    _this.emitChange();
                });
            } else {
                response.text().then(function (data) {
                    alert(response.statusText + ': ' + data);
                });
            }
        }).catch(function (error) {
            console.log('Problem with getting item types: ' + error.message);
        });
    },
    url: function () {
      if (MiddlewareService.shouldReturnStatic()) return '/raw_data/libraries.json';

      return MiddlewareService.host() + '/assessment/libraries/';
    }
});

module.exports = ItemTypesStore;
