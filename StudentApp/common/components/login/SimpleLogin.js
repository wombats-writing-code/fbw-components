// SimpleLogin.js
'use strict';

import React, {
    Component,
}  from 'react';
import {
  Animated,
  Dimensions,
  Picker,
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
      offset: new Animated.Value(-deviceHeight),
      school: 'acc',
      username: ''
    };
  }
  componentDidMount() {
    Animated.timing(this.state.offset, {
      duration: 150,
      toValue: 0
    }).start();
  }
  render() {
    return <View style={styles.container}>
      <View style={styles.inputPanel}>
        <TextInput autoCapitalize="none"
                   autoCorrect={false}
                   autoFocus={true}
                   onChangeText={(text) => this.setState({ username: text })}
                   placeholder="Username"
                   style={styles.usernameInput}
                   value={this.state.username} />
        <Picker onValueChange={(school) => this.setState({ school: school })}
                selectedValue={this.state.school}>
          <Picker.Item label="ACC" value="acc" />
          <Picker.Item label="QCC" value="qcc" />
        </Picker>
      </View>
      <View style={styles.loginPanel}>
        <TouchableHighlight onPress={() => this._loginUser()}
                            style={styles.loginButton}>
          <Text style={styles.loginButtonText}>
            Login
          </Text>
        </TouchableHighlight>
      </View>
    </View>;
  }
  _loginUser = () => {
    // in an OAuth-ish login, this should be the token?
    if (this.state.username == '') {
      Actions.error({
        message: 'You must supply a username'
      })
    } else {
      Actions.missions({
        schoolId: this.state.school,
        username: this.state.username
      });
    }
  }
}

module.exports = SimpleLogin;