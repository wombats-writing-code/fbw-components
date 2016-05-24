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
  missionsList: {
  },
  missionsListWrapper: {
    backgroundColor: 'white',
    flex: 1,
    margin: 2,
    padding: 1
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
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
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
  renderRow(rowData, sectionId, rowId) {
    return (
      <TouchableHighlight onPress={() => this._setMission(rowData)}>
        <View>
          <View style={[styles.rowWrapper, styles.rounded]}>
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
    console.log("adding a new mission");
    this.props.changeContent('addMission');
  }
  _setMission(mission) {
    console.log("Let's show mission: " + mission.id);
    this.props.setMission(mission);
  }
}

module.exports = MissionsSidebar;