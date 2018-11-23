import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  BackHandler
} from "react-native";
import { connect } from "react-redux";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";
import {
  getProfileDetail,
  setPin,
  askOtpOnEmail,
  validateEmailOtp,
  verifyPin
} from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import PinInput from "../components/pin-input";
import CustomTextInput from "../components/form-elements/text-input";
import LoadingOverlay from "../components/loading-overlay";
import ErrorOverlay from "../components/error-overlay";
import HeaderBackButton from "../components/header-nav-back-btn";

class PinSetupScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: params.resetPin ? I18n.t("reset_app_pin") : I18n.t("set_app_pin"),
      headerLeft: <HeaderBackButton onPress={params.onBackPress} />
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      retryFunction: "",
      error: null,
      showEmailInput: this.props.navigation.getParam("resetPin", false),
      showOtpInput: false,
      showRetryPin: false,
      showVerifyPin: false,
      email: "",
      otp: "",
      pin1: "",
      isLoading: false
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });
    const resetPin = this.props.navigation.getParam("resetPin", false);
    const updatePin = this.props.navigation.getParam("updatePin", false);
    if (updatePin == false) {
      this.setState({
        showVerifyPin: true
      });
    }
    if (!resetPin) {
      this.checkIfEmailAvailable();
    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    if (this.state.showVerifyPin && this.state.showRetryPin) {
      this.setState({
        showVerifyPin: true,
        showRetryPin: false
      });
    } else {
      this.props.navigation.goBack();
    }
    return true;
  };
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
      return showSnackbar({
        text: "Please enter email address"
      });
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
      showSnackbar({
        text: e.message
      });
      this.setState({
        isLoading: false
      });
    }
  };

  validateOtp = async () => {
    const { otp } = this.state;
    if (otp.length != 4) {
      return showSnackbar({
        text: "Please enter 4 digit OTP sent to your email address."
      });
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
      showSnackbar({
        text: e.message
      });
      this.setState({
        isLoading: false
      });
    }
  };

  setPin = async pin => {
    const { pin1 } = this.state;

    if (pin !== pin1) {
      this.setState({
        showVerifyPin: true,
        showRetryPin: false
      });
      return showSnackbar({
        text: "Retry PIN does not match with PIN."
      });
    }

    try {
      this.setState({
        isLoading: true
      });

      await setPin({ pin });
      this.props.setLoggedInUserIsPinSet(true);
      setTimeout(() => {
        showSnackbar({
          text: "Pin Successfully Changed",
          isOnTabsScreen: true
        });
      }, 200);

      this.props.navigation.goBack();
    } catch (e) {
      this.setState({
        isLoading: false
      });
      return showSnackbar({
        text: e.message
      });
    }
  };

  showVerifyPin = async pin => {
    try {
      this.setState({
        isLoading: true
      });
      await verifyPin({ pin });
      this.setState({ showVerifyPin: true, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false, showVerifyPin: false });
      this.verifyPinRef.clearPin();
      return showSnackbar({
        text: e.message
      });
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
      showVerifyPin,
      isLoading,
      error,
      retryFunction
    } = this.state;

    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this[retryFunction]} />;
    }
    return (
      <ScreenContainer style={styles.container}>
        {showEmailInput && !showOtpInput && (
          <View collapsable={false} style={{ padding: 16 }}>
            <CustomTextInput
              keyboardType="email-address"
              placeholder="Enter Email Id"
              onChangeText={email => this.setState({ email })}
            />
            <Button text="GET OTP" onPress={this.askForOtp} />
          </View>
        )}
        {!showEmailInput && showOtpInput && (
          <View collapsable={false} style={{ padding: 16 }}>
            <CustomTextInput
              keyboardType="numeric"
              placeholder="Enter OTP"
              onChangeText={otp => this.setState({ otp })}
              maxLength={4}
            />
            <Button text="Verify" onPress={this.validateOtp} />
          </View>
        )}
        {!showEmailInput && !showOtpInput && (
          <View collapsable={false} style={{ flex: 1 }}>
            {!showVerifyPin ? (
              <PinInput
                title="Verify App PIN"
                ref={ref => (this.verifyPinRef = ref)}
                onSubmitPress={this.showVerifyPin}
              />
            ) : (
              <View collapsable={false} />
            )}
            {showVerifyPin && !showRetryPin ? (
              <PinInput
                title="Create App PIN"
                onSubmitPress={this.showRetryPin}
              />
            ) : (
              <View collapsable={false} />
            )}
            {showRetryPin ? (
              <PinInput title="Confirm App PIN" onSubmitPress={this.setPin} />
            ) : (
              <View collapsable={false} />
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

const mapStateToProps = state => {
  return {
    isPinSet: state.loggedInUser.isPinSet
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserIsPinSet: newValue => {
      dispatch(loggedInUserActions.setLoggedInUserIsPinSet(newValue));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PinSetupScreen);
