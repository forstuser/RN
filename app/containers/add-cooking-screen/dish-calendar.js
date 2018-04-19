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
import Analytics from "../../analytics";
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
const cooking = require("../../images/cooking.png");

class DishCalendarScreen extends Component {
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "What to Cook"
    });
  }
  render() {
    return (
      <ScreenContainer style={styles.container}>
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            marginTop: 25
          }}
        >
          <Image style={{ width: 74, height: 74 }} source={cooking} />
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  dishType: {
    textAlign: "center",
    fontSize: 14,
    color: "#9b9b9b",
    fontFamily: "Quicksand-Medium"
  },
  addDish: {
    borderRadius: 4,
    textAlign: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d6d7da",
    height: 45,
    paddingTop: 10
  },
  addItemBtn: {
    width: "100%",
    position: "absolute",
    bottom: 0
  }
});

export default DishCalendarScreen;
