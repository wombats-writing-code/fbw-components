// SortItemsByModuleOutcomes.js
'use strict';

var _ = require('lodash');


var SortItemsByModuleOutcomes = function (items, modules) {
    // given a list of items, and a list of modules (learning topics),
    // returns a sorted dictionary of the items where the question itself
    // is tagged with each given LO.
    // loId => [itemsList]

    var returnData = {
        uncategorized: []
    };

    _.each(items, function (item) {
        var foundModuleMatch = false;
        _.each(modules, function (module) {
            var outcomes = module.childNodes,
                outcomeIds = _.map(outcomes, 'id'),
                moduleId = module.id;

            if (!returnData.hasOwnProperty(moduleId)) {
                returnData[moduleId] = [];
            }
            if (outcomeIds.indexOf(item.learningObjectiveIds[0]) >= 0) {
                returnData[moduleId].push(item);
                foundModuleMatch = true;
            }
        });

        if (!foundModuleMatch) {
            returnData.uncategorized.push(item);
        }
    });

    return returnData;
};

module.exports = SortItemsByModuleOutcomes;