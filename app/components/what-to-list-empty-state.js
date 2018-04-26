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
import { showSnackbar } from "../containers/snackbar";
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
        Analytics.logEvent(Analytics.EVENTS.CLICK_CREATE_FIRST_LIST_WEAR);
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        Analytics.logEvent(Analytics.EVENTS.CLICK_CREATE_FIRST_LIST_TODO);
        break;
    }
    this.props.onCreateListBtnPress();
  }

  render() {
    const { type } = this.props;

    let text =
      "You don't have any items in your meals list, please create your list first";
    let image = cooking;

    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        text =
          "You don't have any items in your to-do list, please create your list first";
        image = todo;
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        text =
          "You don’t have any items in your wardrobe list, please create your list first";
        image = whatToWear;
        break;
    }
    return (
      <View style={styles.container}>
        <Image style={styles.blankPageImage} source={image} />
        <Text weight="Medium" style={styles.blankPageText}>
          {text}
        </Text>
        <Button
          onPress={this.onPressCreateList}
          text="Create List"
          style={styles.createListBtn}
        />
        {type == EASY_LIFE_TYPES.WHAT_TO_DO && <View style={styles.faqView}>
          <Text style={styles.faqText} weight="Medium">
            To know more How it Works,
                </Text>
          <TouchableOpacity
            style={{ paddingVertical: 10 }}
            onPress={this.goToFaq}
          >
            <Text weight="Medium" style={{ color: colors.pinkishOrange }}>
              {" "}
              click here
                  </Text>
          </TouchableOpacity>
        </View>}
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
    height: 70,
    width: 70,
    alignItems: "center",
    alignSelf: "center"
  },
  blankPageText: {
    fontSize: 14,
    color: "#9b9b9b",
    textAlign: "center",
    marginVertical: 10,
    width: '90%'
  },
  createListBtn: {
    width: 150
  },
  faqView: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  faqText: {
    fontSize: 14,
    color: "#9b9b9b",
    textAlign: "center"
  },
});

export default WhatToListEmptyState;
