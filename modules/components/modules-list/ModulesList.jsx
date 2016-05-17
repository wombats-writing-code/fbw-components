// ModulesList.js

'use strict';

require('./ModulesList.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Badge = ReactBS.Badge;
var Col = ReactBS.Col;
var Grid = ReactBS.Grid;
var Panel = ReactBS.Panel;
var Row = ReactBS.Row;

var ItemsList = require('../items-list/ItemsList');
var LibraryItemsStore = require('../../stores/LibraryItemsStore');
var LORelatedItems = require('../../utilities/LORelatedItems');
var ModulesStore = require('../../stores/ModulesStore');
var OutcomesStore = require('../../stores/OutcomesStore');
var SortItemsByModuleOutcomes = require('../../utilities/SortItemsByModuleOutcomes');


var ModulesList = React.createClass({
    getInitialState: function () {
        return {
            moduleExpandedState: {},
            modules: [],
            outcomes: [],
            sortedItemsByModule: {},  // moduleId => [itemsList]
            sortedItemsByOutcome: {}  // loId => [itemsList]
        };
    },
    componentWillMount: function() {
        var _this = this;
        ModulesStore.addChangeListener(function(modules) {
            _this.setState({ modules: modules });
            _this.sortItemsByModule(_this.props.items);
            _this.initializeModulesAsClosed();
        });
        OutcomesStore.addChangeListener(function(outcomes) {
            _this.setState({ outcomes: outcomes });
            _this.sortItemsByOutcome();
        });
        LibraryItemsStore.addChangeListener(function(items) {
            _this.sortItemsByModule(_this.props.items);
            _this.sortItemsByOutcome();
        });
    },
    componentDidMount: function () {
        ModulesStore.getAll(this.props.libraryId);
        OutcomesStore.getAll(this.props.libraryId);
    },
    componentWillReceiveProps: function (nextProps) {
        this.sortItemsByModule(nextProps.items);
        this.sortItemsByOutcome();
    },
    filterOutcomes: function (item) {
        // return outcomes that are not currently being used somewhere
        // in a specific item
        return _.filter(this.state.outcomes, function (outcome) {
            return item.usedLOs.indexOf(outcome.id) < 0;
        })
    },
    getModuleDisplayName: function (moduleId) {
        var module = ModulesStore.get(moduleId);
        if (module == null) {
            return "Uncategorized";
        } else {
            return module.displayName.text;
        }
    },
    initializeModulesAsClosed: function () {
        var moduleState = {};
        _.each(this.state.sortedItemsByModule, function (module) {
            moduleState[module.id] = false;
        });

        this.setState({ moduleExpandedState: moduleState });
    },
    moduleState: function (moduleId) {
        return this.state.moduleExpandedState[moduleId];
    },
    renderModules: function () {
        var _this = this,
        // map the choiceIds, etc., in answers back to choices in questions
            items = [],
            sortedModuleNames = [];

        _.each(this.state.modules, function (module) {
            sortedModuleNames.push({
                displayName: _this.getModuleDisplayName(module.id),
                id: module.id
            });
        });

        sortedModuleNames = _.sortBy(sortedModuleNames, ['displayName']);

        sortedModuleNames.push({
            displayName: "Uncategorized",
            id: 'uncategorized'
        });

        return _.map(sortedModuleNames, function (moduleData) {
            var moduleItems = _this.state.sortedItemsByModule[moduleData.id],
                numItems = 0,
                header;

            if (typeof moduleItems !== 'undefined') {
                numItems = moduleItems.length;
            }
            header = <div>
                {moduleData.displayName}
                <Badge pullRight>{numItems}</Badge>
            </div>;

            return <Row key={moduleData.id}>
                <Panel header={header}
                       collapsible
                       data-id={moduleData.id}
                       data-type="module"
                       expanded={_this.moduleState(moduleData.id)}
                       onClick={_this.toggleModuleState}>
                    <ItemsList enableClickthrough={true}
                               libraries={_this.props.libraries}
                               libraryId={_this.props.libraryId}
                               outcomes={_this.state.outcomes}
                               relatedItems={_this.state.sortedItemsByOutcome}
                               sortedItems={moduleItems} />
                </Panel>
            </Row>
        });
    },
    sortItemsByModule: function (itemsList) {
        // get a pre-sorted list of all items, organized by module
        this.setState({ sortedItemsByModule: SortItemsByModuleOutcomes(itemsList,
            this.state.modules) });
    },
    sortItemsByOutcome: function () {
        // get a pre-sorted list of all items, organized by learning outcome
        this.setState({ sortedItemsByOutcome: LORelatedItems(this.props.allItems,
            this.state.outcomes) });
    },
    toggleModuleState: function (e) {
        var clickedElement = e.target,
            targetClassName = clickedElement.className,
            updatedState = this.state.moduleExpandedState,
            moduleId = e.currentTarget.dataset.id,
            isModule = clickedElement.parentElement.parentElement.dataset.type === 'module';

        if (targetClassName.indexOf('panel-title') >= 0 && isModule) {
            updatedState[moduleId] = !updatedState[moduleId];

            this.setState({ moduleExpandedState: updatedState });
        }
    },
    render: function () {
        return <Grid>
            {this.renderModules()}
        </Grid>
    }
});

module.exports = ModulesList;
