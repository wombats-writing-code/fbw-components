// ShibSessionCheck.js
'use strict';

var _ = require('lodash');

var ShibSessionCheck = function (item) {
  var hostLocation = window.location.host,
    path = window.location.pathname;

  if (path.indexOf('touchstone') >= 0) {
    setInterval(function () {
      // TODO: move this to the middleware service
      if (hostLocation.indexOf('localhost') >= 0 || hostLocation.indexOf('127.0.0.1') >= 0) {
        var testUrl = '/touchstone/api/v1/assessment/libraries';
      } else {
        var testUrl = '/fbw-author/touchstone/api/v1/assessment/libraries';
      }

      fetch(testUrl, {
          cache: "no-store",
          credentials: "same-origin",
          mode: "no-cors"
        })
      .then(function (response) {
        if (!response.ok) {
          alert('Your Touchstone session has expired. Please reload the page and sign back in.');
        }
      }).catch(function (error) {
        console.log('Server error: ' + error.message);
      });
    }, 10 * 60 * 1000);
  }
};

module.exports = ShibSessionCheck;