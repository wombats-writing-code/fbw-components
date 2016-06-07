// MissionsSidebar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ListView,
  ScrollView,
  SwipeableListView,  // TODO: How to get this from RN 0.27?
  Text,
  TouchableHighlight,
  View
  } from 'react-native';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

var AssessmentConstants = require('../../constants/Assessment');
var GenusTypes = AssessmentConstants.GenusTypes;
var MissionStatus = require('../../../utilities/dateUtil/CheckMissionStatus');

var styles = require('./MissionsSidebar.styles')

class MissionsSidebar extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      selectedId: '',
      sortedMissions: _.sortBy(this.props.missions, 'displayName.text') // this should be passed in already sorted by date
    }
  }
  componentWillUnmount() {
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ sortedMissions: _.sortBy(nextProps.missions, 'displayName.text') });
  }

  // if we want 'this' to refer to this class, we need to fat arrow renderRow(),
  // because we're calling it from ListView down below
  // alternatively, we can bind it below by this.renderRow.bind(this) in ListView.
  renderRow = (rowData, sectionId, rowId) => {
    // change icon that appears depending on now time vs. item deadline + startTime
    var icon = '',
      progressIcon = '',
      missionStatus = MissionStatus(rowData),
      rowStyles = [styles.missionWrapper],
      swipeButtons = [{
        text: 'Edit',
        backgroundColor: 'green',
        onPress: () => {this._editMission(rowData)}
      }, {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => {this._deleteMission(rowData)}
      }];

    if (rowData.id == this.state.selectedId) {
      rowStyles.push(styles.missionWrapperSelected);
    }

    if (missionStatus == 'over') {
      progressIcon = <Icon name="check"
                           style={[styles.missionRightIcon, styles.progressIcon]} />;
    } else if (missionStatus == 'pending') {
      progressIcon = <Icon name="clock-o"
                           style={[styles.missionRightIcon, styles.progressIcon]} />;
    } else {
      progressIcon = <View />;
    }

    if (rowData.genusTypeId == GenusTypes.IN_CLASS) {
      icon = <Icon name="university" style={styles.missionTypeIcon}/>;
    } else {
      icon = <Icon name="calendar" style={styles.missionTypeIcon}/>;
    }

    return ( // TODO: Change this onPress call depending on what is swiped / touched
        <TouchableHighlight onPress={() => this._editMission(rowData)}
                            style={rowStyles}>
                            
          <View style={styles.missionRow}>
            {icon}
            <View style={styles.missionInformation}>
                <Text
                    style={styles.missionTitle}
                    numberOfLines={2}
                >
                  {(rowData.displayName.text || '').toUpperCase()}
                </Text>
              <View>
                <Text style={styles.missionSubtitle}>
                  Start {rowData.startTime.month}-{rowData.startTime.day}-{rowData.startTime.year}
                </Text>
              </View>
              <View>
                <Text style={styles.missionSubtitle}>
                  Due {rowData.deadline.month}-{rowData.deadline.day}-{rowData.deadline.year}
                </Text>
              </View>
            </View>
            <View style={styles.missionRightIconWrapper}>
              {progressIcon}
            </View>
            <View style={styles.missionRightIconWrapper}>
              <Icon name="angle-right"
                    style={styles.missionRightIcon} />
            </View>
          </View>
        </TouchableHighlight>);
  }
  render() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      toggleIcon = <View />,
      currentMissions = this.props.missions.length > 0 ?
                  ( <ListView
                        dataSource={ds.cloneWithRows(this.state.sortedMissions)}
                        renderRow={this.renderRow}>
                    </ListView> ) :
                  ( <View style={[styles.notification, styles.rounded]} >
                    <Text style={styles.notificationText}>
                      No existing missions.
                    </Text>
                  </View> );

    if (this.props.sidebarOpen) {
      toggleIcon = <Icon name="caret-left"
                         style={styles.toggleCaret} />;
    }
    return (
      <View style={styles.container}>
        <View style={styles.sidebarHeader}>
          <TouchableHighlight onPress={() => this._addNewMission()}
                              style={styles.addMissionWrapper}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.toggleSidebar()}
                              style={styles.toggleWrapper}>
            <View>
              {toggleIcon}
            </View>
          </TouchableHighlight>
        </View>

        <View style={[styles.missionsListWrapper, styles.rounded]}>
          <ScrollView style={styles.missionsList}>
            {currentMissions}
          </ScrollView>
        </View>
        <View style={styles.sidebarFooter} />
      </View>
    );
  }
  _addNewMission() {
    this.props.changeContent('addMission');
    this.setState({ selectedId: '' });
  }
  _deleteMission = (mission) => {
    this.props.selectMission(mission, 'missionDelete');
    this.setState({ selectedId: mission.id });
  }
  _editMission = (mission) => {
    this.props.selectMission(mission, 'missionEdit');
    this.setState({ selectedId: mission.id });
  }
  _setMission = (mission) => {
    this.props.selectMission(mission, 'missionStatus');
    this.setState({ selectedId: mission.id });
  }
}

module.exports = MissionsSidebar;
