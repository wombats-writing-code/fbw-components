// AnswerFeedback.jsx
'use strict';

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var WrapHTML = require('../utilities/WrapHTML');

var AnswerFeedback = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    close: function () {
        this.setState({showModal: false});
    },
    open: function (e) {
        this.setState({showModal: true}, function () {

        });
    },
    render: function () {
        var feedbackText = WrapHTML(this.props.feedback);
        return <div>
            <Button onClick={this.open}
                    title="View Feedback">
                Feedback
            </Button>
            <Modal bsSize="lg" show={this.state.showModal}
                   onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Feedback for: {this.props.feedbackSource}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe ref="myFrame"
                            srcDoc={feedbackText}
                            frameBorder={0}
                            width="100%"
                            sandbox="allow-same-origin"
                            ></iframe>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
});

module.exports = AnswerFeedback;