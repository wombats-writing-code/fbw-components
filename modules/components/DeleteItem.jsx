// DeleteItem.jsx
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;
var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var dispatcher = require('../dispatcher/LibraryItemsDispatcher');

var DeleteItem = React.createClass({
    getInitialState: function () {
        return {
            showModal: false
        };
    },
    close: function () {
        this.setState({showModal: false});
    },
    open: function (e) {
        this.setState({showModal: true}, function () {

        });
    },
    save: function (e) {
        dispatcher.dispatch({
            type: ActionTypes.DELETE_ITEM,
            content: {
                itemId: this.props.item.id,
                libraryId: this.props.libraryId
            }
        });
        this.close();
    },
    render: function () {
        return <span>
            <Button onClick={this.open}
                    bsSize="large">
                <Glyphicon glyph="trash" />
            </Button>
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <span className="red">Are you sure you want to delete {this.props.item.displayName.text}?</span>
                        <p>This action <strong>CANNOT</strong> be undone!</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="success" onClick={this.close}>Cancel</Button>
                    <Button bsStyle="danger" onClick={this.save}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </span>
    }
});

module.exports = DeleteItem;