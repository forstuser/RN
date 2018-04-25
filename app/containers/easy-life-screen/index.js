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

class EasyLifeScreen extends Component {
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Easy Life"
    });
  }

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
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.card}
            onPress={this.attendanceItemPress}
          >
            <Image style={styles.image} source={attendance} />
            <Text style={styles.text}>Attendance Manager</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={this.cookingItemPress}>
            <Image style={styles.image} source={cooking} />
            <Text style={styles.text}>What to Cook Today</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", marginTop: "5%" }}>
          <TouchableOpacity style={styles.card} onPress={this.wearItemPress}>
            <Image style={styles.image} source={whatToWear} />
            <Text style={styles.text}>What to Wear Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={this.toDoItemPress}>
            <Image style={styles.image} source={todo} />
            <Text style={styles.text}>What to Do Today</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
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
  card: {
    marginRight: 20,
    height: 150,
    width: "46%",
    justifyContent: "center",
    alignItems: "center",
    ...defaultStyles.card
  }
});

export default EasyLifeScreen;
