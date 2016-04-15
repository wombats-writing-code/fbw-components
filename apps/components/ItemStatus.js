// ItemStatus.js

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Label = ReactBS.Label;

var LibraryItemsStore = require('../stores/LibraryItemsStore');



var ItemStatus = React.createClass({
    getInitialState: function () {
        return {
            items: this.props.items
        }
    },
    componentWillMount: function() {
        var _this = this;
        LibraryItemsStore.addChangeListener(function(items) {
            _this.setState({ items: items });
        });
    },
    componentDidMount: function () {

    },
    render: function () {
        // How to figure out how many are uncurated?
        var libraryName = this.props.libraryDescription,
            numberItems = this.state.items.length,
            numberUncuratedItems = 42;

        return <div>
            <div>
                {libraryName}: {numberItems} questions
            </div>
            <div>
                Number of uncurated questions: <Label bsStyle="danger">{numberUncuratedItems}</Label>
            </div>
        </div>
    }
});

module.exports = ItemStatus;