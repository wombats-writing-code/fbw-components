// ConfigureCKEditor.js

'use strict';

var $ = require('jquery');

var ConfigureCKEditor = function (editor, repositoryId) {
    var MiddlewareService = require('../services/middleware.service.js');

    editor.config.allowedContent = true;
    editor.config.extraPlugins = 'uploadimage';
    editor.config.filebrowserUploadUrl = MiddlewareService.host() + '/repository/repositories/' + repositoryId + '/assets';
    editor.config.mathJaxLib = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=default';
};

module.exports = ConfigureCKEditor;