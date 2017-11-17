import React, { Component } from "react";
import { TextInput, Alert } from "react-native";

import { connect } from "react-redux";

import { consumerValidate } from "../api";
import LoadingOverlay from "../components/loading-overlay";
import { openAppScreen } from "../navigation";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import { ScreenContainer, Text, Button } from "../elements";
import { colors } from "../theme";
import I18n from "../i18n";

class VerifyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      isVerifyingOtp: false
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("verify_screen_title")
    });
  }

  onSubmitOtp = async () => {
    if (this.state.otp.length != 6) {
      return Alert.alert(I18n.t("verify_screen_invalid_otp_error"));
    }
    try {
      this.setState({
        isVerifyingOtp: true
      });
      const r = await consumerValidate(this.props.phoneNumber, this.state.otp);
      this.props.setLoggedInUserAuthToken(r.authorization);
      openAppScreen();
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  render() {
    return (
      <ScreenContainer
        style={{
          alignItems: "center"
        }}
      >
        <Text
          weight="Bold"
          style={{ textAlign: "center", fontSize: 14, width: 300 }}
        >
          {I18n.t("verify_screen_enter_otp_msg", {
            phoneNumber: this.props.phoneNumber
          })}
        </Text>
        <TextInput
          autoFocus={true}
          style={{
            height: 60,
            borderColor: colors.mainBlue,
            borderBottomWidth: 2,
            marginTop: 20,
            marginBottom: 30,
            width: 200,
            fontSize: 50,
            textAlign: "center"
          }}
          onChangeText={otp => this.setState({ otp })}
          value={this.state.otp}
          keyboardType="phone-pad"
        />
        <Button
          style={{ width: 320 }}
          color="secondary"
          onPress={this.onSubmitOtp}
          text={I18n.t("verify_screen_btn_text")}
        />
        <LoadingOverlay visible={this.state.isVerifyingOtp} />
      </ScreenContainer>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserAuthToken: token => {
      dispatch(loggedInUserActions.setLoggedInUserAuthToken(token));
    }
  };
};

export default connect(null, mapDispatchToProps)(VerifyScreen);
