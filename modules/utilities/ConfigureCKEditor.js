// ConfigureCKEditor.js

'use strict';

let $ = require('jquery');

let ConfigureCKEditor = function (editor, repositoryId) {
    let MiddlewareService = require('../services/middleware.service.js');

    editor.config.extraPlugins = 'uploadimage';
    editor.config.filebrowserUploadUrl = MiddlewareService.host() + '/repository/repositories/' + repositoryId + '/assets';
    editor.config.mathJaxLib = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML';
};

module.exports = ConfigureCKEditor;