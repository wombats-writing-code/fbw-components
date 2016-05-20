// MissionsManager.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Text,
  ListView,
  ScrollView,
  View,
  ActivityIndicatorIOS,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

var AssessmentStore = require('../../stores/Assessment');
var UserStore = require('../../stores/User');

var MissionsCalendar = require('./MissionsCalendar');
var MissionsSidebar = require('./MissionsSidebar');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
});


class MissionsManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      mainContainer: 'calendar',
      missions: []
    }

    AssessmentStore.addChangeListener(this._updateMissionsFromStore.bind(this));
  }
  componentWillUnmount() {
    console.log('unmounted');
    AssessmentStore.removeChangeListener(this._updateMissionsFromStore.bind(this));
  }
  componentDidMount() {
    console.log('did mount');
    var bankId = UserStore.getData().bankId;

    AssessmentStore.getAssessments(bankId);
  }
  setMissions(missions) {
    console.log('setting missions');
    this.setState({ missions: missions });
    this.setState({ loading: false });
  }
  render() {
    if (this.state.loading) {
      return this.renderLoadingView();
    }

    var mainContent = <View style={styles.mainContainer} />;

    if (this.state.mainContainer == 'calendar') {
      mainContent = (<MissionsCalendar missions={this.state.missions} /> );
    }


    return (
      <View style={styles.container}>
        <MissionsSidebar missions={this.state.missions} />
        {mainContent}
      </View>
    );
  }
  renderLoadingView() {
    return ( <View>
      <Text>
        Loading your missions ...
      </Text>
      <ActivityIndicatorIOS
        hidden='true'
        size='large'/>
    </View> );
  }
  _updateMissionsFromStore(missions) {
    this.setMissions(missions);
  }
}

module.exports = MissionsManager;