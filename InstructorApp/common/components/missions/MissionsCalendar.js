// MissionsCalendar.js

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

var styles = StyleSheet.create({
  container: {
    flex: 3
  }
});


class MissionsCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentWillUnmount() {
  }
  componentDidMount() {
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text>
            A calendar!
          </Text>
        </ScrollView>
      </View>
    );
  }
}

module.exports = MissionsCalendar;