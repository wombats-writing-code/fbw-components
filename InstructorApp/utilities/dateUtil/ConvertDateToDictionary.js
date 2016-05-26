// ConvertDateToDictionary
// To make this compatible with QBank format for deadline and startTime
'use strict';

var ConvertDateToDictionary = function (date) {
  var utcHourOffset = date.getTimezoneOffset() / 60;
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours() + utcHourOffset,
    minute: date.getMinutes()
  };
};

module.exports = ConvertDateToDictionary;