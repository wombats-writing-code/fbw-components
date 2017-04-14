// WrapHTML.js
'use strict';

var WrapHTML = function (str) {
    var wrappedStr;
//    if (str.indexOf("math-tex") >= 0) {
    wrappedStr = '<html>' +
        '<head>' +
        '<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=default"></script>' +
        '<style>body * {margin:0px;padding:4px;}</style>' +
        '</head>' +
        '<body style="margin:0px;">' + str + '</body>' +
        '</html>';
//    } else {
//        wrappedStr = '<html>' +
//            '<head>' +
//            '<style>body * {margin:0px;padding:4px;}</style>' +
//            '</head>' +
//            '<body style="margin:0px;">' + str + '</body>' +
//            '</html>';
//    }

    return wrappedStr;
};

module.exports = WrapHTML;