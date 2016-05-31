// Item store

var ItemDispatcher = require('../dispatchers/Item');
var ItemConstants = require('../constants/Item');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var credentials = require('../constants/qbank_credentials');
var qbankFetch = require('../../utilities/fetch/fetch');

var ActionTypes = ItemConstants.ActionTypes;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;

var _items = [];

var ItemStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT, _items);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    console.log(callback);
    this.removeListener(CHANGE_EVENT, callback);
  },
  getItem: function (id) {
    return _.find(_items, function (item) {
      return item.id == id;
    });
  },
  getItems: function (bankId) {
    var _this = this,
      params = {
        path: 'assessment/banks/' + bankId + '/items?page=all'
      };
    qbankFetch(params, function (data) {
      _items = data.data.results;
      _this.emitChange();
    });
  }
});

ItemStore.dispatchToken = ItemDispatcher.register(function (action) {
    switch(action.type) {
        case ActionTypes.CREATE_ASSESSMENT:
            ItemStore.createAssessment(action.content);
            break;
        case ActionTypes.UPDATE_ASSESSMENT:
            ItemStore.updateAssessment(action.content);
            break;
        case ActionTypes.DELETE_ASSESSMENT:
            ItemStore.deleteAssessment(action.content);
            break;
    }
});

module.exports = ItemStore;