'use strict';
// as a test:
// input:
//    'POST /api/v2/assessment/banks/ HTTP/1.1\naccept: application/json\ndate: Mon, 14 Mar 2016 14:41:27 GMT\nhost: testserver:80\nx-api-proxy: taaccct_instructor'
// hashed but not encoded signature:
//    '\xf7y\x8e\xb5\xca\xf0>H \xf2\xf7\xd2\x10\\s\r\xeen\xcb\x9a\xcd\x94&\xef\x80\xc8\xd0\xa2\xfa5\nZ'
// expected signature:
//    '93mOtcrwPkgg8vfSEFxzDe5uy5rNlCbvgMjQovo1Clo='
// with public key: sIcaXKd67Y80MufpCB73
// and private key: LKswkklexT14vbudS4jOGzHvcEG48O1dAvhcVSJQ
var crypto = require('crypto-js');
var Buffer = require('buffer').Buffer;

var ALGORITHM = 'hmac-sha256';
var REQUIRED_HEADERS = [
  'request-line',
  'accept',
  'date',
  'host',
  'x-api-proxy'
];

function hmac(key, string) {
  var hmacOutput = crypto.HmacSHA256(string, key).toString(crypto.enc.HEX);
  var b = new Buffer(hmacOutput, 'hex');
  return b.toString('base64');
}

class QBankSignature {
  checkHeaderDate(options) {
    if (options.headers.hasOwnProperty('date')) {
      this.datetime = options.headers.date;
    } else {
      this.datetime = new Date().toLocaleString();
    }
  }
  getStringToSign() {
    var stringToSign = `${this.method.toUpperCase()} ${this.pathName} HTTP/1.1
      accept: ${this.headers.accept}
      date: ${this.datetime}
      host: ${this.headers.host}
      x-api-proxy: ${this.headers['x-api-proxy']}`;

    return stringToSign;
  }
  getSignature() {
    return hmac(this.credentials.SecretKey, this.getStringToSign());
  }
  getAuthorizationString() {
    return `Signature headers="${this.getSignedHeaders()}",keyId="${this.credentials.AccessKeyId}",algorithm="${ALGORITHM}",signature="${this.getSignature()}"`;
  }
  getSignedHeaders() {
    return REQUIRED_HEADERS.join(' ');
  }
  setParams(options) {
    this.checkHeaderDate(options);
    this.method = options.method.toUpperCase();
    this.pathName = decodeURI(options.path);
    this.headers = options.headers;
    this.credentials = options.credentials;
  }
}

module.exports = QBankSignature;
