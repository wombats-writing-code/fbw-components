// ItemWrapper.js
// should include item status, item search, and then items list

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Badge = ReactBS.Badge;
var Col = ReactBS.Col;
var Row = ReactBS.Row;

var LibraryItemsStore = require('../stores/LibraryItemsStore');

var AddItem = require('./add-item/AddItem');
var ItemSearch = require('./item-search/ItemSearch');
var ItemStatus = require('./item-status/ItemStatus');

var ItemWrapper = React.createClass({
    getInitialState: function () {
        return {
        }
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {
        // get list of modules to filter by
    },
    render: function () {
        return <div>
            <Row>
                <Col sm={6} md={4} lg={4}>
                    <ItemStatus items={this.props.items}
                                libraryDescription={this.props.libraryDescription} />
                </Col>
                <Col sm={4} md={2} lg={2}>
                    <AddItem libraryId={this.props.libraryId} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ItemSearch items={this.props.items}
                                libraryId={this.props.libraryId} />
                </Col>
            </Row>
        </div>
    }
});

module.exports = ItemWrapper;
