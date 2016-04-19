var React = require('react');
var ReactBS = require('react-bootstrap');
var Modal = ReactBS.Modal;
var Button = ReactBS.Button;
var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var dispatcher = require('../dispatcher/TSLAuthorDispatcher');

var EditObjectiveBtn = React.createClass({
    getInitialState: function () {
        var me = this.props.objective;
        return {
            description: me.description.text,
            displayName: me.displayName.text,
            genusTypeId: me.genusTypeId,
            genusTypeName: '',
            showModal: false
        };
    },
    close: function () {
        this.setState({showModal: false});
        this.reset();
    },
    onChange: function(e) {
        if (e.currentTarget.name === "displayName") {
            this.setState({ displayName: e.target.value });
        } else if (e.currentTarget.name === "genusTypeId") {
            this.setState({ genusTypeId: e.target.value });
        } else {
            this.setState({ description: e.target.value});
        }
    },
    open: function (e) {
        var _this = this,
        location = window.location.href,
            url;
        if (location.indexOf('localhost') >= 0 || location.indexOf('127.0.0.1') >= 0) {
            url = '/api/v1/learning/objectives/types';
        } else {
            url = '/tsl-author/api/v1/learning/objectives/types';
        }
        this.updateStateFromProps(function () {
            this.setState({showModal: true});
            this.setGenusTypeName(function () {
                $(_this.refs.genusSelector).select2({
                    placeholder: '[ Please select an objective type ]',
                    width: '100%',
                    ajax: {
                        url: url,
                        delay: 250,
                        processResults: function (data, params) {
                            var typesList = [];

                            _.each(data, function (datum) {
                                typesList.push({
                                    id: datum.id,
                                    text: datum.displayName.text
                                });
                            });
                            return {
                                results: typesList
                            }
                        },
                        cache: true
                    }
                }).on('change', function (e) {
                    _this.onChange(e);
                });
            });
        });
        e.stopPropagation();
    },
    reset: function () {
        this.updateStateFromProps(function () {});
        this.setGenusTypeName(function () {});
    },
    save: function (e) {
        dispatcher.dispatch({
            type: ActionTypes.UPDATE_OBJECTIVE,
            content: {
                description: this.state.description,
                displayName: this.state.displayName,
                genusTypeId: this.state.genusTypeId,
                id: this.props.objective.id
            }
        });
        this.close();
    },
    setGenusTypeName: function (callback) {
        var _this = this,
            location = window.location.href,
            url;
        if (location.indexOf('localhost') >= 0 || location.indexOf('127.0.0.1') >= 0) {
            url = '/api/v1/learning/objectives/types/';
        } else {
            url = '/tsl-author/api/v1/learning/objectives/types/';
        }
        $.get(url + this.state.genusTypeId).then(function (data) {
            _this.setState({genusTypeName: data.displayName.text});
            callback();
        });
    },
    updateStateFromProps: function (callback) {
        var me = this.props.objective;
        this.setState({
            description: me.description.text,
            displayName: me.displayName.text,
            genusTypeId: me.genusTypeId
        }, callback);
    },
    render: function () {
        return <span>
            <Button onClick={this.open}>
                <i className="fa fa-pencil fa-2x" aria-hidden="true"></i>
                <span className="sr-only">Edit</span>
            </Button>
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Objective</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <select className="form-control" ref="genusSelector" name="genusTypeId" defaultValue={this.props.objective.genusTypeId}>
                                <option></option>
                                <option value={this.props.objective.genusTypeId}>{this.state.genusTypeName}</option>
                            </select>
                            <input className="form-control" name="displayName" placeholder="Display name" type="text" value={this.state.displayName} onChange={this.onChange} />
                            <input className="form-control" name="description" placeholder="Description" type="text" value={this.state.description} onChange={this.onChange} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                    <Button bsStyle="success" onClick={this.save}>Save</Button>
                </Modal.Footer>
            </Modal>
        </span>
    }
});

module.exports = EditObjectiveBtn;