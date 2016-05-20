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
  container: {
    flex: 1,
    backgroundColor: '#D8D8D8',
    alignItems: 'stretch'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  buttonText: {
    fontSize: 50,
    color: '#ffffff',
    alignSelf: 'center'
  },
  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 16
  },
  missionsList: {
  },
  missionsListWrapper: {
    backgroundColor: 'white',
    flex: 1,
    margin: 2,
    padding: 1
  },
  sidebarFooter: {
    height: 10
  },
  sidebarHeader: {
    height: 75
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
  _addNewMission() {
    console.log("adding a new mission");
  }
  getMissionDetails(mission) {
    console.log("Let's show mission: " + mission.id);
  }
  renderRow(rowData, sectionId, rowId) {
    return (
      <TouchableHighlight onPress={() => this.getMissionDetails(rowData)}>
        <View>
          <View style={styles.rowWrapper}>
            <Text
                style={styles.title}
                numberOfLines={1}
            >
              {rowData.displayName.text}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
      );
  }
  render() {
    var currentMissions = this.props.missions.length > 0 ?
                  ( <ListView
                        dataSource={this.prop.missions}
                        renderRow={this.renderRow}>
                    </ListView> ) :
                  ( <View style={styles.notification} >
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
        <View style={styles.missionsListWrapper}>
          <ScrollView style={styles.missionsList}>
            {currentMissions}
          </ScrollView>
        </View>
        <View style={styles.sidebarFooter} />
      </View>
    );
  }
}

module.exports = MissionsSidebar;