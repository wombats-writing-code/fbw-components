// ItemAuthoring.js
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Grid = ReactBS.Grid;
var Row = ReactBS.Row;
var Col = ReactBS.Col;
var _ = require('lodash');

var LibraryItemsStore = require('../stores/LibraryItemsStore');

var ItemWrapper = require('./ItemWrapper');
var LibrarySelector = require('./LibrarySelector');

var ItemAuthoring = React.createClass({
    getInitialState: function () {
        return {
            libraryDescription: '',
            libraryId: '',
            items: [],
            outcomes: [],
            showItems: false
        };
    },
    componentWillMount: function() {
        var _this = this;
        LibraryItemsStore.addChangeListener(function(items) {
            _this.setState({ items: items });
            _this.setState({ showItems: true });
        });
    },
    componentDidMount: function () {
    },
    librarySelected: function (id, libraryDescription) {
        this.setState({ libraryId: id});
        this.setState({ libraryDescription: libraryDescription });
    },
    render: function () {
        var itemsWrapper = '';
        if (this.state.showItems) {
            itemsWrapper = <ItemWrapper items={this.state.items}
                                        libraryId={this.state.libraryId}
                                        libraryDescription={this.state.libraryDescription} />;
        }
        return <Grid>
            <Row>
                <Col sm={6} md={3} lg={3}>
                    <LibrarySelector onSelect={this.librarySelected}/>
                </Col>
            </Row>
            {itemsWrapper}
        </Grid>
    }
});

module.exports = ItemAuthoring;