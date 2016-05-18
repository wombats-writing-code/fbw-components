// ItemControls.js

'use strict';

var React = require('react');

var DeleteItem = require('./DeleteItem');
var EditItem = require('./edit-item/EditItem');
var TransferItem = require('./transfer-item/TransferItem');

var ItemControls = React.createClass({
    getInitialState: function () {
        return {
        }
    },
    componentWillMount: function() {
    },
    componentDidMount: function () {

    },
    render: function () {
        return <div>
            <TransferItem item={this.props.item}
                          libraries={this.props.libraries}
                          libraryId={this.props.libraryId} />
            <EditItem item={this.props.item}
                      libraryId={this.props.libraryId} />
            <DeleteItem item={this.props.item}
                        libraryId={this.props.libraryId} />
        </div>
    }
});

module.exports = ItemControls;