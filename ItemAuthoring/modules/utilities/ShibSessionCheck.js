// ShibSessionCheck.js
'use strict';

var _ = require('lodash');

var ShibSessionCheck = function (item) {
  var hostLocation = window.location.host,
    path = window.location.pathname;

  if (path.indexOf('touchstone') >= 0) {
    setInterval(function () {
      if (hostLocation.indexOf('localhost') >= 0 || hostLocation.indexOf('127.0.0.1') >= 0) {
        var testUrl = '/touchstone/api/v1/assessment/libraries';
      } else {
        var testUrl = '/fbw-author/touchstone/api/v1/assessment/libraries';
      }

      fetch(testUrl, {
            cache: "no-store",
            credentials: "same-origin"
        })
        .then(function (response) {
        if (response.status == 403 || response.status == 302) {
          alert('Your Touchstone session has expired. Please reload the page.');
        }
      }).catch(function (error) {
        console.log('Server error: ' + error.message);
      });
    }, 5 * 60 * 1000);
  }
};

module.exports = ShibSessionCheck;