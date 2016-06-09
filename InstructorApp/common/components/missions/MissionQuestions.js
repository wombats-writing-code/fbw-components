// MissionQuestions.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicatorIOS,
  Animated,
  DatePickerIOS,
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

var _ = require('lodash');

var AssessmentConstants = require('../../constants/Assessment');

var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentStore = require('../../stores/Assessment');
var AssessmentItemStore = require('../../stores/AssessmentItem');
var DateConvert = require('../../../utilities/dateUtil/ConvertDateToDictionary');
var Dispatcher = require('../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;

var styles = StyleSheet.create({
  header: {
    margin: 5
  },
  headerText: {
    color: 'gray',
    fontSize: 10,
    textAlign: 'center'
  },
  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 10,
    padding: 5
  }
});


class MissionQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
      height: 0,
      items: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      opacity: new Animated.Value(0)
    };

    AssessmentItemStore.addChangeListener(this._updateItemsFromStore);
  }
  componentWillUnmount() {
    Animated.timing(this.state.opacity, {
      toValue: 0
    }).start();
    AssessmentItemStore.removeChangeListener(this._updateItemsFromStore);
  }
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1
    }).start();

    this.setState({ height: Dimensions.get('window').height });
    AssessmentItemStore.getItems(this.props.bankId, this.props.mission.id);
  }
  componentDidUpdate() {
    // issue with styling DatePickerIOS:
    // https://github.com/facebook/react-native/issues/1587
//    if (this.refs.startDateDatepicker && this.refs.deadlineDatePicker) {
//      this.refs.startDateDatepicker.refs.datepicker.setNativeProps({width: Window.width - 500});
//      this.refs.deadlineDatePicker.refs.datepicker.setNativeProps({width: Window.width - 100});
//    }
  }
  createAssessment() {
    var data = {
      bankId: this.props.bankId,
      deadline: DateConvert(this.state.missionDeadline),
      description: 'A Fly-by-Wire mission',
      displayName: this.state.missionDisplayName,
      startTime: DateConvert(this.state.missionStartDate)
    };

    if (this.state.inClass) {
      data.genusTypeId = GenusTypes.IN_CLASS;
    } else {
      data.genusTypeId = GenusTypes.HOMEWORK;
    }

    Dispatcher.dispatch({
        type: ActionTypes.CREATE_ASSESSMENT,
        content: data
    });

    this.props.closeAdd();
  }
  onLayout = (event) => {
    // TODO: how to make this height change when device is rotated?
    // This doesn't get called -- why not??? Docs say it should, on mount and on layout change...
    console.log('onLayout called');
    this.setState({ height: Dimensions.get('window').height });
  }
  renderItemRow = (rowData, sectionId, rowId) => {

  }
  setItems(items) {
    this.setState({ items: items });
  }
  render() {
    var currentItems = this.state.items.length > 0 ?
                       ( <ListView dataSource={this.state.items}
                                   renderRow={this.renderItemRow}>
                         </ListView> ) :
                       ( <View style={styles.notification}>
                           <Text style={[styles.notificationText]}>No questions</Text>
                         </View> );
    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <TouchableHighlight onPress={() => this.props.toggleQuestionDrawer()}
                              style={styles.header}>
            <Text style={styles.headerText}>
              Tap here to toggle the "Add Question" drawer.
            </Text>
          </TouchableHighlight>
          <ScrollView onScroll={(event) => {console.log('scroll!')}}
                      style={ {height: this.state.height - 50 } }>
            {currentItems}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
  _updateItemsFromStore = (items) => {
    this.setItems(_.sortBy(items,
      ['startTime.year', 'startTime.month', 'startTime.day',
       'deadline.year', 'deadline.month', 'deadline.day',
       'displayName.text']));
  }
}

module.exports = MissionQuestions;
