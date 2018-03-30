import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";

import I18n from "../i18n";
import { verifyPin } from "../api";
import { Text, Button, ScreenContainer } from "../elements";

import CustomTextInput from "../components/form-elements/text-input";
import PinInput from "../components/pin-input";
import LoadingOverlay from "../components/loading-overlay";

import { colors } from "../theme";
import { SCREENS } from "../constants";

class EnterPinScreen extends React.Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  state = {
    isLoading: false
  };

  onForgotPinPress = () => {
    this.props.navigator.push({
      screen: SCREENS.PIN_SETUP_SCREEN,
      passProps: {
        resetPin: true
      }
    });
  };

  verifyPin = async pin => {
    if (pin.length != 4) {
      return Alert.alert("Please enter 4 digit pin");
    }
    this.setState({
      isLoading: true
    });
    try {
      await verifyPin({ pin });
      this.setState({
        isLoading: false
      });
      this.props.navigator.dismissModal();
    } catch (e) {
      Alert.alert("Verification Failed", e.message);
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <PinInput
          title="Enter App PIN"
          showForgotOption={true}
          onSubmitPress={this.verifyPin}
          onForgotOptionPress={this.onForgotPinPress}
        />
        <LoadingOverlay visible={this.state.isLoading} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});

export default EnterPinScreen;
