// ItemAuthoring.js
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Grid = ReactBS.Grid;
var Row = ReactBS.Row;
var Col = ReactBS.Col;
var _ = require('lodash');

var LibraryItemsStore = require('../stores/LibraryItemsStore');
var LibrariesStore = require('../stores/LibrariesStore');

var ItemWrapper = require('./item-wrapper/ItemWrapper');
var LibrarySelector = require('./LibrarySelector');

var ItemAuthoring = React.createClass({
    getInitialState: function () {
        return {
            libraries: [],
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
        LibrariesStore.addChangeListener(function(libraries) {
            _this.setState({ libraries: libraries });
        });
    },
    componentDidMount: function () {
        LibrariesStore.getAll();
    },
    hideItems: function () {
        this.setState({ showItems: false });
    },
    librarySelected: function (id, libraryDescription) {
        this.setState({ libraryId: id});
        this.setState({ libraryDescription: libraryDescription });
    },
    render: function () {
        var itemsWrapper = '';
        if (this.state.showItems) {
            itemsWrapper = <ItemWrapper items={this.state.items}
                                        libraries={this.state.libraries}
                                        libraryId={this.state.libraryId}
                                        libraryDescription={this.state.libraryDescription} />;
        }
        return <Grid>
            <Row>
                <Col sm={6} md={3} lg={3}>
                    <LibrarySelector libraries={this.state.libraries}
                                     onSelect={this.librarySelected}
                                     hideItems={this.hideItems} />
                </Col>
            </Row>
            {itemsWrapper}
        </Grid>
    }
});

module.exports = ItemAuthoring;