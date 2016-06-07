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

import Drawer from 'react-native-drawer';

var _ = require('lodash');
var Icon = require('react-native-vector-icons/FontAwesome');

var AssessmentStore = require('../../stores/Assessment');
var ItemStore = require('../../stores/Item');
var ModuleStore = require('../../stores/Module');
var UserStore = require('../../stores/User');

var MissionsSidebar = require('./MissionsSidebar');
var MissionsMainContent = require('./MissionsMainContent');
var QuestionsDrawer = require('./AllQuestionsDrawer');

var SortItemsByModules = require('../../../utilities/handcar/sortItemsByModules');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: 600,
    flexDirection: 'row'
  },
  questionDrawer: {
    backgroundColor: '#7A7A7A',
    opacity: 0.5
  }
});


class MissionsManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
      content: 'calendar',
      drawerOpen: true,
      loading: true,
      missions: [],
      modules: [],
      questionDrawerOpen: false,
      selectedMission: {},
      sortedItems: {}
    };
    AssessmentStore.addChangeListener(this._updateMissionsFromStore);
    ItemStore.addChangeListener(this._updateItemsFromStore);
    ModuleStore.addChangeListener(this._updateModulesFromStore);
  }
  componentWillUnmount() {
    AssessmentStore.removeChangeListener(this._updateMissionsFromStore);
    ItemStore.removeChangeListener(this._updateItemsFromStore);
    ModuleStore.removeChangeListener(this._updateModulesFromStore);
  }
  componentDidMount() {
    var bankId = UserStore.getData().bankId;

    AssessmentStore.getAssessments(bankId);
    ItemStore.getItems(bankId);
    ModuleStore.getModules(bankId);
  }
  setItems(items) {
    this.setState({ allItems: items });
  }
  setMissions(missions) {
    console.log('setMissions');

    this.setState({ missions: missions });
    this.setState({ loading: false });
  }
  setSelectedMission = (mission, mode) => {
    if (typeof mode === 'undefined') {
      mode = 'missionStatus'
    }
    this.setState({ selectedMission: mission });
    this.setState({ content: mode });
  }
  render() {
    var bankId = UserStore.getData().bankId;

    if (this.state.loading) {
      return this.renderLoadingView();
    }
    // set panThreshold to 1.5 because acceptPan doesn't seem to work?
    return (
      <Drawer acceptPan={false}
              captureGestures={false}
              content={<MissionsSidebar changeContent={this._changeContent}
                                        missions={this.state.missions}
                                        selectMission={this.setSelectedMission}
                                        sidebarOpen={this.state.drawerOpen}
                                        toggleSidebar={this._toggleSidebar} />}
              open={this.state.drawerOpen}
              openDrawerOffset={0.7}
              panThreshold={1.5}
              side='left'
              style={styles.container}
              tweenHandler={Drawer.tweenPresets.parallax}>
      <Drawer acceptPan={false}
                captureGestures={false}
                content={<QuestionsDrawer items={this.state.sortedItems} />}
                open={this.state.questionDrawerOpen}
                openDrawerOffset={0.5}
                panThreshold={1.5}
                side='right'
                type='overlay'>
          <View>
            <MissionsMainContent bankId={bankId}
                                 changeContent={this._changeContent}
                                 content={this.state.content}
                                 missions={this.state.missions}
                                 selectedMission={this.state.selectedMission}
                                 sidebarOpen={this.state.drawerOpen}
                                 toggleQuestionDrawer={this._toggleQuestionDrawer}
                                 toggleSidebar={this._toggleSidebar} />
          </View>
        </Drawer>
      </Drawer>
    )
  }

  renderLoadingView() {
    return ( <View>
      <Text>
        Loading your missions ...
      </Text>
      <ActivityIndicatorIOS
        hidden='true'
        size='large'/>
    </View> );
  }
  _changeContent = (newContent) => {
    this.setState({ content: newContent });
  }
  _toggleQuestionDrawer = () => {
    this.setState({ questionDrawerOpen: !this.state.questionDrawerOpen });
    if (this.state.drawerOpen) {
      this._toggleSidebar();
    }
  }
  _toggleSidebar = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }
  _updateItemsFromStore = (items) => {

    var alphabeticalItems = _.sortBy(items,
      ['displayName.text']),
      moduleItems = {};

      console.log('_updateItemsFromStore');

    this.setItems(alphabeticalItems);

    if (this.state.modules.length === 0) {
      moduleItems.none = {
          displayName: 'No module',
          items: alphabeticalItems
        };

      this.setState({ sortedItems: moduleItems });
    } else {
      this.setState({ sortedItems: SortItemsByModules(this.state.modules, alphabeticalItems) });
    }
  }
  _updateMissionsFromStore = (missions) => {
    console.log('_updateMissionsFromStore');

    // sort missions by startTime first
    this.setMissions(_.sortBy(missions,
      ['startTime.year', 'startTime.month', 'startTime.day',
       'deadline.year', 'deadline.month', 'deadline.day',
       'displayName.text']));
  }
  _updateModulesFromStore = (modules) => {

    this.setState({ modules: modules }, function () {
      if (this.state.allItems.length === 0) {
        this.setState({ sortedItems: SortItemsByModules(this.state.modules, []) });
      } else {
        this.setState({ sortedItems: SortItemsByModules(this.state.modules, this.state.allItems) });
      }
    });
  }
}

module.exports = MissionsManager;
