// ItemSearch.js

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Badge = ReactBS.Badge;


var ItemsList = require('../ItemsList');
var LibraryItemsStore = require('../../stores/LibraryItemsStore');

var ItemSearch = React.createClass({
    getInitialState: function () {
        return {
            searchQuery: '',
            filteredItems: this.props.items
        }
    },
    componentWillMount: function() {
        var _this = this;
    },
    componentDidMount: function () {
    },
    render: function () {
        return <div>
            <div class="item-search">
             <input type="search" class="item-search__input" placeholder="Search question items by question text"
               onChange={this._onChange} value={this.state.searchQuery}/>
            </div>
            <ItemsList items={this.state.filteredItems}
                       libraryId={this.props.libraryId}
                       enableClickthrough={true}/>
        </div>
    },
    _onChange: function(event) {
      this.setState({searchQuery: event.target.value});
      // TODO: ask cole what the purpose of ItemWrapper is. let's pass down a filtered list of items to ItemsList
      // this.props.onChange();
    }

});

module.exports = ItemSearch;
