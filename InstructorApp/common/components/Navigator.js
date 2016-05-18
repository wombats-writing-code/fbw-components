// The following is mostly from React-Native UI Examples:
// https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/Navigator/NavigationBarSample.js

'use strict';
import React, {
    Component,
} from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

var _ = require('lodash');
var Orientation = require('react-native-orientation');

var AccountsList = require('./accountsList');
var BankSelector = require('./bank-selector/BankSelector');
var MissionsManager = require('./missions-manager/MissionsManager');

var styles = StyleSheet.create({
  navigator: {
  },
  navBar: {
    backgroundColor: '#6491A6',
    height: 50,
    paddingTop: 5
  },
  navBarText: {
    fontSize: 16,
  },
  navBarTitleText: {
    color: 'white',
    fontWeight: '500',
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#cccccc',
  },
  scene: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
});
var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.title}
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    if (index === 0) {
        return null;
    }

    return (
      <TouchableOpacity
        onPress={() => navigator.push({
          id: 'accounts',
          title: 'Accounts',
          index: 1
          })}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Next
        </Text>
      </TouchableOpacity>
    );
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },

};


var FbWNavigator = React.createClass({
    statics: {
        title: 'Fly-by-Wire',
        description: 'Fly-by-Wire educational app'
    },
  componentWillMount: function() {
//    var navigator = this.props.navigator;

    var callback = (event) => {
      console.log(
        `NavigationBarSample : event ${event.type}`,
        {
          route: JSON.stringify(event.data.route),
          target: event.target,
          type: event.type,
        }
      );
    };

    // Observe focus change events from this component.
//    this._listeners = [
//      navigator.navigationContext.addListener('willfocus', callback),
//      navigator.navigationContext.addListener('didfocus', callback),
//    ];
  },
    componentDidMount: function () {
//        Orientation.lockToLandscape();
    },
    render: function () {
        return <Navigator style={styles.navigator}
              initialRoute={{id: 'banks', title: 'Banks', index: 0}}
              renderScene={(route, nav) =>
                {return this.renderScene(route, nav)}}
              navigationBar={
                  <Navigator.NavigationBar
                    routeMapper={NavigationBarRouteMapper}
                    style={styles.navBar}
                  />
                }
        />
    },
    renderScene: function (route, nav) {
        switch (route.id) {
            case "home":
                return <AccountsList navigator={nav} />
            case "missions":
                return <MissionsManager navigator={nav} />
            case "banks":
                return <BankSelector navigator={nav} />

        }
    }
});

module.exports = FbWNavigator;