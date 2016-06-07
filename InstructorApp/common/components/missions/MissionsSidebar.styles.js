import {
  StyleSheet,
} from 'react-native';

var _bodyFontSize = 14;
var _captionFontSize = 12;
var _lineHeight = 20;

module.exports = StyleSheet.create({
  addMissionWrapper: {
    flex: 1,
    height: 60,
    marginRight: -10
  },
  buttonText: {
    fontSize: 50,
    color: '#007AFF',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    // alignItems: 'stretch'
  },
  missionInformation: {
    flex: 1
  },
  missionRightIcon: {
    color: '#656565',
    justifyContent: 'center',
  },
  toggleCaret: {
    color: '#007AFF'
  },
  toggleWrapper: {
    justifyContent: 'center',
    paddingLeft: 5,
    width: 10
  },

  // list of missions
  missionsList: {
  },
  missionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: _lineHeight / 2,
    paddingBottom: _lineHeight / 2
  },
  missionTypeIcon: {
    flex: 0,
    width: 30,
    justifyContent: 'center',
    marginRight: 10,
    marginRight: 5,
    resizeMode: 'contain'
  },
  missionsListWrapper: {
    backgroundColor: 'white',
    flex: 1,
    margin: 2,
    padding: 1
  },
  missionTitle: {
    fontSize: _bodyFontSize,
    letterSpacing: .5,
    fontWeight: "600",
    color: '#333',
    marginBottom: _lineHeight / 2
  },
  missionSubtitle: {
    color: '#aaa',
    fontSize: _captionFontSize
  },
  missionWrapper: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: _lineHeight / 2,
    paddingTop: _lineHeight / 2
  },
  missionWrapperSelected: {
    backgroundColor: '#709CCE'
  },


  notification: {
    backgroundColor: '#ff9c9c',
    padding: 3
  },
  notificationText: {
    fontSize: 10,
    padding: 5
  },
  progressIcon: {
    marginRight: 3
  },
  rounded: {
    borderRadius: 3
  },
  sidebarFooter: {
    height: 10
  },
  sidebarHeader: {
    flexDirection: 'row'
  },

});
