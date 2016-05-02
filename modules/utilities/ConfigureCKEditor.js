// ConfigureCKEditor.js
// the cookie getting parts from:
// From: https://docs.djangoproject.com/en/1.6/ref/contrib/csrf/
// And:  http://stackoverflow.com/questions/6506897/csrf-token-missing-or-incorrect-while-post-parameter-via-ajax-in-django

'use strict';

let $ = require('jquery');

let ConfigureCKEditor = function (editor, repositoryId) {
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    let csrftoken = getCookie('csrftoken');

    editor.config.extraPlugins = 'uploadimage';
    editor.config.filebrowserUploadUrl = '/api/v1/repository/repositories/' + repositoryId + '/assets';
    editor.config.mathJaxLib = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML';

    // to handle csrf from:
    // http://stackoverflow.com/a/34213891
    editor.on('imageUploadRequest', function (e) {
        let xhr = e.data.fileLoader.xhr;
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
        xhr.withCredentials = true;
    });
};

module.exports = ConfigureCKEditor;