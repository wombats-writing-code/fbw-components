// MissionsManager.js

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

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

var AssessmentStore = require('../../stores/Assessment');
var BankStore = require('../../stores/Bank');
var UserStore = require('../../stores/User');

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  button: {
    backgroundColor: '#049158'
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff'
  }
});


class MissionsManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            missions: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loading: true
        }
    }
    componentWillMount() {
        AssessmentStore.addChangeListener((missions) => {
            console.log('here in the callback');
            this.setMissions(missions);
        });
    }
    componentDidMount() {
        var bankId = UserStore.getData().bankId;

        AssessmentStore.getAssessments(bankId);
    }
    addAccount() {

    }
    getAccountDetails(accountData) {

    }
    setMissions(missions) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({ missions: ds.cloneWithRows(missions) });
        this.setState({ isLoading: false });
    }
    renderRow(rowData, sectionId, rowId) {
        return (
            <TouchableHighlight onPress={() => this.getAccountDetails(rowData)}>
                <View>
                    <View style={styles.rowWrapper}>
                        <Text
                            style={styles.title}
                            numberOfLines={1}
                        >
                            {rowData.displayName.text}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
            );
    }
    render() {
        var spinner = this.state.loading ?
                      ( <ActivityIndicatorIOS
                            hidden='true'
                            size='large'/> ) :
                      ( <View />),
            currentMissions = this.state.missions.length > 0 ?
                      ( <ListView
                            dataSource={this.state.missions}
                            renderRow={this.renderRow}>
                        </ListView> ) :
                      ( <View /> );
        return (
            <View style={styles.container}>
                <ScrollView>
                    {currentMissions}
                </ScrollView>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>
                        <Icon name="plus" />
                        Add Mission
                    </Text>
                </View>
                {spinner}
            </View>
        );
    }
}

module.exports = MissionsManager;