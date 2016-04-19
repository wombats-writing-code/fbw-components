// AnswerText.js

'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormControl = ReactBS.FormControl;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');

var LibraryItemsStore = require('../stores/LibraryItemsStore');
var OutcomesStore = require('../stores/OutcomesStore');

var AnswerText = React.createClass({
    getInitialState: function () {
        return {
            outcomes: [],
            showModal: false
        };
    },
    componentWillMount: function() {
        var _this = this;
        OutcomesStore.addChangeListener(function(outcomes) {
            _this.setState({ outcomes: outcomes });
        });
    },
    componentDidMount: function () {
        OutcomesStore.getAll();
    },
    close: function () {
        this.setState({showModal: false});
        this.reset();
    },
    open: function (e) {
        this.setState({showModal: true}, function () {

        });
    },
    renderOutcomes: function () {
        return _.map(this.state.outcomes, function (outcome) {
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

    },
    render: function () {
        return <div className="taggableText">
            <span className="textBlob">
                {this.props.answerText}
            </span>
            <span className="pullRight">
                <Button onClick={this.open}>
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
                                <FormControl componentClass="select"
                                             placeholder="Select a learning outcome ... ">
                                    {this.renderOutcomes()}
                                </FormControl>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                        <Button bsStyle="success" onClick={this.save}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </span>
        </div>

    }
});

module.exports = AnswerText;