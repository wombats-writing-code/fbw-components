// ItemsList.js

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Badge = ReactBS.Badge;


var LibraryItemsStore = require('../stores/LibraryItemsStore');

var ItemsList = React.createClass({
    getInitialState: function () {
        return {
            items: []
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
    renderLibraries: function () {
        return _.map(this.state.libraries, function (library) {
            return <option value={library.id}
                           title={library.description.text}
                           key={library.id}>
                {library.displayName.text}
            </option>;
        });
    },
    showItems: function (e) {
        LibraryItemsStore.getItems(e.currentTarget.selectedOptions[0].value);
    },
    render: function () {
        return <div>
            This is an item list
            </div>
    }
});

module.exports = ItemsList;