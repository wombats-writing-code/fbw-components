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
            var ts = new Date();
          url = this.url() + id + '/items?wronganswers&unrandomized&ts=' + ts.toISOString();
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
                  var updatedItems = [];
                  _.each(_items, function (item) {
                    if (item.id == data.id) {
                      _.each(item.answers, function (answer) {
                        if (answer.id == payload.answerId) {
                          answer.confusedLearningObjectiveIds = [payload.confusedLearningObjectiveId];
                        }
                      });
                      updatedItems.push(item);
                    } else {
                      updatedItems.push(item);
                    }
                  });
                  console.log('new lo id');
                  console.log(payload.confusedLearningObjectiveId);
                  console.log(payload.answerId);
                  console.log(_.find(updatedItems, {id: 'assessment.Item%3A57bd9b2471e482b4e552213f%40bazzim.MIT.EDU'}));
                  _items = updatedItems;
                  _this.emitChange();
//                    _this.getItems(payload.libraryId);
//                    console.log(data);
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
                  var updatedItems = [];
                  _.each(_items, function (item) {
                    if (item.id == data.id) {
                      item.learningObjectiveIds = [payload.learningObjectiveId];
                      item.question.learningObjectiveIds = [payload.learningObjectiveId];
                      updatedItems.push(item);
                    } else {
                      updatedItems.push(item);
                    }
                  });

                  _items = updatedItems;
                  _this.emitChange();
//                    _this.getItems(payload.libraryId);
//                    console.log(data);
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
            if (key == 'question' || key == 'answers' || key == 'assignedBankIds') {
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
                return response.json();
            } else {
                response.text().then(function (data) {
                    alert(response.statusText + ': ' + data);
                });
            }
        }).then(function (data) {
          // call this again to get the wrong answers
          var url = `${_this.url()}${payload.libraryId}/items/${payload.itemId}?wronganswers&unrandomized`;

          return fetch(url, {
              method: 'GET',
              credentials: "same-origin"
          });
        }).then(function (res) {
          return res.json();
        }).then(function (data) {
            var updatedItems = [];
            _.each(_items, function (item) {
              if (item.id == data.id) {
                updatedItems.push(data);
              } else {
                updatedItems.push(item);
              }
            });

            _items = updatedItems;
            _this.emitChange();
//                    _this.getItems(payload.libraryId);
//                    console.log(data);
        }).catch(function (error) {
            console.log('Problem with updating item ' + payload.itemId + ': ' + error.message);
        }).done();
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
