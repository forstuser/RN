import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import { Text, Button } from "../elements";
import Modal from "react-native-modal";
import { colors } from "../theme";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL, addUserCreatedMeals, addUserCreatedTodos } from "../api";
import { SCREENS, EASY_LIFE_TYPES } from "../constants";
import CustomTextInput from "./form-elements/text-input";
import { showSnackbar } from "../utils/snackbar";
import LoadingOverlay from "./loading-overlay";
import Analytics from "../analytics";
const tick = require("../images/tick.png");

const cooking = require("../images/cooking.png");
const todo = require("../images/to_do.png");
const whatToWear = require("../images/whatToWear.png");
const headerBg = require("../images/product_card_header_bg.png");

class WhatToListEmptyState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goToFaq = () => {
    this.props.navigator.push({
      screen: SCREENS.FAQS_SCREEN,
      passProps: { scrollToBottom: true }
    });
  };

  onPressCreateList = () => {
    switch (this.props.type) {
      case EASY_LIFE_TYPES.WHAT_TO_COOK:
        Analytics.logEvent(Analytics.EVENTS.CLICK_CREATE_FIRST_LIST_COOK);
        break;
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        Analytics.logEvent(Analytics.EVENTS.CLICK_CREATE_FIRST_LIST_TODO);
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        Analytics.logEvent(Analytics.EVENTS.CLICK_CREATE_FIRST_LIST_WEAR);
        break;
    }
    this.props.onCreateListBtnPress();
  };

  render() {
    const { type } = this.props;

    let text =
      "You are here because you want us to help you decide What to Cook today, tomorrow or even the entire week";
    let image = cooking;

    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        text =
          "Get an overview of your entire task list and history of what you did and when.";
        image = todo;
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        text =
          "You are here because you want us to help you decide What to Wear today, tomorrow or even the entire week";
        image = whatToWear;
        break;
    }
    return (
      <View collapsable={false} style={styles.container}>
        <Image style={styles.blankPageImage} source={image} />
        <Text weight="Regular" style={styles.blankPageText}>
          {text}
        </Text>
        {type == EASY_LIFE_TYPES.WHAT_TO_DO ? (
          <View collapsable={false} style={styles.faqView}>
            <Text style={styles.faqText} weight="Regular">
              To know more, How it Works
            </Text>
            <TouchableOpacity
              style={{ paddingVertical: 10 }}
              onPress={this.goToFaq}
            >
              <Text
                weight="Medium"
                style={{ fontSize: 18, color: colors.pinkishOrange }}
              >
                Click here
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View collapsable={false} />
        )}
        <Button
          onPress={this.onPressCreateList}
          text="Let’s Get Started"
          style={styles.createListBtn}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  blankPageImage: {
    height: 100,
    width: 100,
    alignItems: "center",
    alignSelf: "center"
  },
  blankPageText: {
    fontSize: 18,
    color: "#4a4a4a",
    textAlign: "center",
    marginVertical: 10,
    maxWidth: 350,
    padding: 10
  },
  createListBtn: {
    width: 180,
    marginTop: 10
  },
  faqView: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  faqText: {
    fontSize: 18,
    color: "#4a4a4a",
    textAlign: "center",
    marginRight: 5
  }
});

export default WhatToListEmptyState;
