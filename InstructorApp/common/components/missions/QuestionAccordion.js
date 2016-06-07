// QuestionAccordion.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  Dimensions,
  ListView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  } from 'react-native';

import Accordion from 'react-native-collapsible/Accordion';

var _ = require('lodash');

var AssessmentConstants = require('../../constants/Assessment');

var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentStore = require('../../stores/Assessment');
var AssessmentItemStore = require('../../stores/AssessmentItem');
var DateConvert = require('../../../utilities/dateUtil/ConvertDateToDictionary');
var Dispatcher = require('../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;

var styles = StyleSheet.create({
});


class QuestionAccordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  componentWillUnmount() {
  }
  componentDidMount() {
  }
  componentDidUpdate() {
    // issue with styling DatePickerIOS:
    // https://github.com/facebook/react-native/issues/1587
//    if (this.refs.startDateDatepicker && this.refs.deadlineDatePicker) {
//      this.refs.startDateDatepicker.refs.datepicker.setNativeProps({width: Window.width - 500});
//      this.refs.deadlineDatePicker.refs.datepicker.setNativeProps({width: Window.width - 100});
//    }
  }
  onLayout = (event) => {
    // TODO: how to make this height change when device is rotated?
    // This doesn't get called -- why not??? Docs say it should, on mount and on layout change...
    console.log('onLayout called');
    this.setState({ height: Dimensions.get('window').height });
  }
  renderAccordionHeader = (section) => {
    return (
      <View style={styles.moduleNameWrapper}>
        <Text style={styles.moduleDisplayName}>
          {section.displayName}
        </Text>
        <Text style={styles.itemCounter}>
          {section.items.length}
        </Text>
      </View>
      );
  }
  renderAccordionContent = (section) => {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    if (section.items.length > 0) {
      return (
        <ListView
        dataSource={ds.cloneWithRows(section.items)}
        renderRow={this.renderItemRow}>
        </ListView>
        );
    } else {
      return <View />;
    }
  }
  renderItemRow = (rowData, sectionId, rowId) => {
    return (
      <View style={styles.itemRow}>
        <Text>
          {rowData.displayName.text}
        </Text>
      </View>
      );
  }
  render() {
    var itemsArray = this._formatSections();
    return (
      <Accordion renderContent={this.renderAccordionContent}
                 renderHeader={this.renderAccordionHeader}
                 sections={itemsArray} />
    );
  }
  _formatSections() {
    return _.map(this.props.items, function (moduleData, moduleId) {
      return moduleData;
    });
  }
}

module.exports = QuestionAccordion;
