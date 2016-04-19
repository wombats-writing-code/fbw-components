var React = require('react');
var ReactBS = require('react-bootstrap');
var Modal = ReactBS.Modal;
var Button = ReactBS.Button;
var ActionTypes = require('../constants/AuthoringConstants').ActionTypes;
var dispatcher = require('../dispatcher/TSLAuthorDispatcher');

var DeleteObjectiveBtn = React.createClass({
    getInitialState: function () {
        return {
            showModal: false
        };
    },
    close: function () {
        this.setState({showModal: false});
    },
    open: function (e) {
        var _this = this;
        this.setState({showModal: true}, function () {

        });
        e.stopPropagation();
    },
    save: function (e) {
        dispatcher.dispatch({
            type: ActionTypes.DELETE_OBJECTIVE,
            content: {
                id: this.props.objective.id
            }
        });
        this.close();
    },
    render: function () {
        return <span>
            <Button onClick={this.open}>
                <i className="fa fa-trash fa-2x" aria-hidden="true"></i>
                <span className="sr-only">Delete Objective</span>
            </Button>
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Objective</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <span className="red">Are you sure you want to delete {this.props.objective.displayName.text} and all its children?</span>
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

module.exports = DeleteObjectiveBtn;