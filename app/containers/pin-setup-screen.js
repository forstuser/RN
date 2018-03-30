import React from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { connect } from "react-redux";

import I18n from "../i18n";
import {
  getProfileDetail,
  setPin,
  askOtpOnEmail,
  validateEmailOtp
} from "../api";
import { Text, Button, ScreenContainer } from "../elements";

import { actions as loggedInUserActions } from "../modules/logged-in-user";

import PinInput from "../components/pin-input";
import CustomTextInput from "../components/form-elements/text-input";
import LoadingOverlay from "../components/loading-overlay";
import ErrorOverlay from "../components/error-overlay";

class PinSetupScreen extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      retryFunction: "",
      error: null,
      showEmailInput: props.resetPin || false,
      showOtpInput: false,
      showRetryPin: false,
      email: "",
      otp: "",
      pin1: "",
      isLoading: false
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: this.props.resetPin
        ? I18n.t("reset_app_pin")
        : I18n.t("set_app_pin")
    });

    if (!this.props.resetPin) {
      this.checkIfEmailAvailable();
    }
  }

  checkIfEmailAvailable = async () => {
    this.setState({
      isLoading: true
    });
    try {
      const res = await getProfileDetail();
      const profile = res.userProfile;
      if (!profile.email || !profile.email_verified) {
        this.setState({
          isLoading: false,
          showEmailInput: true
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    } catch (e) {
      this.setState({
        error: e,
        retryFunction: "checkIfEmailAvailable"
      });
    }
  };

  askForOtp = async () => {
    const { email } = this.state;
    if (!email) {
      return Alert.alert("Please enter email address");
    }
    try {
      this.setState({
        isLoading: true
      });
      await askOtpOnEmail({ email });
      this.setState({
        isLoading: false,
        showEmailInput: false,
        showOtpInput: true
      });
    } catch (e) {
      Alert.alert("Error", e.message);
      this.setState({
        isLoading: false
      });
    }
  };

  validateOtp = async () => {
    const { otp } = this.state;
    if (otp.length != 4) {
      return Alert.alert(
        "Please enter 4 digit OTP sent to your email address."
      );
    }
    try {
      this.setState({
        isLoading: true
      });
      await validateEmailOtp({ otp });
      this.setState({
        isLoading: false,
        showOtpInput: false
      });
    } catch (e) {
      Alert.alert("Error", e.message);
      this.setState({
        isLoading: false
      });
    }
  };

  setPin = async pin => {
    const { pin1 } = this.state;

    if (pin !== pin1) {
      return Alert.alert("Retry PIN does not match with PIN.");
    }

    try {
      this.setState({
        isLoading: true
      });

      await setPin({ pin });
      this.props.setLoggedInUserIsPinSet(true);
      Alert.alert("Pin Successfully Changed");
      this.props.navigator.pop();
    } catch (e) {
      this.setState({
        isLoading: false
      });
      return Alert.alert("Error", e.message);
    }
  };

  showRetryPin = pin => {
    this.setState({ pin1: pin, showRetryPin: true });
  };

  render() {
    const {
      showEmailInput,
      showOtpInput,
      showRetryPin,
      isLoading,
      error,
      retryFunction
    } = this.state;

    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this[retryFunction]} />;
    }
    return (
      <ScreenContainer style={styles.container}>
        {showEmailInput &&
          !showOtpInput && (
            <View style={{ padding: 16 }}>
              <CustomTextInput
                keyboardType="email-address"
                placeholder="Enter Email Id"
                onChangeText={email => this.setState({ email })}
              />
              <Button text="GET OTP" onPress={this.askForOtp} />
            </View>
          )}
        {!showEmailInput &&
          showOtpInput && (
            <View style={{ padding: 16 }}>
              <CustomTextInput
                keyboardType="numeric"
                placeholder="Enter OTP"
                onChangeText={otp => this.setState({ otp })}
                maxLength={4}
              />
              <Button text="Verify" onPress={this.validateOtp} />
            </View>
          )}
        {!showEmailInput &&
          !showOtpInput && (
            <View style={{ flex: 1 }}>
              {!showRetryPin && (
                <PinInput
                  title="Create App PIN"
                  onSubmitPress={this.showRetryPin}
                />
              )}
              {showRetryPin && (
                <PinInput title="Confirm App PIN" onSubmitPress={this.setPin} />
              )}
            </View>
          )}
        <LoadingOverlay visible={isLoading} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  }
});

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserIsPinSet: newValue => {
      dispatch(loggedInUserActions.setLoggedInUserIsPinSet(newValue));
    }
  };
};

export default connect(null, mapDispatchToProps)(PinSetupScreen);
