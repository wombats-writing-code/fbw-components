// LibraryItemsStore.js
'use strict';

var LibraryItemsDispatcher = require('../dispatcher/LibraryItemsDispatcher');
var AuthoringConstants = require('../constants/AuthoringConstants');
var EventEmitter = require('events').EventEmitter;
var MiddlewareService = require('../services/middleware.service.js');
var _ = require('lodash');

var ActionTypes = AuthoringConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _items = [];

var LibraryItemsStore = _.assign({}, EventEmitter.prototype, {
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
            if (key == 'question' || key == 'answers') {
                data.append(key, JSON.stringify(payload[key]));
            } else if (key != 'questionFile') {
                data.append(key, payload[key]);
            }
        });

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
    deleteItem: function (data) {
        var url = this.url() + data.libraryId + '/items/' + data.itemId,
            _this = this;

        fetch(url, {
            method: 'DELETE',
            credentials: "same-origin",
            headers: new Headers({
                'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value
            })
        }).then(function (response) {
            if (response.ok) {
                _this.getItems(data.libraryId);
                console.log('item deleted');
            } else {
                response.text().then(function (responseData) {
                    alert(response.statusText + ': ' + responseData);
                });
            }
        }).catch(function (error) {
            console.log('Problem with deleting item: ' + error.message);
        });
    },
    getItemDetails: function (libraryId, itemId, callback) {
        var url;

        if (MiddlewareService.shouldReturnStatic()) {
          url = '/raw_data/CAD_item_with_file_url.json';
        } else {
          url = this.url() + libraryId + '/items/' + itemId;
        }

        fetch(url, {
            cache: "no-store",
            credentials: "same-origin"
        }).then(function (response) {
            response.json().then(function (data) {
                callback(data);
            });
        }).catch(function (error) {
            console.log('Problem with getting specific item: ' + error.message);
        });
    },
    getItems: function (id) {
        var url, _this = this;

        if (MiddlewareService.shouldReturnStatic()) {
          url = '/raw_data/CAD_items.json';
        } else {
          url = this.url() + id + '/items?wronganswers';
        }

        fetch(url, {
            cache: "no-store",
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
    linkAnswerToLO: function (payload) {
        var url = this.url() + payload.libraryId + '/items/' + payload.itemId,
            _this = this,
            data = new FormData();

        data.append('answers', JSON.stringify([{
            answerId: payload.answerId,
            confusedLearningObjectiveIds: [payload.confusedLearningObjectiveId]
        }]));

        fetch(url, {
            method: 'PUT',
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
            console.log('Problem with linking answer to a confused learning objective: ' + error.message);
        });
    },
    linkItemToLO: function (payload) {
        var url = this.url() + payload.libraryId + '/items/' + payload.itemId,
            _this = this,
            data = new FormData();

        data.append('learningObjectiveId', payload.learningObjectiveId);

        fetch(url, {
            method: 'PUT',
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
            console.log('Problem with linking question to a learning objective: ' + error.message);
        });
    },
    updateItem: function (payload) {
        var url = this.url() + payload.libraryId + '/items/' + payload.itemId,
            _this = this,
            data = new FormData();

        _.each(_.keys(payload), function (key) {
            if (key == 'question' || key == 'answers') {
                data.append(key, JSON.stringify(payload[key]));
            } else if (key != 'questionFile') {
                data.append(key, payload[key]);
            }
        });

        fetch(url, {
            method: 'PUT',
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
            console.log('Problem with updating item ' + payload.itemId + ': ' + error.message);
        });
    },
    url: function () {
      if (MiddlewareService.shouldReturnStatic()) return '/raw_data/libraries.json';

      return MiddlewareService.host() + '/assessment/libraries/';
    }
});

LibraryItemsStore.dispatchToken = LibraryItemsDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.CREATE_ITEM:
            LibraryItemsStore.createNewItem(action.content);
            break;
        case ActionTypes.DELETE_ITEM:
            LibraryItemsStore.deleteItem(action.content);
            break;
        case ActionTypes.UPDATE_ITEM:
            LibraryItemsStore.updateItem(action.content);
            break;
        case ActionTypes.LINK_ANSWER_LO:
            LibraryItemsStore.linkAnswerToLO(action.content);
            break;
        case ActionTypes.LINK_ITEM_LO:
            LibraryItemsStore.linkItemToLO(action.content);
            break;
    }
});

module.exports = LibraryItemsStore;
