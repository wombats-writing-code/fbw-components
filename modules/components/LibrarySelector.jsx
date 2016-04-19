// LibrarySelector.js
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Input = ReactBS.Input;


var LibraryItemsStore = require('../stores/LibraryItemsStore');
var LibrariesStore = require('../stores/LibrariesStore');

var LibrarySelector = React.createClass({
    getInitialState: function () {
        return {
            libraries: []
        }
    },
    componentWillMount: function() {
        var _this = this;
        LibrariesStore.addChangeListener(function(libraries) {
            _this.setState({ libraries: libraries });
        });
    },
    componentDidMount: function () {
        LibrariesStore.getAll();
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
        var option = e.currentTarget.selectedOptions[0],
            id = option.value,
            description = option.title;
        LibraryItemsStore.getItems(id);
        this.props.onSelect(id, description);
    },
    render: function () {
        return <Input type="select"
                      label="Select class ..."
                      placeholder="Select a class"
                      onChange={this.showItems}>
            {this.renderLibraries()}
        </Input>
    }
});

module.exports = LibrarySelector;