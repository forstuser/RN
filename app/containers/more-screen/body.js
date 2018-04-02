import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Alert,
  Linking,
  Share
} from "react-native";
import { connect } from "react-redux";
import DeviceInfo from "react-native-device-info";
import AppLink from "react-native-app-link";
import ActionSheet from "react-native-actionsheet";
import call from "react-native-phone-call";

import { SCREENS } from "../../constants";
import { Text, Button, ScreenContainer } from "../../elements";
import MoreItem from "./more-item";

import LanguageOptions from "../../components/language-options";

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
        text: I18n.t("more_screen_logout"),
        onPress: () => this.props.logoutUser()
      },
      {
        text: I18n.t("more_screen_stay"),
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      }
    ]);
  };

  onAscItemPress = () => {
    this.props.navigator.push({
      screen: SCREENS.ASC_SCREEN
    });
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
      `mailto:support@binbill.com?bcc=rohit@binbill.com&bcc=sagar@binbill.com&subject=BinBill:Customer Feedback(${
        profile ? profile.mobile_no : ""
      })`
    );
  };

  onShareItemPress = async () => {
    try {
      Share.share({
        message:
          "Save time. Download BinBill, India's best product and appliance management app, to manage products, expenses and important documents. - http://bit.ly/2rIabk0"
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

  onLanguageChangePress = () => {
    this.languageOptions.show();
  };

  onAppPinPress = () => {
    const { isPinSet } = this.props;
    if (!isPinSet) {
      this.props.navigator.push({
        screen: SCREENS.PIN_SETUP_SCREEN
      });
    } else {
      this.pinOptions.show();
    }
  };

  onPinOptionPress = i => {
    if (i < 2) {
      if (i == 0) {
        this.props.navigator.push({
          screen: SCREENS.PIN_SETUP_SCREEN
        });
      } else {
        this.props.removePin();
      }
    }
  };

  render() {
    const appVersion = DeviceInfo.getVersion();
    const { isAppUpdateAvailable, isPinSet, language } = this.props;

    return (
      <ScrollView>
        <MoreItem
          onPress={this.onAppPinPress}
          imageSource={require("../../images/pin.png")}
          text={I18n.t("app_pin")}
          btnText={isPinSet ? I18n.t("change") : I18n.t("set_now")}
        />
        <ActionSheet
          onPress={this.onPinOptionPress}
          ref={o => (this.pinOptions = o)}
          cancelButtonIndex={2}
          options={[
            I18n.t("change_pin"),
            I18n.t("remove_pin"),
            I18n.t("cancel")
          ]}
        />

        <MoreItem
          onPress={this.onAscItemPress}
          imageSource={require("../../images/ic_nav_asc_on.png")}
          text={I18n.t("more_screen_item_app_search_authorized")}
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
          onPress={this.onFaqItemPress}
          imageSource={require("../../images/ic_more_faq.png")}
          text={I18n.t("more_screen_item_faq")}
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
        <LanguageOptions
          ref={o => (this.languageOptions = o)}
          onLanguageChange={this.props.setLanguage}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "red"
  }
});

export default Body;
