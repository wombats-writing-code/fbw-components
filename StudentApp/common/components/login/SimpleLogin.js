// SimpleLogin.js
'use strict';

import React, {
    Component,
}  from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
import {
  Actions
} from "react-native-router-flux";

var {
  height: deviceHeight
} = Dimensions.get("window");

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#dddddd',
    flex: 1
  },
  inputPanel: {
    justifyContent: 'center',
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#c9c097',
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
    padding: 10
  },
  loginButtonText: {
    textAlign: 'center'
  },
  loginPanel: {
    height: 75,
    padding: 10
  },
  usernameInput: {
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
    margin: 10,
    padding: 10
  }
});

class SimpleLogin extends Component {
  constructor(props) {
    super (props);

    this.state = {
      offset: new Animated.Value(-deviceHeight)
    };
  }
  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: 0
    }).start();
  }
  closeModal = () => {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: -deviceHeight
    }).start(Actions.pop);
  }
  render() {
    return <View style={styles.container}>
      <View style={styles.inputPanel}>
        <TextInput autoCapitalize="none"
                   autoCorrect={false}
                   autoFocus={true}
                   placeholder="Username"
                   style={styles.usernameInput} />
      </View>
      <View style={styles.loginPanel}>
        <TouchableHighlight onPress={() => console.log('here')}
                            style={styles.loginButton}>
          <Text style={styles.loginButtonText}>
            Login
          </Text>
        </TouchableHighlight>
      </View>
    </View>;
  }
}

module.exports = SimpleLogin;