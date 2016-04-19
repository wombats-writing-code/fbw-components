// Filename: fbw_author/app.js
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ItemAuthoring = require('./components/ItemAuthoring');

// use factory method. calling old element has been deprecated in release 15.0.0
ReactDOM.render(React.createElement(ItemAuthoring), document.getElementById('itemAuthoringPane'));
