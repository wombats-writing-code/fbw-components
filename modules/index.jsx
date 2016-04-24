// Filename: fbw_author/index.jsx
'use strict';
require('../stylesheets/app.css');

var React = require('react');
var ReactDOM = require('react-dom');
var ItemAuthoring = require('./components/ItemAuthoring');

ReactDOM.render(<ItemAuthoring />, document.getElementById('itemAuthoringPane'));