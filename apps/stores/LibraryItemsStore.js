// LibraryItemsStore.js
'use strict';

var LibraryItemsDispatcher = require('../dispatcher/LibraryItemsDispatcher');
var AuthoringConstants = require('../constants/AuthoringConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');

var ActionTypes = AuthoringConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _items = [];

var LibraryItemsStore = assign({}, EventEmitter.prototype, {
    emitChange: function () {
        this.emit(CHANGE_EVENT, _items);
    },
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    createNewItem: function (payload) {
        var url = this.url() + payload.libraryId + '/items',
            _this = this,
            data = new FormData();

        _.each(_.keys(payload), function (key) {
            if (key != 'questionFile') {
                data.append(key, payload[key]);
            }
        });
        data.append('question_image_file', payload.questionFile);

        fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers({
                'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value
            }),
            body: data
        }).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    _this.getItems(payload.libraryId);
                    console.log(data);
                });
            } else {
                response.text().then(function (data) {
                    alert(response.statusText + ': ' + data);
                });
            }
        }).catch(function (error) {
            console.log('Problem with creating item: ' + error.message);
        });
    },
    getItems: function (id) {
        var url = this.url() + id + '/items?wronganswers',
            _this = this;
        fetch(url, {
            credentials: "same-origin"
        }).then(function (response) {
            response.json().then(function (data) {
                _items = data;
                _this.emitChange();
            });
        }).catch(function (error) {
            console.log('Problem with getting library items: ' + error.message);
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

LibraryItemsStore.dispatchToken = LibraryItemsDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.CREATE_ITEM:
            LibraryItemsStore.createNewItem(action.content);
            break;
    }
});

module.exports = LibraryItemsStore;