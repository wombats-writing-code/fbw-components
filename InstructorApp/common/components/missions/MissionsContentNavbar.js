// MissionsContentNavbar.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  Animated,
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
    alignItems: 'stretch',
    backgroundColor: '#709CCE',
    height: 45,
    padding: 5
  },
  subTitle: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center'
  },
  title: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  },
  titleWrapper: {
  }
});


class MissionsContentNavbar extends Component {
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
    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.subTitle}>{this.props.subtitle}</Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}

module.exports = MissionsContentNavbar;