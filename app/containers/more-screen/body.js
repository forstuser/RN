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
    Linking.openURL("mailto:support@binbill.com");
  };

  render() {
    return (
      <View>
        <MoreItem
          onPress={this.onFaqItemPress}
          imageSource={require("../../images/ic_more_faq.png/")}
          name="FAQs"
        />
        <MoreItem
          onPress={this.onEhomeItemPress}
          imageSource={require("../../images/ic_more_refer.png/")}
          name="Tips to Build Your eHome "
        />
        <MoreItem
          onPress={() =>
            call({ number: "+911244343177" }).catch(e => Alert.alert(e.message))
          }
          imageSource={require("../../images/ic_more_call.png/")}
          name="Call Us "
        />
        <MoreItem
          onPress={this.onEmailItemPress}
          imageSource={require("../../images/ic_more_email.png/")}
          name="Email Us"
        />
        <MoreItem
          onPress={this.onLogoutItemPress}
          imageSource={require("../../images/ic_more_logout.png/")}
          name="Logout"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Body;
