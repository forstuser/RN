import React, { Component } from "react";
import { TextInput, Alert } from "react-native";

import { connect } from "react-redux";

import { consumerValidate, consumerGetOtp, getProfileDetail } from "../api";
import LoadingOverlay from "../components/loading-overlay";
import { openAfterLoginScreen } from "../navigation";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import { ScreenContainer, Text, Button } from "../elements";
import { colors } from "../theme";
import I18n from "../i18n";

import { showSnackbar } from "./snackbar";
import Analytics from "../analytics";

class VerifyScreen extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: "RESEND OTP",
        id: "resendOtp",
        buttonColor: colors.pinkishOrange, // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontWeight: "600" // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
      }
    ]
  };
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
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "resendOtp") {
        this.onResendOtp();
      }
    }
  };

  onResendOtp = async () => {
    this.otpInput.blur();
    try {
      this.setState({
        isVerifyingOtp: true,
        otp: ""
      });
      await consumerGetOtp(this.props.phoneNumber);

      showSnackbar({
        text: "OTP sent again successfully!!"
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      })
    }
    this.setState({
      isVerifyingOtp: false
    });
  };

  onSubmitOtp = async () => {
    if (this.state.otp.length != 4) {
      return showSnackbar({
        text: I18n.t("verify_screen_invalid_otp_error")
      })
    }

    try {
      this.setState({
        isVerifyingOtp: true
      });
      const r = await consumerValidate({
        trueObject: { PhoneNo: this.props.phoneNumber },
        token: this.state.otp,
        fcmToken: this.props.fcmToken
      });
      this.props.setLoggedInUserAuthToken(r.authorization);
      Analytics.logEvent(Analytics.EVENTS.REGISTRATION_OTP);
      const r2 = await getProfileDetail();
      const user = r2.userProfile;
      this.props.setLoggedInUser({
        id: user.id,
        name: user.name,
        phone: user.mobile_no,
        imageName: user.image_name,
        isPinSet: user.hasPin
      });
      openAfterLoginScreen();
    } catch (e) {
      showSnackbar({
        text: e.message
      })
      this.setState({
        isVerifyingOtp: false
      });
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
          underlineColorAndroid="transparent"
          ref={ref => (this.otpInput = ref)}
          autoFocus={true}
          maxLength={4}
          style={{
            height: 65,
            borderColor: colors.mainBlue,
            borderBottomWidth: 2,
            marginTop: 40,
            marginBottom: 10,
            width: 200,
            fontSize: 40,
            textAlign: "center"
          }}
          onChangeText={otp => this.setState({ otp })}
          value={this.state.otp}
          keyboardType="phone-pad"
        />
        <Button
          style={{ width: 300 }}
          color="secondary"
          onPress={this.onSubmitOtp}
          text={I18n.t("verify_screen_btn_text")}
        />
        <LoadingOverlay visible={this.state.isVerifyingOtp} />
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    fcmToken: state.loggedInUser.fcmToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserAuthToken: token => {
      dispatch(loggedInUserActions.setLoggedInUserAuthToken(token));
    },
    setLoggedInUser: user => {
      dispatch(loggedInUserActions.setLoggedInUser(user));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyScreen);
