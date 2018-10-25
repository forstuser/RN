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
// import Analytics from "../../analytics";
import { SCREENS, EASY_LIFE_TYPES } from "../../constants";
import { colors, defaultStyles } from "../../theme";
const cooking = require("../../images/cooking.png");
const attendance = require("../../images/attendance.png");
const todo = require("../../images/to_do.png");
const whatToWear = require("../../images/whatToWear.png");
const uploadFabIcon = require("../../images/ic_upload_fabs.png");
const calendarIcon = require("../../images/ic_calendar.png");

class EasyLifeScreen extends Component {
  static navigationOptions = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  attendanceItemPress = () => {
    // Analytics.logEvent(Analytics.EVENTS.CLICK_ON_WHO_IS_ABSENT_TODAY);
    this.props.navigation.navigate(SCREENS.MY_CALENDAR_SCREEN);
  };

  toDoItemPress = () => {
    // Analytics.logEvent(Analytics.EVENTS.CLICK_WHAT_TO_DO_TODAY);
    this.props.navigation.navigate(SCREENS.WHAT_TO_SCREEN, {
      type: EASY_LIFE_TYPES.WHAT_TO_DO
    });
  };
  cookingItemPress = () => {
    // Analytics.logEvent(Analytics.EVENTS.CLICK_WHAT_TO_COOK);
    this.props.navigation.navigate(SCREENS.WHAT_TO_SCREEN, {
      type: EASY_LIFE_TYPES.WHAT_TO_COOK
    });
  };
  wearItemPress = () => {
    // Analytics.logEvent(Analytics.EVENTS.CLICK_WHAT_TO_WEAR_TODAY);
    this.props.navigation.navigate(SCREENS.WHAT_TO_SCREEN, {
      type: EASY_LIFE_TYPES.WHAT_TO_WEAR
    });
  };

  showAddProductOptionsScreen = () => {
    // Analytics.logEvent(Analytics.EVENTS.CLICK_PLUS_ICON);
    //use push here so that we can use 'replace' later
    this.props.navigation.push(SCREENS.ADD_PRODUCT_SCREEN);
  };

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <View collapsable={false} style={styles.header}>
          <TabSearchHeader
            title={"EazyDay Planner"}
            icon={calendarIcon}
            navigation={this.props.navigation}
            showMailbox={false}
            showSearchInput={false}
          />
        </View>
        <View collapsable={false} style={styles.body}>
          <View collapsable={false} style={styles.cardRow}>
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

          <View collapsable={false} style={styles.cardRow}>
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
        <TouchableOpacity
          style={styles.fab}
          onPress={() => this.showAddProductOptionsScreen()}
        >
          <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
        </TouchableOpacity>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  header: {
    paddingBottom: 2,
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
    fontFamily: `Roboto-Bold`,
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
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    zIndex: 2,
    backgroundColor: colors.tomato,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  uploadFabIcon: {
    width: 25,
    height: 25
  }
});

export default EasyLifeScreen;
