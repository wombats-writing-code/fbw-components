// customized fetch version for Handcar authenticated calls
'use strict';

var credentials = require('../credentials/handcar_credentials');
var fetchWithHandling = require('./fetchWithHandling');

var handcarFetch = function (params, successCallback, errorCallback) {
    // wrapper around global fetch to include signing
  let URL = 'https://' + credentials.Host + '/handcar/services';
  var url = URL + params.path;

  if (url.indexOf('%3A') >= 0) {
    url = decodeURIComponent(url);
  }

  if (url.indexOf('?') >= 0) {
    url = url + '&proxyname=' + credentials.ProxyKey;
  } else {
    url = url + '?proxyname=' + credentials.ProxyKey;
  }

  fetchWithHandling(url, successCallback, errorCallback);

};

module.exports = handcarFetch;
