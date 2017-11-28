import React, { Component } from "react";
import { Platform, StyleSheet, View, Image, Alert } from "react-native";
import { connect } from "react-redux";
import { Text, Button, ScreenContainer } from "../../elements";
import MoreItem from "./more-item";
class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onCallItemPress = () => {
    Alert.alert("calling");
  };

  onLogoutItemPress = () => {
    Alert.alert("logout");
  };

  onEhomeItemPress = () => {
    Alert.alert("tips");
  };

  onFaqItemPress = () => {
    Alert.alert("tips");
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
          onPress={this.onCallItemPress}
          imageSource={require("../../images/ic_more_call.png/")}
          name="Call Us "
        />
        <MoreItem
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

export default Body;
