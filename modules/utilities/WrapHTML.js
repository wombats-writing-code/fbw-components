// WrapHTML.js
'use strict';

let WrapHTML = function (str) {
    let wrappedStr;
    if (str.indexOf("math-tex") >= 0) {
        wrappedStr = '<html>' +
            '<head>' +
            '<script type="text/javascript" src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=default"></script>' +
            '<style>body * {margin:0px;padding:4px;}</style>' +
            '</head>' +
            '<body style="margin:0px;">' + str + '</body>' +
            '</html>';
    } else {
        wrappedStr = '<html>' +
            '<head>' +
            '<style>body * {margin:0px;padding:4px;}</style>' +
            '</head>' +
            '<body style="margin:0px;">' + str + '</body>' +
            '</html>';
    }

    return wrappedStr;
};

module.exports = WrapHTML;