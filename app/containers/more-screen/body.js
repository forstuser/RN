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
import Analytics from "../../analytics";

import LanguageOptions from "../../components/language-options";

import I18n from "../../i18n";
import { showSnackbar } from "../snackbar";

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onLogoutItemPress = () => {
    Alert.alert(
      "Are you sure you want to logout?",
      "No worries! You can always login again with just a simple click.",
      [
        {
          text: I18n.t("more_screen_logout"),
          onPress: () => {
            Analytics.logEvent(Analytics.EVENTS.CLICK_LOGOUT_YES);
            this.props.logoutUser();
          }
        },
        {
          text: I18n.t("more_screen_stay"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ]
    );
  };

  onAscItemPress = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ASC_FROM_MORE);
    this.props.navigator.push({
      screen: SCREENS.ASC_SCREEN
    });
  };

  onAmazonPress = () => {
    this.props.navigator.push({
      screen: SCREENS.AMAZON_SCREEN
    });
  };

  onEhomeItemPress = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_TIPS_TO_BUILD_YOUR_EHOME);
    this.props.navigator.push({
      screen: SCREENS.TIPS_SCREEN
    });
  };

  onFaqItemPress = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_FAQ);
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
    Analytics.logEvent(Analytics.EVENTS.CLICK_SHARE_APP);
    try {
      Share.share({
        message:
          "Install this wonder app on your phone and simplify your life. Consider it your Personal Home Manager - on the go. - http://bit.ly/2rIabk0"
      });
    } catch (e) {
      console.log(e);
    }
  };

  onVersionItemPress = async () => {
    const { isAppUpdateAvailable } = this.props;
    if (!isAppUpdateAvailable) {
      showSnackbar({
        text: `${I18n.t("more_screen_no_update_available")}`,
        autoDismissTimerSec: 5,
        isOnTabsScreen: true
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
    Analytics.logEvent(Analytics.EVENTS.CLICK_ADD_PIN);
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
          imageSource={require("../../images/ic_app_pin.png")}
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
          onPress={this.onAmazonPress}
          imageSource={require("../../images/ic_nav_asc_on.png")}
          text="Amazon"
        />
        <MoreItem
          onPress={this.onEhomeItemPress}
          imageSource={require("../../images/ic_more_refer.png")}
          text={I18n.t("more_screen_item_tips")}
        />
        <MoreItem
          onPress={() =>
            call({ number: "+917600919189" }).catch(e =>
              showSnackbar({
                text: e.message
              })
            )
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
