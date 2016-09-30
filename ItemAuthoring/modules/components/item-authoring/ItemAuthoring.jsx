// ItemAuthoring.js
'use strict';
require('./ItemAuthoring.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Grid = ReactBS.Grid;
var Row = ReactBS.Row;
var Col = ReactBS.Col;
var _ = require('lodash');
var Spinner = require('halogen/RotateLoader');

var LibraryItemsStore = require('../../stores/LibraryItemsStore');
var LibrariesStore = require('../../stores/LibrariesStore');

var ItemWrapper = require('../item-wrapper/ItemWrapper');
var LibrarySelector = require('../LibrarySelector');
var Dashboard = require('../dashboard/Dashboard');

var ShibSessionCheck = require('../../utilities/ShibSessionCheck');

var ItemAuthoring = React.createClass({
    getInitialState: function () {
        return {
            libraries: [],
            libraryDescription: '',
            libraryId: '',
            loadingItems: false,
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
            _this.setState({ loadingItems: false });
        });
        LibrariesStore.addChangeListener(function(libraries) {
            _this.setState({ libraries: libraries });
        });
    },
    componentDidMount: function () {
        LibrariesStore.getAll();
        ShibSessionCheck();
    },
    hideItems: function () {
        this.setState({ showItems: false });
    },
    librarySelected: function (id, libraryDescription) {
        this.setState({ libraryId: id});
        this.setState({ libraryDescription: libraryDescription });
        this.setState({ loadingItems: true });
    },
    render: function () {
        var itemsWrapper = '';
        var loadingItems = <div />;
        if (this.state.showItems) {
            itemsWrapper = <ItemWrapper items={this.state.items}
                                        libraries={this.state.libraries}
                                        libraryId={this.state.libraryId}
                                        libraryDescription={this.state.libraryDescription} />;
        }

        if (this.state.loadingItems) {
          loadingItems = <div>
            <div>
              Loading the items ...
            </div>
            <div className="spinner-container">
              <Spinner color="#26A65B" size="16px" margin="75px" />
            </div>
          </div>;
        }

        return (
          <Grid>
              <Row>
                  <Col sm={6} md={3} lg={3}>
                      <LibrarySelector libraries={this.state.libraries}
                                       onSelect={this.librarySelected}
                                       hideItems={this.hideItems} />
                  </Col>
              </Row>
              {itemsWrapper}
              {loadingItems}
          </Grid>)
    }
});

module.exports = ItemAuthoring;
