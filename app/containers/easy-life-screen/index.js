import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import I18n from "../../i18n";
import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import TabSearchHeader from "../../components/tab-screen-header";
import Analytics from "../../analytics";
import { SCREENS, EASY_LIFE_TYPES } from "../../constants";
import { colors, defaultStyles } from "../../theme";
const cooking = require("../../images/cooking.png");
const attendance = require("../../images/attendance.png");
const todo = require("../../images/to_do.png");
const whatToWear = require("../../images/whatToWear.png");

const calendarIcon = require("../../images/ic_calendar.png");

class EasyLifeScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  attendanceItemPress = () => {
    this.props.navigator.push({
      screen: SCREENS.MY_CALENDAR_SCREEN
    });
  };

  toDoItemPress = () => {
    this.props.navigator.push({
      screen: SCREENS.WHAT_TO_SCREEN,
      passProps: { type: EASY_LIFE_TYPES.WHAT_TO_DO }
    });
  };
  cookingItemPress = () => {
    this.props.navigator.push({
      screen: SCREENS.WHAT_TO_SCREEN,
      passProps: { type: EASY_LIFE_TYPES.WHAT_TO_COOK }
    });
  };
  wearItemPress = () => {
    this.props.navigator.push({
      screen: SCREENS.WHAT_TO_SCREEN,
      passProps: { type: EASY_LIFE_TYPES.WHAT_TO_WEAR }
    });
  };

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <TabSearchHeader
            title={"EazyDay"}
            icon={calendarIcon}
            navigator={this.props.navigator}
            showMailbox={false}
            showSearchInput={false}
          />
        </View>
        <View style={styles.body}>
          <View style={styles.cardRow}>
            <TouchableOpacity
              style={styles.card}
              onPress={this.attendanceItemPress}
            >
              <Image style={styles.image} source={attendance} />
              <Text style={styles.text}>Who’s Absent Today?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={this.cookingItemPress}
            >
              <Image style={styles.image} source={cooking} />
              <Text style={styles.text}>What’s Cooking Today?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.card} onPress={this.wearItemPress}>
              <Image style={styles.image} source={whatToWear} />
              <Text style={styles.text}>What To Wear Today?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={this.toDoItemPress}>
              <Image style={styles.image} source={todo} />
              <Text style={styles.text}>What To Do Today?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  header: {
    width: "100%",
    ...Platform.select({
      ios: {
        zIndex: 1
      },
      android: {}
    })
  },
  body: {
    padding: 16,
    flex: 1,
    alignItems: "center"
  },
  image: {
    width: 96,
    height: 96,
    resizeMode: "contain"
  },
  text: {
    fontSize: 12,
    marginTop: 15,
    fontFamily: `Quicksand-Bold`,
    color: "#4a4a4a"
  },
  cardRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
  card: {
    margin: 10,
    height: 150,
    width: "46%",
    justifyContent: "center",
    alignItems: "center",
    ...defaultStyles.card
  }
});

export default EasyLifeScreen;
