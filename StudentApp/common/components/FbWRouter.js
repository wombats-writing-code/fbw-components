// FbWRouter.js
'use strict';

import React, {
    Component,
}  from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Modal,
  Reducer,
  Router,
  Scene
} from 'react-native-router-flux';

var Error = require('./error/Error');
var Login = require('./login/SimpleLogin');

var createReducer = (params) => {
  return (state, action) => {
    return Reducer(params)(state, action);
  }
}


class FbWRouter extends Component {
  constructor(props) {
    super (props);

    this.state = {
    };
  }
  render() {
    return <Router createReducer={createReducer}>
      <Scene key="modal" component={Modal} >
        <Scene key="root" hideNavBar hideTabBar>
          <Scene key="login" component={Login} />
        </Scene>
        <Scene key="error" component={Error}/>
      </Scene>
    </Router>;
  }
}

module.exports = FbWRouter;