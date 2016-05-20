// AddMission.ios.js

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
  TextInput,
  TouchableHighlight,
  View,
  } from 'react-native';

var styles = StyleSheet.create({
  actions: {
    flex: 1,
    flexDirection: 'row'
  },
  buttonText: {
    color: 'white',
    fontSize: 10
  },
  cancelButton: {
    left: 0,
    position: 'absolute',
    top: -50
  },
  container: {
    flex: 3,
    padding: 5
  },
  createButton: {
    position: 'absolute',
    right: 5,
    top: -50
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5
  },
  inputRow: {
    flex: 1
  },
  roundedButton: {
    borderColor: 'white',
    borderRadius: 3,
    borderWidth: 1,
    margin: 5,
    padding: 3
  },
  textInput: {
    borderColor: 'gray',
    borderRadius: 3,
    borderWidth: 1,
    height: 40,
    padding: 5
  }
});


class AddMission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      missionDeadline: '',
      missionDisplayName: '',
      missionStartDate: '',
      opacity: new Animated.Value(0)
    };
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
          <View style={styles.actions}>
            <TouchableHighlight onPress={() => this.props.cancelAdd()}>
              <View style={[styles.cancelButton, styles.roundedButton]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </View>
            </TouchableHighlight>
            <View style={[styles.createButton, styles.roundedButton]}>
              <Text style={styles.buttonText}>Create</Text>
            </View>
          </View>
          <ScrollView>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Display Name: </Text>
              <TextInput autoFocus={true}
                         maxLength={255}
                         onChangeText={(text) => this.setState({missionDisplayName: text})}
                         placeholder="A display name for the mission"
                         style={styles.textInput}
                         value={this.state.missionDisplayName} />
            </View>

          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

module.exports = AddMission;