import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { colors } from "../../theme";
import { Text } from "../../elements";
import Header from "./header";
import SignInScreen from "./sign-in-screen";
import { SCREENS } from "../../constants";
import BasicDetailsScreen from "./basic-details-screen";

class UserOnBoardingScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { onSkipPress } = navigation.state.params || {};
    return {
      title: "Basic Details",
      headerRight: (
        <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={onSkipPress}
        >
          <Text
            weight="Bold"
            style={{ fontSize: 14, color: colors.pinkishOrange }}
          >
            SKIP
          </Text>
        </TouchableOpacity>
      )
    };
  };
  componentDidMount() {
    this.props.navigation.setParams({
      onSkipPress: () => {
        this.props.navigation.navigate(
          SCREENS.SELECT_GENDER_SCREEN_ONBOARDING,
          {
            navigation: this.props.navigation
          }
        );
      }
    });
  }

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
