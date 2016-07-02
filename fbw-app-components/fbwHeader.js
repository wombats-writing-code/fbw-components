

import React, {Component} from "react";
import {View, StyleSheet, TouchableHighlight} from "react-native";

/**
  props = {
    shouldShowMenuIcon: Boolean,
    onPressMenuIcon: function,
  }

*/

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

export default class fbwHeader extends Component {

    render() {

      var menuIcon, rightIcon;
      if (this.props.showShowMenuIcon) {
        menuIcon = <TouchableHighlight onPress={() => this.props.onPressMenuIcon()}>
                      <Image source={require('./assets/menu-icon.png')} styles={styles.menuIcon}/>
                  </TouchableHighlight>
      }

      return (
        <View style={styles.headerContainer}>

          {menuIcon}

          <View>
            <Text style={styles.title}>{(this.props.title || '').toUpperCase()}</Text>
            <Text style={styles.subTitle}>{(this.props.subTitle || '').toUpperCase()}</Text>
          </View>

          {rightIcon}

        </View>
      )
    }
}
