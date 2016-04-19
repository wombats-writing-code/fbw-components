// EditItem.jsx
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var dispatcher = require('../dispatcher/LibraryItemsDispatcher');

var EditItem = React.createClass({
    getInitialState: function () {
        var me = this.props.item;
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
        this.setState({showModal: true}, function () {

        });
    },
    reset: function () {
    },
    save: function (e) {
        dispatcher.dispatch({
            type: ActionTypes.UPDATE_ITEM,
            content: {
                description: this.state.description,
                displayName: this.state.displayName,
                genusTypeId: this.state.genusTypeId,
                id: this.props.item.id
            }
        });
        this.close();
    },
    render: function () {
        return <span>
            <Button onClick={this.open}
                    bsSize="large">
                <Glyphicon glyph="pencil" />
            </Button>
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <select className="form-control" ref="genusSelector" name="genusTypeId" defaultValue={this.props.item.genusTypeId}>
                                <option></option>
                                <option value={this.props.item.genusTypeId}>{this.state.genusTypeName}</option>
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

module.exports = EditItem;