// ConfigureCKEditor.js
// the cookie getting parts from:
// From: https://docs.djangoproject.com/en/1.6/ref/contrib/csrf/
// And:  http://stackoverflow.com/questions/6506897/csrf-token-missing-or-incorrect-while-post-parameter-via-ajax-in-django

'use strict';

let $ = require('jquery');

let ConfigureCKEditor = function (editor, repositoryId) {
    let MiddlewareService = require('../services/middleware.service.js');

    editor.config.extraPlugins = 'uploadimage';
    editor.config.filebrowserUploadUrl = MiddlewareService.host() + '/repository/repositories/' + repositoryId + '/assets';
    editor.config.mathJaxLib = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML';
};

module.exports = ConfigureCKEditor;