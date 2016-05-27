// MissionDetails.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
  DatePickerIOS,
  Dimensions,
  ListView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  } from 'react-native';

var AssessmentConstants = require('../../constants/Assessment');

var ActionTypes = AssessmentConstants.ActionTypes;
var AssessmentStore = require('../../stores/Assessment');
var AssessmentItemStore = require('../../stores/AssessmentItem');
var DateConvert = require('../../../utilities/dateUtil/ConvertDateToDictionary');
var Dispatcher = require('../../dispatchers/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;
var MissionStatus = require('../../../utilities/dateUtil/CheckMissionStatus');

var styles = StyleSheet.create({
  activeHeaderText: {
    color: '#2A47C9',
    textDecorationLine: 'underline'
  },
  container: {
    flex: 1
  },
  header: {
    flex: 1,
    flexDirection: 'row'
  },
  headerOption: {
    flex: 1,
    margin: 10
  },
  headerText: {
    color: '#ACAFBD',
    fontSize: 20
  },
  textRight: {
    textAlign: 'right'
  }
});


class MissionDetails extends Component {
  constructor(props) {
    super(props);
    var missionStatus = MissionStatus(this.props.mission);

    this.state = {
      items: [],
      loadingItems: true,
      missionStatus: missionStatus,
      opacity: new Animated.Value(0),
      selectedPane: 'items'
    };

    AssessmentItemStore.addChangeListener(this._updateItemsFromStore);
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
    var questionStyles, metadataStyles;

    if (this.state.selectedPane == 'items') {
      questionStyles = [styles.headerText, styles.activeHeaderText];
      metadataStyles = [styles.headerText, styles.textRight]
    } else {
      questionStyles = [styles.headerText]
      metadataStyles = [styles.headerText, styles.activeHeaderText, styles.textRight]
    }

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.setState({ selectedPane: 'items' })}
                                style={styles.headerOption}>
              <Text style={questionStyles}>
                Questions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ selectedPane: 'metadata' })}
                                style={styles.headerOption}>
              <Text style={metadataStyles}>
                Name & Dates
              </Text>
            </TouchableOpacity>
          </View>
          <View>

          </View>
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

module.exports = MissionDetails;