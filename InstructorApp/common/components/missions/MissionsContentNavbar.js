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
  navIcon: {
    color: '#007AFF',
    fontSize: 12
  },
  navIconWrapper: {
    borderColor: '#007AFF',
    borderRadius: 5,
    borderWidth: 1,
    height: 20,
    padding: 3,
    width: 20
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
    flex: 1
  },
  wrapper: {
    flexDirection: 'row'
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
    var toggleSidebar = <View/>;

    if (!this.props.sidebarOpen) {
      toggleSidebar = ( <TouchableHighlight onPress={() => this.props.toggleSidebar()}
                                style={styles.navIconWrapper}>
        <View>
          <Icon name="navicon"
                style={styles.navIcon} />
        </View>
      </TouchableHighlight> );
    }

    return (
      <View style={styles.container}>
        <Animated.View style={{opacity: this.state.opacity}}>
          <View style={styles.wrapper}>
            {toggleSidebar}
            <View style={styles.titleWrapper}>
              <View style={[styles.titleWrapper]}>
                <Text style={styles.title}>{this.props.title}</Text>
              </View>
              <View style={[styles.titleWrapper]}>
                <Text style={styles.subTitle}>{this.props.subtitle}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

module.exports = MissionsContentNavbar;