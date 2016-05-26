// MissionsSidebar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Text,
  ListView,
  ScrollView,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');


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
  missionArrowIcon: {
    color: '#656565'
  },
  missionArrowIconWrapper: {
    justifyContent: 'center'
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
  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 10,
    padding: 5
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
    return (
      <TouchableHighlight onPress={() => this._setMission(rowData)}
                          style={styles.missionWrapper}>
        <View style={styles.missionRow}>
          <View style={styles.missionIconWrapper}>
            <Icon name="calendar"/>
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
                Due on {rowData.deadline.month}-{rowData.deadline.day}-{rowData.deadline.year}
              </Text>
            </View>
          </View>
          <View style={styles.missionArrowIconWrapper}>
            <Icon name="angle-right"
                  style={styles.missionArrowIcon} />
          </View>
        </View>
      </TouchableHighlight>
      );
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
  _setMission = (mission) => {
    this.props.selectMission(mission);
  }
}

module.exports = MissionsSidebar;
