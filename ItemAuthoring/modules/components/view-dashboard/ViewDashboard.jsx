// ViewDashboard.jsx
'use strict';


var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Button = ReactBS.Button;
var ControlLabel = ReactBS.ControlLabel;
var FormControl = ReactBS.FormControl;
var FormGroup = ReactBS.FormGroup;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var _ = require('lodash');

var Dashboard = require('../dashboard/Dashboard');


var ViewDashboard = React.createClass({
    getInitialState: function () {
        return {
            showModal: false,
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {
    },
    closeModal: function () {
        this.setState({ showModal: false });
    },
    openModal: function () {
        this.setState({ showModal: true });
    },
    render: function () {
      return <div>
            <Button onClick={this.openModal}>
                View Outcome Dashboard
            </Button>
            <Modal bsSize="lg"
                   show={this.state.showModal}
                   onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Outcomes Dashboard</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Dashboard items={this.props.items}
                               outcomes={this.props.outcomes}
                               modules={this.props.modules}
                               relationships={this.props.relationships}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
});

module.exports = ViewDashboard;