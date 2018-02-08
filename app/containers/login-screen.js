import React, { Component } from "react";
import { View, TextInput, Alert } from "react-native";
import Hyperlink from "react-native-hyperlink";
import { SCREENS } from "../constants";
import { colors } from "../theme";
import { consumerGetOtp } from "../api";
import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import I18n from "../i18n";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      isGettingOtp: false
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("login_screen_title")
    });
  }

  onSubmitPhoneNumber = async () => {
    if (this.state.phoneNumber.length != 10) {
      return Alert.alert(I18n.t("login_screen_invalid_number_error"));
    }
    try {
      this.setState({
        isGettingOtp: true
      });
      await consumerGetOtp(this.state.phoneNumber);
      this.setState({
        isGettingOtp: false
      });
      this.props.navigator.push({
        screen: SCREENS.VERIFY_SCREEN,
        passProps: {
          phoneNumber: this.state.phoneNumber
        }
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  openTermsScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.TERMS_SCREEN
    });
  };
  render() {
    return (
      <ScreenContainer
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <View>
          <Text style={{ fontSize: 12, color: colors.secondaryText }}>
            {I18n.t("login_screen_input_placeholder")}
          </Text>
          <TextInput
            underlineColorAndroid="transparent"
            maxLength={10}
            style={{
              height: 40,
              borderColor: colors.mainBlue,
              borderBottomWidth: 2,
              marginBottom: 16
            }}
            onChangeText={phoneNumber => this.setState({ phoneNumber })}
            value={this.state.phoneNumber}
            keyboardType="phone-pad"
          />
          <Button
            color="secondary"
            type="outline"
            onPress={this.onSubmitPhoneNumber}
            text={I18n.t("login_screen_btn_text")}
          />
          <LoadingOverlay visible={this.state.isGettingOtp} />
        </View>
        <View>
          <Hyperlink
            linkDefault={true}
            linkStyle={{ color: colors.mainBlue, fontSize: 14 }}
            linkText={url => {
              if (url === "https://www.binbill.com/term") {
                return "Terms & Conditions";
              } else if (url === "https://www.binbill.com/privacy") {
                return "Privacy Policy";
              } else {
                return url;
              }
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.secondaryText,
                textAlign: "center"
              }}
            >
              By signing up you agree to our https://www.binbill.com/term and
              https://www.binbill.com/privacy
            </Text>
          </Hyperlink>
        </View>
      </ScreenContainer>
    );
  }
}

export default LoginScreen;
