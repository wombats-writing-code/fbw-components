// ItemWrapper.js
// should include item status, item search, and then items list

'use strict';
require('./ItemWrapper.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Badge = ReactBS.Badge;
var Col = ReactBS.Col;
var Row = ReactBS.Row;

var ModulesStore = require('../../stores/ModulesStore');
var OutcomesStore = require('../../stores/OutcomesStore');
var RelationshipsStore = require('../../stores/RelationshipsStore');

var AddItem = require('../add-item/AddItem');
var ItemSearch = require('../item-search/ItemSearch');
var ItemStatus = require('../item-status/ItemStatus');
var ViewDashboard = require('../view-dashboard/ViewDashboard');

var ItemWrapper = React.createClass({
    getInitialState: function () {
        return {
          modules: [],
          outcomes: [],
          relationships: []
        }
    },
    componentWillMount: function() {
      var _this = this;
        ModulesStore.addChangeListener(function(modules) {
            _this.setState({ modules: modules });
        });
        OutcomesStore.addChangeListener(function(outcomes) {
            _this.setState({ outcomes: outcomes });
        });
        RelationshipsStore.addChangeListener(function(relationships) {
            _this.setState({ relationships: relationships });
        });
    },
    componentDidMount: function () {
        // get list of modules to filter by
        ModulesStore.getAll(this.props.libraryId);
        OutcomesStore.getAll(this.props.libraryId);
        RelationshipsStore.getAll(this.props.libraryId);
    },
    componentWillReceiveProps: function (nextProps) {
      if (nextProps.libraryId !== this.props.libraryId) {
        ModulesStore.getAll(nextProps.libraryId);
        OutcomesStore.getAll(nextProps.libraryId);
        RelationshipsStore.getAll(nextProps.libraryId);
      }
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
                <Col sm={4} md={2} lg={2}>
                    <ViewDashboard items={this.props.items}
                                   modules={this.state.modules}
                                   outcomes={this.state.outcomes}
                                   relationships={this.state.relationships} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ItemSearch items={this.props.items}
                                libraries={this.props.libraries}
                                libraryId={this.props.libraryId}
                                modules={this.state.modules}
                                outcomes={this.state.outcomes}
                                refreshModulesAndOutcomes={this._refreshModulesAndOutcomes} />
                </Col>
            </Row>
        </div>
    },
    _refreshModulesAndOutcomes: function () {
        ModulesStore.getAll(this.props.libraryId);
        OutcomesStore.getAll(this.props.libraryId);
        RelationshipsStore.getAll(this.props.libraryId);
    }
});

module.exports = ItemWrapper;
