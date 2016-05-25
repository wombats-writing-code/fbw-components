// MissionsMainContent.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicatorIOS,
  Animated,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  } from 'react-native';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

var AssessmentStore = require('../../stores/Assessment');
var UserStore = require('../../stores/User');

var AddMission = require('./AddMission');
var MissionsCalendar = require('./MissionsCalendar');
var MissionsContentNavbar = require('./MissionsContentNavbar');

var styles = StyleSheet.create({
  container: {
    flex: 3
  }
});


class MissionsMainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    }

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
  }
  render() {
    var content = <View />, title, subtitle;

    if (this.props.content == 'calendar') {
      content = <MissionsCalendar missions={this.props.missions} />;
      subtitle = 'Spring 2016';
      title = 'Mission Control';
    } else if (this.props.content == 'addMission') {
      content = <AddMission bankId={this.props.bankId}
                            closeAdd={this._closeAddNewMission} />;
      subtitle = '';
      title = 'Add New Mission';
    }

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <MissionsContentNavbar content={this.props.content}
                                 mission={this.props.selectedMission}
                                 subtitle={subtitle}
                                 title={title} />
          {content}
        </Animated.View>
      </View>
    );
  }
  _closeAddNewMission = () => {
    this.props.changeContent('calendar');
  }
}

module.exports = MissionsMainContent;