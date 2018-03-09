import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Alert,
  Linking,
  Share
} from "react-native";
import { connect } from "react-redux";
import DeviceInfo from "react-native-device-info";
import AppLink from "react-native-app-link";

import { SCREENS } from "../../constants";
import { Text, Button, ScreenContainer } from "../../elements";
import MoreItem from "./more-item";
import call from "react-native-phone-call";

import I18n from "../../i18n";

import { showSnackbar } from "../snackbar";

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
      screen: SCREENS.TIPS_SCREEN
    });
  };

  onFaqItemPress = () => {
    this.props.navigator.push({
      screen: SCREENS.FAQS_SCREEN
    });
  };

  onEmailItemPress = () => {
    const { profile } = this.props;
    Linking.openURL(
      `mailto:support@binbill.com?cc=rohit@binbill.com?subject=BinBill:Customer Feedback(${
        profile ? profile.mobile_no : ""
      })`
    );
  };

  onShareItemPress = async () => {
    try {
      Share.share({
        message: "Hey, Chack out this awesome app- http://bit.ly/2rIabk0"
      });
    } catch (e) {
      console.log(e);
    }
  };

  onVersionItemPress = async () => {
    const { isAppUpdateAvailable } = this.props;
    if (!isAppUpdateAvailable) {
      showSnackbar({
        text: I18n.t("more_screen_no_update_available"),
        autoDismissTimerSec: 5
      });
    } else {
      AppLink.openInStore("id1328873045", "com.bin.binbillcustomer")
        .then(() => {
          // do stuff
        })
        .catch(err => {
          // handle error
        });
    }
  };

  render() {
    const appVersion = DeviceInfo.getVersion();
    const { isAppUpdateAvailable } = this.props;

    return (
      <View>
        <MoreItem
          onPress={this.onFaqItemPress}
          imageSource={require("../../images/ic_more_faq.png")}
          text={I18n.t("more_screen_item_faq")}
        />
        <MoreItem
          onPress={this.onEhomeItemPress}
          imageSource={require("../../images/ic_more_refer.png")}
          text={I18n.t("more_screen_item_tips")}
        />
        <MoreItem
          onPress={() =>
            call({ number: "+917600919189" }).catch(e => Alert.alert(e.message))
          }
          imageSource={require("../../images/ic_more_call.png")}
          text={I18n.t("more_screen_item_call")}
        />
        <MoreItem
          onPress={this.onEmailItemPress}
          imageSource={require("../../images/ic_more_email.png")}
          text={I18n.t("more_screen_item_email")}
        />
        <MoreItem
          onPress={this.onShareItemPress}
          imageSource={require("../../images/ic_share_blue.png")}
          text={I18n.t("more_screen_item_share")}
        />
        <MoreItem
          onPress={this.onVersionItemPress}
          imageSource={require("../../images/ic_info_blue.png")}
          text={I18n.t("more_screen_item_app_version") + ": v" + appVersion}
          btnText={
            isAppUpdateAvailable
              ? I18n.t("more_screen_item_app_version_update_to")
              : null
          }
        />
        <MoreItem
          onPress={this.onLogoutItemPress}
          imageSource={require("../../images/ic_more_logout.png/")}
          text={I18n.t("more_screen_item_logout")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Body;
