// CKEditorModalHack.js
// Needed because stacking a CKEditor dialog window (i.e. for table definition) on
// top of a Bootstrap / ReactBS modal conflicts, due to the tabindex="-1" setting
// on the Bootstrap modal.
// http://stackoverflow.com/questions/19570661/ckeditor-plugin-text-fields-not-editable


'use strict';

var $ = require('jquery');
var _ = require('lodash');


var CKEditorModalHack = function () {
    $('.fade.in.modal').attr('tabindex', '');
};

module.exports = CKEditorModalHack;