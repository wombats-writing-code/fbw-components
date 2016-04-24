// ItemSearch.js

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Badge = ReactBS.Badge;


var LibraryItemsStore = require('../../stores/LibraryItemsStore');

var ItemSearch = React.createClass({
    getInitialState: function () {
        return {
            searchQuery: '',
            libraries: []
        }
    },
    componentWillMount: function() {
        var _this = this;
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
        return <div class="item-search">
             <input type="search" class="item-search__input" placeholder="Search question items by question text"
               onChange={this._onChange} value={this.state.searchQuery}/>
            </div>
    },
    _onChange: function(event) {
      this.setState({searchQuery: event.target.value});
      // TODO: ask cole what the purpose of ItemWrapper is. let's pass down a filtered list of items to ItemsList
      // this.props.onChange();
    }

});

module.exports = ItemSearch;
