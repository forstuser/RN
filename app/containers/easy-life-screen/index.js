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
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
const cooking = require("../../images/cooking.png");
const attendance = require("../../images/attendance.png");
const todo = require("../../images/to_do.png");
const whatToWear = require("../../images/whatToWear.png");

class EasyLifeScreen extends Component {
<<<<<<< HEAD
=======

>>>>>>> pram
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

  cookingItemPress = () => {
    this.props.navigator.push({
      screen: SCREENS.ADD_COOKING_SCREEN
    });
  };
  wearItemPress = () => {
    this.props.navigator.push({
      screen: SCREENS.WHAT_TO_WEAR_LIST_SCREEN
    });
  };

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchableOpacity style={styles.card} onPress={this.cookingItemPress}>
            <View
              style={{
                width: 150,
                height: 150,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image style={styles.image} source={cooking} />
              <Text style={styles.text}>What to Cook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={this.attendanceItemPress}
          >
            <View
              style={{
                width: 150,
                height: 150,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image style={styles.image} source={attendance} />
              <Text style={styles.text}>Attendance</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, flexDirection: "row", marginTop: -170 }}>
          <TouchableOpacity
            style={styles.card}
            onPress={this.wearItemPress}
          >
            <View
              style={{
                width: 150,
                height: 150,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image style={styles.image} source={whatToWear} />
              <Text style={styles.text}>What to Wear Today</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <View
              style={{
                width: 150,
                height: 150,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image style={styles.image} source={todo} />
              <Text style={styles.text}>What to Do</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "auto"
  },
  image: {
    width: 96,
    height: 96,
    resizeMode: "contain"
  },
  text: {
    fontSize: 14,
    marginTop: 15,
    fontFamily: `Quicksand-Bold`,
    color: "#4a4a4a"
  },
  card: {
    marginRight: 20,
    height: 150,
    ...defaultStyles.card
  }
});

export default EasyLifeScreen;
