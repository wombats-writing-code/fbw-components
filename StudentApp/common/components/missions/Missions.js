// Missions.js
// * This should check and take care of the student
//   authorization in QBank for the FbW side of things.
// * This should also bring up the list of current missions
//   based on student enrollment.

'use strict';

import React, {
    Component,
}  from 'react';
import {
  ActivityIndicatorIOS,
  Dimensions,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import {
  Actions
} from "react-native-router-flux";

var AssessmentStore = require('../../stores/Assessment');
var AuthorizationStore = require('../../stores/Authorization');
var CheckMissionStatus = require('../../../utilities/dateUtil/CheckMissionStatus')

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#dddddd',
    flex: 1,
    justifyContent: 'center'
  },
  loadingText: {
    margin: 10,
    textAlign: 'center'
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
});

class Missions extends Component {
  constructor(props) {
    super (props);

    this.state = {
      loading: true,
      missions: []
    };

    AssessmentStore.addChangeListener(this.setMissions);
  }
  componentWillUnmount() {
    AssessmentStore.removeChangeListener(this.setMissions);
  }
  componentDidMount() {
    var _this = this;
    // Check Authz, if none exist, set them for the student
    AuthorizationStore.hasAuthorizations({
      schoolId: this.props.schoolId,
      username: this.props.username
    }, function (hasAuthz) {
      if (hasAuthz) {
        _this.getMissions();
      } else {
        AuthorizationStore.setAuthorizations({
          schoolId: _this.props.schoolId,
          username: _this.props.username
        }, function () {
          _this.getMissions();
        });
      }
    });
  }
  getMissions() {
    // TODO: will need to limit this list of Ids somehow based
    // on actual enrollment -- right now this points to all
    // Assessments in the school / ACC, because QBank
    // pulls from all child banks in the hierarchy...
    AssessmentStore.getAssessments([this.props.schoolId]);
  }
  renderRow = (rowData, sectionId, rowId) => {
    return <View>
      <Text>
        {rowData.displayName.text}
      </Text>
    </View>
  }
  setMissions = (missions) => {
    var _this = this,
      currentMissions = [];

    console.log('got ' + missions.length + ' missions!');

    // filter out missions that are not "open" or past-due
    _.each(missions, function (mission) {
      if (CheckMissionStatus(mission) == 'pending') {
        currentMissions.push(mission);
      }
    });

    console.log(currentMissions.length + ' are active');

    this.setState({ missions: currentMissions }, function () {
      _this.setState({ loading: false });
    });
  }
  render() {
    if (this.state.loading) {
      return this.renderLoadingScreen();
    }
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      currentMissions = this.state.missions.length > 0 ?
                ( <ListView
                      dataSource={ds.cloneWithRows(this.state.missions)}
                      renderRow={this.renderRow}>
                  </ListView> ) :
                ( <View style={[styles.notification, styles.rounded]} >
                  <Text style={styles.notificationText}>
                    No current missions.
                  </Text>
                </View> );

    return <View style={styles.container}>
      {currentMissions}
    </View>;
  }
  renderLoadingScreen() {
    return <View style={styles.container}>
      <View>
        <Text style={styles.loadingText}>
          Loading your missions ...
        </Text>
      </View>
      <ActivityIndicatorIOS />
    </View>;
  }
}

module.exports = Missions;