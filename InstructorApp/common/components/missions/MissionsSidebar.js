// MissionsSidebar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ListView,
  ScrollView,
  StyleSheet,
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

var styles = StyleSheet.create({
  buttonText: {
    fontSize: 50,
    color: '#007AFF',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#D8D8D8',
    alignItems: 'stretch'
  },
  missionIconWrapper: {
    justifyContent: 'center',
    marginRight: 5
  },
  missionInformation: {
    flex: 1
  },
  missionLabel: {
    fontSize: 10,
    color: '#000000'
  },
  missionRightIcon: {
    color: '#656565'
  },
  missionRightIconWrapper: {
    justifyContent: 'center'
  },
  missionRow: {
    flex: 1,
    flexDirection: 'row'
  },
  missionsList: {
  },
  missionsListWrapper: {
    backgroundColor: 'white',
    flex: 1,
    margin: 2,
    padding: 1
  },
  missionSubtitle: {
    color: '#656565',
    fontSize: 8
  },
  missionWrapper: {
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
    margin: 1,
    padding: 5
  },
  missionWrapperSelected: {
    backgroundColor: '#709CCE'
  },
  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 10,
    padding: 5
  },
  progressIcon: {
    marginRight: 3
  },
  rounded: {
    borderRadius: 3
  },
  sidebarFooter: {
    height: 10
  },
  sidebarHeader: {
    height: 60
  }
});


class MissionsSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: ''
    }
  }
  componentWillUnmount() {
  }
  componentDidMount() {
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
      icon = <Icon name="university"/>;
    } else {
      icon = <Icon name="calendar"/>;
    }

    return ( // TODO: Change this onPress call depending on what is swiped / touched
        <TouchableHighlight onPress={() => this._editMission(rowData)}
                            style={rowStyles}>
          <View style={styles.missionRow}>
            <View style={styles.missionIconWrapper}>
              {icon}
            </View>
            <View style={styles.missionInformation}>
              <View style={[styles.rowWrapper, styles.rounded]}>
                <Text
                    style={styles.missionLabel}
                    numberOfLines={1}
                >
                  {rowData.displayName.text}
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
        </TouchableHighlight> );
  }
  render() {
    // probably want to move this to a get initial function so this doesn't run on every render
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      sortedMissions = _.sortBy(this.props.missions, 'displayName');  // TODO: this should be by startDate on the Offered...

    var currentMissions = this.props.missions.length > 0 ?
                  ( <ListView
                        dataSource={ds.cloneWithRows(sortedMissions)}
                        renderRow={this.renderRow}>
                    </ListView> ) :
                  ( <View style={[styles.notification, styles.rounded]} >
                    <Text style={styles.notificationText}>
                      No existing missions.
                    </Text>
                  </View> );

    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.sidebarHeader}
                            onPress={() => this._addNewMission()}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableHighlight>
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
