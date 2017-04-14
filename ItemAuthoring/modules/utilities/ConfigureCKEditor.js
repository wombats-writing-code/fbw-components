// ConfigureCKEditor.js

'use strict';

var $ = require('jquery');

var ConfigureCKEditor = function (editor, repositoryId) {
    var MiddlewareService = require('../services/middleware.service.js');

    editor.config.allowedContent = true;
    editor.config.extraPlugins = 'uploadimage';
    editor.config.filebrowserUploadUrl = MiddlewareService.host() + '/repository/repositories/' + repositoryId + '/assets';
    editor.config.mathJaxLib = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=default';
};

module.exports = ConfigureCKEditor;