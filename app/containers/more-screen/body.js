import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Alert,
  Linking
} from "react-native";
import { connect } from "react-redux";
import { Text, Button, ScreenContainer } from "../../elements";
import MoreItem from "./more-item";
import call from "react-native-phone-call";

import I18n from "../../i18n";

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onLogoutItemPress = () => {
    Alert.alert("Are you sure you want to logout?", "", [
      {
        text: "Yes, Logout",
        onPress: () => this.props.logoutUser()
      },
      {
        text: "No, Stay",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      }
    ]);
  };

  onEhomeItemPress = () => {
    this.props.navigator.push({
      screen: "TipsScreen"
    });
  };

  onFaqItemPress = () => {
    this.props.navigator.push({
      screen: "FaqScreen"
    });
  };

  onEmailItemPress = () => {
    Linking.openURL(
      "mailto:support@binbill.com&subject=BinBill:Customer Feedback()"
    );
  };

  render() {
    return (
      <View>
        <MoreItem
          onPress={this.onFaqItemPress}
          imageSource={require("../../images/ic_more_faq.png/")}
          name={I18n.t("more_screen_item_faq")}
        />
        <MoreItem
          onPress={this.onEhomeItemPress}
          imageSource={require("../../images/ic_more_refer.png/")}
          name={I18n.t("more_screen_item_tips")}
        />
        <MoreItem
          onPress={() =>
            call({ number: "+911244343177" }).catch(e => Alert.alert(e.message))
          }
          imageSource={require("../../images/ic_more_call.png/")}
          name={I18n.t("more_screen_item_call")}
        />
        <MoreItem
          onPress={this.onEmailItemPress}
          imageSource={require("../../images/ic_more_email.png/")}
          name={I18n.t("more_screen_item_email")}
        />
        <MoreItem
          onPress={this.onLogoutItemPress}
          imageSource={require("../../images/ic_more_logout.png/")}
          name={I18n.t("more_screen_item_logout")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Body;
