// AssignableBanks.jsx
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Button = ReactBS.Button;
var Checkbox = ReactBS.Checkbox;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../dispatcher/LibraryItemsDispatcher');
var LibraryItemsStore = require('../stores/LibraryItemsStore');
var MiddlewareService = require('../services/middleware.service.js');

var AssignableBanks = React.createClass({
    getInitialState: function () {
        var state = {
            showAlert: false
        },
            _this = this;

        _.each(this.props.libraries, function (library, index) {
            if (_this.props.item.assignedBankIds.indexOf(library.id) >= 0) {
                state['assignedBankId' + index] = true;
            } else {
                state['assignedBankId' + index] = false;
            }
        });

        return state;
    },
    componentWillMount: function () {
    },
    componentDidUpdate: function () {
    },
    close: function () {
        this.props.close();
    },
    closeAndReset: function () {
        this.reset();
        this.close();
    },
    onChange: function(e) {
        var checked = e.currentTarget.checked,
            index = 'assignedBankId' + e.currentTarget.id,
            state = {};

        state[index] = checked;
        this.setState(state);
    },
    renderBanks: function () {
        var _this = this;
        return _.map(this.props.libraries, function (library, index) {
            var valueState = 'assignedBankId' + index;
            if (_this.state[valueState]) {
                return <Checkbox checked
                                 id={index}
                                 key={library.id}
                                 onChange={_this.onChange}
                                 value={_this.state[valueState]}>
                    {library.displayName.text}
                </Checkbox>
            } else {
                return <Checkbox id={index}
                                 key={library.id}
                                 onChange={_this.onChange}
                                 value={_this.state[valueState]}>
                    {library.displayName.text}
                </Checkbox>
            }
        });
    },
    reset: function() {
        var state = {
            showAlert: false
        },
            _this = this;

        _.each(this.props.libraries, function (library, index) {
            if (_this.props.item.assignedBankIds.indexOf(library.id) >= 0) {
                state['assignedBankId' + index] = true;
            } else {
                state['assignedBankId' + index] = false;
            }
        });
        this.setState(state);
    },
    save: function (e) {
        var payload = {
            itemId: this.props.item.id,
            libraryId: this.props.libraryId
        },
            _this = this,
            assignedBankIds = this.props.item.assignedBankIds,
            bankFields = [];

        _.each(this.props.libraries, function (library, index) {
            var valueState = 'assignedBankId' + index;
            if (_this.state[valueState]) {
                bankFields.push(library.id);
            }
        });

        if (bankFields.length === 0) {
            this.setState({ showAlert: true });
        } else {
            _.each(this.props.libraries, function (library, index) {
                var valueState = 'assignedBankId' + index;

                if (_this.state[valueState] &&
                    assignedBankIds.indexOf(library.id) < 0) {
                    assignedBankIds.push(library.id);
                } else if (!_this.state[valueState] &&
                    assignedBankIds.indexOf(library.id) >= 0) {
                    assignedBankIds.splice(assignedBankIds.indexOf(library.id), 1);
                }
            });
            payload['assignedBankIds'] = assignedBankIds;

            Dispatcher.dispatch({
                type: ActionTypes.UPDATE_ITEM,
                content: payload
            });
            this.closeAndReset();
            setTimeout(_this.reset, 500);
        }
    },
    render: function () {
        var alert = '';

        if (this.state.showAlert) {
            alert = <Alert bsStyle="danger">
                You must keep the question in at least one domain, otherwise you will
                lose access to it forever.
            </Alert>
        }

        return <Modal bsSize="lg"
                      show={this.props.showModal}
                      onHide={this.closeAndReset}>
            <Modal.Header closeButton>
                <Modal.Title>Assign to Domains</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {alert}
                <form>
                    <FormGroup>
                        {this.renderBanks()}
                    </FormGroup>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.closeAndReset}>Cancel</Button>
                <Button bsStyle="success" onClick={this.save}>Save</Button>
            </Modal.Footer>
        </Modal>
    }
});

module.exports = AssignableBanks;