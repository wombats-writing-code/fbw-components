// AddMission.ios.js

'use strict';
import React, {
    Component,
} from 'react';

import {
  ActivityIndicatorIOS,
  Animated,
  DatePickerIOS,
  Dimensions,
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
  addItemText: {
    textAlign: 'center'
  },
  addItemWrapper: {
    backgroundColor: '#BBEDBB',
    borderColor: '#A9D6A9',
    borderRadius: 5,
    borderWidth: 1
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
    fontWeight: 'bold',
    marginBottom: 5
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5
  },
  noItemsWarning: {
    backgroundColor: '#ff9c9c'
  },
  roundedButton: {
    borderColor: 'white',
    borderRadius: 3,
    borderWidth: 1,
    margin: 5,
    padding: 3
  },
  rowInput: {
    flex: 2
  },
  rowLabel: {
    flex: 1
  },
  separator: {
    borderColor: '#DBDBDB',
    borderWidth: 1,
    marginLeft: 5,
    marginRight: 5
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
      height: 0,
      items: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      missionDeadline: new Date(),
      missionDisplayName: '',
      missionStartDate: new Date(),
      opacity: new Animated.Value(0),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
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

    this.setState({ height: Dimensions.get('window').height });
  }
  componentDidUpdate() {
    // issue with styling DatePickerIOS:
    // https://github.com/facebook/react-native/issues/1587
//    if (this.refs.startDateDatepicker && this.refs.deadlineDatePicker) {
//      this.refs.startDateDatepicker.refs.datepicker.setNativeProps({width: Window.width - 500});
//      this.refs.deadlineDatePicker.refs.datepicker.setNativeProps({width: Window.width - 100});
//    }
  }
  onLayout = (event) => {
    // This doesn't get called -- why not??? Docs say it should, on mount and on layout change...
    console.log('onLayout called');
    this.setState({ height: Dimensions.get('window').height });
  }
  renderItemRow = (rowData, sectionId, rowId) => {

  }
  renderItemsList() {
    console.log('here in renderItemsList');
    if (this.state.items.length === 0) {
      return ( <View style={styles.noItemsWarning}>
        <Text>No questions</Text>
      </View> );
    } else {
      return (<ListView dataSource={this.state.items}
                        renderRow={this.renderItemRow}>
      </ListView> );
    }
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
          <ScrollView onScroll={(event) => {console.log('scroll!')}}
                      style={ {height: this.state.height - 50 } }>
            <View style={styles.inputRow}>
              <View style={styles.rowLabel}>
                <Text style={styles.inputLabel}>Display Name</Text>
              </View>
              <View style={styles.rowInput}>
                <TextInput autoFocus={true}
                           maxLength={255}
                           onChangeText={(text) => this.setState({missionDisplayName: text})}
                           placeholder="A label for the mission"
                           style={styles.textInput}
                           value={this.state.missionDisplayName} />
              </View>
            </View>
            <View>
              <Text style={styles.inputLabel}>Start Date</Text>
              <DatePickerIOS date={this.state.missionStartDate}
                             minuteInterval={30}
                             mode="datetime"
                             onDateChange={(date) => this.setState({missionStartDate: date})}
                             ref="startDateDatepicker"
                             timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}/>
            </View>
            <View>
              <Text style={styles.inputLabel}>Deadline</Text>
              <DatePickerIOS date={this.state.missionDeadline}
                             minuteInterval={30}
                             mode="datetime"
                             onDateChange={(date) => this.setState({missionDeadline: date})}
                             ref="deadlineDatepicker"
                             timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}/>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.rowLabel}>
                <Text style={styles.inputLabel}>Questions</Text>
                {this.renderItemsList()}
                <TouchableHighlight onPress={() => {console.log('clicked')}}
                                    style={styles.addItemWrapper}>
                  <Text style={styles.addItemText}>+ Add Item</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.separator}/>
              <View style={styles.rowInput}>
                <Text style={styles.inputLabel}>
                  Item preview
                </Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

module.exports = AddMission;