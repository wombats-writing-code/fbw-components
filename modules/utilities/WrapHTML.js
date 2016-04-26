// WrapHTML.js
'use strict';

var WrapHTML = function (str) {
    return '<html>' +
        '<head>' +
            '<style>body * {margin:0px;padding:4px;}</style>' +
        '</head>' +
        '<body style="margin:0px;">' + str + '</body' +
    '</html>';
};

module.exports = WrapHTML;