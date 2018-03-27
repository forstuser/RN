import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import I18n from "../i18n";
import { Text, Button, ScreenContainer } from "../elements";

import CustomTextInput from "../components/form-elements/text-input";

class PinSetupScreen extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      showPhoneNumberInput: props.resetPin || false,
      showOtpInput: false,
      phoneNumber: "",
      otp: "",
      pin: "",
      pin2: "",
      isLoading: false
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: this.props.resetPin
        ? I18n.t("reset_app_pin")
        : I18n.t("set_app_pin")
    });
  }

  render() {
    const { showPhoneNumberInput, showOtpInput, isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        {showPhoneNumberInput && (
          <View>
            <CustomTextInput
              keyboardType="numeric"
              placeholder="Enter Phone Number"
              onChangeText={phoneNumber => this.setState({ phoneNumber })}
              maxLength={10}
            />
            <Button
              text="GET OTP"
              onPress={() => this.props.navigator.dismissLightBox()}
            />
          </View>
        )}
        {showOtpInput && (
          <View>
            <CustomTextInput
              keyboardType="numeric"
              placeholder="Enter OTP"
              onChangeText={phoneNumber => this.setState({ phoneNumber })}
              maxLength={10}
            />
          </View>
        )}
        {!showPhoneNumberInput && (
          <View>
            <CustomTextInput
              keyboardType="numeric"
              placeholder="Enter Pin"
              onChangeText={pin => this.setState({ pin })}
              maxLength={4}
              secureTextEntry={true}
            />
            <CustomTextInput
              keyboardType="numeric"
              placeholder="Re-enter Pin"
              onChangeText={pin2 => this.setState({ pin2 })}
              maxLength={4}
              secureTextEntry={true}
            />
            <Button
              text="Save"
              onPress={() => this.props.navigator.dismissLightBox()}
            />
          </View>
        )}
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

export default PinSetupScreen;
