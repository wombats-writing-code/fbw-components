// ItemStatus.js

'use strict';
require('./ItemStatus.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Glyphicon = ReactBS.Glyphicon;
var Label = ReactBS.Label;

var AuthoringConstants = require('../../constants/AuthoringConstants');
var GenusTypes = require('../../constants/AuthoringConstants').GenusTypes;
var LibraryItemsStore = require('../../stores/LibraryItemsStore');

var ItemStatus = React.createClass({
    getInitialState: function () {
        return {
        }
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {

    },
    render: function () {
        // How to figure out how many are uncurated?
        var libraryName = this.props.libraryDescription,
            numberItems = this.props.items.length,
            numberUncuratedItems = 0,
            uncuratedLabel;

        _.each(this.props.items, function (item) {
            var unlinkedAnswers = _.find(item.answers, function (answer) {
                return (answer.confusedLearningObjectiveIds.length === 0 &&
                        answer.genusTypeId === GenusTypes.WRONG_ANSWER);
            });
            if (item.question.learningObjectiveIds.length === 0 ||
                unlinkedAnswers != null) {
                numberUncuratedItems++;
            }
        });

        if (numberUncuratedItems === 0) {
            uncuratedLabel = <Label bsStyle="success">{numberUncuratedItems}</Label>
        } else {
            uncuratedLabel = <Label bsStyle="danger">{numberUncuratedItems}</Label>
        }

        return <div>
            <div>
                {libraryName}: {numberItems} questions
            </div>
            <div>
                Number of uncurated questions: {uncuratedLabel}
                <Glyphicon className="uncurated-help-icon"
                           glyph="question-sign"
                           title="Questions not tagged with learning outcomes (or have wrong answers not tagged)"/>
            </div>
        </div>
    }
});

module.exports = ItemStatus;