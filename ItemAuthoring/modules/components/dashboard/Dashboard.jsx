// Dashboard.jsx

var React = require('react');
var Select = require('react-select');
require('react-select/dist/react-select.css');

var _ = require('lodash');

var OutcomeTree = require('./OutcomeTree');

var Dashboard = React.createClass({

  getInitialState () {
     return {
       selectedOutcome: null,
       selectedModule: null
     };
  },

  componentDidMount() {
  },

  render() {
    let entities = this.props.outcomes ? this.props.outcomes.concat(this.props.modules) : null;
    let outcomes = _.map(this.props.outcomes, (item) => {
      return _.assign({}, item, {
        value: item.id,
        label: item.displayName.text
      })
    });
    let modules = _.map(this.props.modules, (item) => {
        return _.assign({}, item, {
          value: item.id,
          label: item.displayName.text
        })
    });

    return (
      <div className="">

        <div className="row">
          <div className="medium-6 columns">
            <p>Select a learning outcome to visualize it.</p>
            <p>(root node is selected outcome).</p>
            <Select label="Outcomes"
                name="select-outcome"
                value={null}
                options={outcomes}
                onChange={this.onSelectOutcome}
            />
          </div>
          <div className="medium-6 columns">
            <p>or select a module to visualize its outcomes</p>
            <p>(node rank is global).</p>
            <Select label="Modules"
                name="select-module"
                value={null}
                options={modules}
                onChange={this.onSelectModule}
                valueRenderer={(item) => item.displayName.text}
            />
          </div>
        </div>

        <OutcomeTree selectedOutcome={this.state.selectedOutcome}
                     selectedModule={this.state.selectedModule}
                     entities={entities}
                     relationships={this.props.relationships}
                     assessmentItems={this.props.items}
        />
      </div>
    )
  },

  onSelectOutcome(outcome) {
    // console.log(outcome);

    this.setState({
      selectedOutcome: outcome,
      selectedModule: null,
    })
  },

  onSelectModule(module) {
    // console.log(module);

    this.setState({
      selectedOutcome: null,
      selectedModule: module,
    })
  }

});

module.exports = Dashboard;
