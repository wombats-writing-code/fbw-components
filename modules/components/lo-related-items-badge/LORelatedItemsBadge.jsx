// LORelatedItemsBadge.jsx
'use strict';

require('./LORelatedItemsBadge.css');

var React = require('react');
var ReactBS = require('react-bootstrap');
var Alert = ReactBS.Alert;
var Badge = ReactBS.Badge;
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;
var Modal = ReactBS.Modal;

var ActionTypes = require('../../constants/AuthoringConstants').ActionTypes;
var Dispatcher = require('../../dispatcher/LibraryItemsDispatcher');
var LibraryItemsStore = require('../../stores/LibraryItemsStore');
var OutcomesStore = require('../../stores/OutcomesStore');


var LORelatedItemsBadge = React.createClass({
    getInitialState: function () {
        return {
        };
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {

    },
    close: function () {
        this.setState({ showModal: false });
    },
    open: function () {
        this.setState({ showModal: true });
    },
    render: function () {
        var ItemsList = require('../items-list/ItemsList');
        var items, lo;

        lo = OutcomesStore.get(this.props.confusedLO) == null ? '' : OutcomesStore.get(this.props.confusedLO).displayName.text;

        if (this.props.relatedItems.length > 0) {
            items = <ItemsList items={this.props.relatedItems}
                               libraryId={this.props.libraryId}
                               enableClickthrough={false} />
        } else {
            items = <Alert bsStyle="danger">No items with this LO</Alert>
        }
        return <div>
            <Button onClick={this.open}>
                <Badge>{this.props.relatedItems.length}</Badge>
                <Glyphicon glyph="tags" />
            </Button>
            <Modal bsSize="lg" show={this.state.showModal}
                   onHide={this.close}
                   dialogClassName="extra-wide-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Items related to: {lo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {items}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
});

module.exports = LORelatedItemsBadge;