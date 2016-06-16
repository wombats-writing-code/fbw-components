// TransferItem.jsx
'use strict';


var React = require('react');
var ReactBS = require('react-bootstrap');
var Button = ReactBS.Button;
var Glyphicon = ReactBS.Glyphicon;

var AssignableBanks = require('../AssignableBanks');

var TransferItem = React.createClass({
    getInitialState: function () {
        return {
            showModal: false
        };
    },
    componentWillMount: function () {

    },
    componentDidUpdate: function () {

    },
    close: function () {
        this.setState({ showModal: false });
    },
    open: function (e) {
      e.stopPropagation();
      this.setState({ showModal: true});
    },
    render: function () {
        return <div>
            <Button onClick={this.open}
                    bsSize="large"
                    title="Transfer Item">
                <Glyphicon glyph="transfer" />
            </Button>
            <AssignableBanks close={this.close}
                             item={this.props.item}
                             libraries={this.props.libraries}
                             libraryId={this.props.libraryId}
                             showModal={this.state.showModal} />
        </div>
    }
});

module.exports = TransferItem;