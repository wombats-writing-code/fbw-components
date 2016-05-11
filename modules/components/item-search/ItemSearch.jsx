// ItemSearch.js

'use strict';
require('./ItemSearch.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Badge = ReactBS.Badge;
var FormControl = ReactBS.FormControl;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var InputGroup = ReactBS.InputGroup;


var ItemsList = require('../items-list/ItemsList');
var LibraryItemsStore = require('../../stores/LibraryItemsStore');

var ItemSearch = React.createClass({
    getInitialState: function () {
        return {
            searchQuery: '',
            filteredItems: []
        }
    },
    componentWillMount: function() {
        // re-filter items if they are updated / created
        var _this = this;
        LibraryItemsStore.addChangeListener(function(items) {
            _this.filterItems();
        });
    },
    componentDidMount: function () {
        this.filterItems();
    },
    filterItems: function () {
        // TODO: take this.props.items and filter them according to the query term
        var filteredItems = [],
            q = this.state.searchQuery.toLowerCase();

        if (q != '') {
            _.each(this.props.items, function (item) {
                var choices = item.question.choices,
                    choiceMatch = false;

                _.each(choices, function (choice) {
                    if (choice.text.toLowerCase().indexOf(q) >= 0) {
                        choiceMatch = true;
                    }
                });

                if (item.displayName.text.toLowerCase().indexOf(q) >= 0 ||
                    item.description.text.toLowerCase().indexOf(q) >= 0 ||
                    item.question.text.text.toLowerCase().indexOf(q) >= 0 ||
                    choiceMatch) {
                    filteredItems.push(item);
                }
            });
        } else {
            filteredItems = this.props.items;
        }

        this.setState({ filteredItems: filteredItems });
    },
    render: function () {
        return <div>
            <FormGroup className="item-search">
                <InputGroup>
                    <InputGroup.Addon>
                        <Glyphicon glyph="search"/>
                    </InputGroup.Addon>
                    <FormControl type="search"
                                 className="item-search__input"
                                 placeholder="Search question items (text in questions / choices)"
                                 onChange={this._onChange}
                                 value={this.state.searchQuery} />
                </InputGroup>
            </FormGroup>
            <ItemsList items={this.state.filteredItems}
                       libraryId={this.props.libraryId}
                       enableClickthrough={true}/>
        </div>
    },
    _onChange: function(event) {
        var _this = this;
        this.setState({searchQuery: event.target.value}, function () {
            _this.filterItems();
        });
    }

});

module.exports = ItemSearch;
