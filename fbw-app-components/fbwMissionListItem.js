

import React, {Component} from "react";
import {View, StyleSheet, TouchableHighlight} from "react-native";

/**
  props = {
    shouldShowMenuIcon: Boolean,
    onPressMenuIcon: function,
  }

*/
export default class fbwMissionListIem extends Component {

    render() {

      <View>
        I am a fbw mission list item.
      </View>
    }

    var styles = StyleSheet.create({
      headerContainer: {
        alignItems: 'center',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        background: '#fff',
        paddingBottom: 12,
        paddingTop: 30,            // so we don't hit the phone controls
        marginBottom: 18,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
      },
      menuIcon: {
      },
      title: {
        fontWeight: "700",
        textAlign: 'center',
      },
      subTitle: {
        textAlign: 'center',
        color: '#999'
      },
    })
}
