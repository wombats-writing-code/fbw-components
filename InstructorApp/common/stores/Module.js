// Module store (Handcar)

var ModuleConstants = require('../constants/Module');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var HandcarFetch = require('../../utilities/handcar/fetch');

var ActionTypes = ModuleConstants.ActionTypes;
var BankMap = ModuleConstants.BankMap;
var CHANGE_EVENT = ActionTypes.CHANGE_EVENT;
var GenusTypes = ModuleConstants.GenusTypes;

var _modules = [];

var ModuleStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT, _modules);
  },
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getModule: function (id) {
    return _.find(_modules, function (module) {
      return module.id == id;
    });
  },
  getModules: function (bankId) {
    // console.log('getting modules');

    var _this = this,
      params = {
        path: '/learning/objectivebanks/' + BankMap[bankId] + '/objectives/roots?descendentlevels=2'
      };
    HandcarFetch(params, function (data) {
      // console.log('got modules');
      _modules = data;
      _this.emitChange();
    });
  }
});


module.exports = ModuleStore;
