import React, { Component } from "react";
import { View, Text, Image } from "react-native";

import Header from "./header";
import SignInScreen from "./sign-in-screen";
import BasicDetailsScreen from "./basic-details-screen";

class UserOnBoardingScreen extends Component {
  static navigationOptions = {
    title: "Basic Details"
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* <Header navigation={this.props.navigation} /> */}
        <BasicDetailsScreen navigation={this.props.navigation} />
      </View>
    );
  }
}

export default UserOnBoardingScreen;
