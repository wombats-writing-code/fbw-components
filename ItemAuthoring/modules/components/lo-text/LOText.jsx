// LOText.js

'use strict';
require('./LOText.css');

var React = require('react');

var LinkLO = require('../link-lo/LinkLO');
var LORelatedItemsBadge = require('../lo-related-items-badge/LORelatedItemsBadge');


var LOText = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {
    },
    render: function () {
        var loControls = '';

        if (this.props.enableClickthrough) {
            loControls = <div className="outcome-controls">
                <LORelatedItemsBadge libraryId={this.props.libraryId}
                                     outcomeId={this.props.outcomeId}
                                     relatedItems={this.props.relatedItems} />
                <LinkLO answerId={this.props.answerId}
                        component={this.props.component}
                        itemId={this.props.itemId}
                        libraryId={this.props.libraryId}
                        outcomeId={this.props.outcomeId}
                        outcomes={this.props.outcomes}
                        refreshModulesAndOutcomes={this.props.refreshModulesAndOutcomes} />
            </div>
        }

        return <div className="outcome-text">
          <div className="outcome-text-wrapper">
            <div className="outcome-display-name">
                {this.props.outcomeDisplayName}
            </div>
            <div className="outcome-description">
              {this.props.outcomeDescription}
            </div>
          </div>
            {loControls}
        </div>;
    }
});

module.exports = LOText;