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
var DateConvert = require('../../../utilities/dateUtil/ConvertDateToDictionary');
var Dispatcher = require('../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;
var QuestionCard = require('./QuestionCard');

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
      opacity: new Animated.Value(0)
    };
  }
  componentWillUnmount() {
    Animated.timing(this.state.opacity, {
      toValue: 0
    }).start();
  }
  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1
    }).start();
    this.setState({ height: Dimensions.get('window').height });
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
    return <View key={rowData.id}>
      <QuestionCard item={rowData} />
    </View>
  }
  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      currentItems = this.props.missionItems.length > 0 ?
                       ( <ListView dataSource={ds.cloneWithRows(this.props.missionItems)}
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
                      style={ {height: this.state.height - 100 } }>
            {currentItems}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

module.exports = MissionQuestions;
