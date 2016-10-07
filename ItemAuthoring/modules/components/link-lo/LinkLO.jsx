// LinkLO.js

'use strict';
require('../../../stylesheets/vendor/reactSelectOverride.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Select = require('react-select');

var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');

var LinkLO = React.createClass({
    getInitialState: function () {
        var outcomeId = this.props.outcomeId === 'None linked yet' ? '' : this.props.outcomeId;
        return {
            outcomeId: outcomeId,
            showModal: false
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {
    },
    close: function () {
        this.setState({showModal: false});
        this.reset();
    },
    onChange: function (e) {
        if (e == null) {
            this.setState({ outcomeId: '' });
        } else {
            this.setState({ outcomeId: e.value });
        }
    },
    open: function (e) {
        this.props.refreshModulesAndOutcomes();
        this.setState({showModal: true}, function () {

        });
    },
    renderOutcomes: function () {
        return _.map(this.props.outcomes, function (outcome) {
            return <option value={outcome.id}
                           title={outcome.description.text}
                           key={outcome.id}>
                {outcome.displayName.text}
            </option>;
        });
    },
    reset: function () {

    },
    save: function (e) {
        this.close();
        if (this.props.component == 'answer') {
            var payload = {
              answerId: this.props.answerId,
              confusedLearningObjectiveId: this.state.outcomeId,
              itemId: this.props.itemId,
              libraryId: this.props.libraryId,
              callback: this.props.triggerStateChange
            };
            Dispatcher.dispatch({
                type: ActionTypes.LINK_ANSWER_LO,
                content: payload
            });
        } else {
            // question
            var payload = {
              learningObjectiveId: this.state.outcomeId,
              itemId: this.props.itemId,
              libraryId: this.props.libraryId,
              callback: this.props.triggerStateChange
            };

            Dispatcher.dispatch({
                type: ActionTypes.LINK_ITEM_LO,
                content: payload
            });
        }
    },
    render: function () {
        var formattedOutcomes = _.map(this.props.outcomes, function (outcome) {
            return {
                value: outcome.id,
                label: outcome.displayName.text
            };
        });

        return <div>
            <Button onClick={this.open}
                    title="Link to an Outcome">
                <Glyphicon glyph="link" />
            </Button>
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Link to Outcome</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup controlId="outcomeSelector">
                            <ControlLabel>Select a learning outcome ...</ControlLabel>
                            <Select name="confusedOutcomeSelector"
                                    placeholder="Select an outcome ... "
                                    value={this.state.outcomeId}
                                    onChange={this.onChange}
                                    options={formattedOutcomes}>
                            </Select>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                    <Button bsStyle="success" onClick={this.save}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>;
    }
});

module.exports = LinkLO;