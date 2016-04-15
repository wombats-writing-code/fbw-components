// Filename: fbw_author/app.js
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ItemAuthoring = require('./apps/components/ItemAuthoring');

ReactDOM.render(<ItemAuthoring />, document.getElementById('itemAuthoringPane'));