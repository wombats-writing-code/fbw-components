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
        return <div className="outcome-text">
            <div className="outcome-display-name">
                {this.props.outcomeDisplayName}
            </div>
            <LORelatedItemsBadge outcomeId={this.props.outcomeId}
                                 libraryId={this.props.libraryId}
                                 relatedItems={this.props.relatedItems} />
            <LinkLO answerId={this.props.answerId}
                    component={this.props.component}
                    itemId={this.props.itemId}
                    libraryId={this.props.libraryId}
                    outcomeId={this.state.outcomeId}
                    outcomes={this.props.outcomes} />
        </div>;
    }
});

module.exports = LOText;