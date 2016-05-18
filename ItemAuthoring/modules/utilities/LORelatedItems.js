// LORelatedItems.js
'use strict';

var _ = require('lodash');


var LORelatedItems = function (items, outcomes) {
    // given a list of items, and a list of learning outcomes,
    // returns a sorted dictionary of the items where the question itself
    // is tagged with each given LO.
    // loId => [itemsList]

    var returnData = {};

    _.each(items, function (item) {
        _.each(outcomes, function (outcome) {
            var outcomeId = outcome.id;
            if (!returnData.hasOwnProperty(outcomeId)) {
                returnData[outcomeId] = [];
            }
            if (item.learningObjectiveIds[0] == outcomeId) {
                returnData[outcomeId].push(item);
            }
        });
    });

    return returnData;
};

module.exports = LORelatedItems;