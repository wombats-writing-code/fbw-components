// ItemControls.js

'use strict';

var React = require('react');

var CopyItem = require('./CopyItem');
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
      <CopyItem item={this.props.item}
                libraryId={this.props.libraryId} />
      <TransferItem item={this.props.item}
                    libraries={this.props.libraries}
                    libraryId={this.props.libraryId} />
      <EditItem item={this.props.item}
                libraryId={this.props.libraryId}
                triggerStateChange={this.props.triggerStateChange} />
      <DeleteItem item={this.props.item}
                  libraryId={this.props.libraryId} />
    </div>
  }
});

module.exports = ItemControls;