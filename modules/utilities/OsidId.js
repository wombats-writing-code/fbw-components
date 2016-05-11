// OsidId.js
'use strict';

var OsidId = {
    getIdentifier: function (idString) {
        var identifier = idString.slice(idString.indexOf('%3A') + 3,
                                        idString.indexOf('%40'));
        return decodeURIComponent(decodeURIComponent(identifier));
    }
};

module.exports = OsidId;