// Filename: fbw_author/index.jsx
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ItemAuthoring = require('./components/item-authoring/ItemAuthoring');

ReactDOM.render(<ItemAuthoring />, document.getElementById('itemAuthoringPane'));
