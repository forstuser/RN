import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  BackAndroid
} from "react-native";
import { showSnackbar } from "../utils/snackbar";

import I18n from "../i18n";
import { verifyPin } from "../api";
import { Text, Button, ScreenContainer } from "../elements";

import CustomTextInput from "../components/form-elements/text-input";
import PinInput from "../components/pin-input";
import LoadingOverlay from "../components/loading-overlay";

import { colors } from "../theme";
import { SCREENS, GLOBAL_VARIABLES } from "../constants";

class EnterPinScreen extends React.Component {
  static navigationOptions = {
    navBarHidden: true
  };

  state = {
    isLoading: false
  };

  constructor(props) {
    super(props);
    // this.props.navigation.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "backPress":
        BackAndroid.exitApp();
        break;
      case "willDisappear":
        global[GLOBAL_VARIABLES.IS_ENTER_PIN_SCREEN_VISIBLE] = false;
    }
  };

  onForgotPinPress = () => {
    this.props.navigation.navigate(SCREENS.PIN_SETUP_SCREEN, {
      resetPin: true
    });
  };

  verifyPin = async pin => {
    if (pin.length != 4) {
      return showSnackbar({
        text: "Please enter 4 digit pin"
      });
    }
    this.setState({
      isLoading: true
    });
    try {
      await verifyPin({ pin });
      this.setState({
        isLoading: false
      });

      this.props.navigation.dismissModal({
        animationType: "none"
      });
    } catch (e) {
      this.pinInput.clearPin();
      showSnackbar({
        text: e.message
      });
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <PinInput
          ref={ref => (this.pinInput = ref)}
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
