import React from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";

import I18n from "../i18n";
import { Text, Button, ScreenContainer } from "../elements";

import CustomTextInput from "../components/form-elements/text-input";
import { colors } from "../theme";
import { SCREENS } from "../constants";

class EnterPinScreen extends React.Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  state = {
    pin: "",
    isSavingPin: false
  };

  onForgotPinPress = () => {
    this.props.navigator.push({
      screen: SCREENS.PIN_SETUP_SCREEN,
      passProps: {
        resetPin: true
      }
    });
  };

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <CustomTextInput
          keyboardType="numeric"
          placeholder="Enter App Pin"
          onChangeText={pin => this.setState({ pin })}
          maxLength={4}
          secureTextEntry={true}
        />
        <Button
          text="Submit"
          onPress={() => this.props.navigator.dismissLightBox()}
        />

        <Text
          onPress={this.onForgotPinPress}
          weight="Bold"
          style={styles.forgotPin}
        >
          Forgot Pin?
        </Text>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.9)",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  forgotPin: {
    fontSize: 16,
    color: colors.pinkishOrange,
    marginTop: 20,
    textAlign: "center"
  }
});

export default EnterPinScreen;
