import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity
} from "react-native";
import { Navigation } from "react-native-navigation";

import Text from "../elements/text";
import { colors } from "../theme";

const showSnackbar = ({ text = "", autoDismissTimerSec = 5 }) => {
  Navigation.dismissInAppNotification();
  return Navigation.showInAppNotification({
    screen: "InAppNotification",
    passProps: {
      text: text
    },
    position: "bottom", // 'top' or 'bottom',
    autoDismissTimerSec: autoDismissTimerSec
  });
};

class Snackbar extends React.Component {
  render() {
    const { text, navigator } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <Text weight="Medium" style={styles.text}>
            {text}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.okBtn}
          onPress={() => {
            navigator.dismissInAppNotification();
          }}
        >
          <Text
            weight="Bold"
            style={{ fontSize: 16, color: colors.pinkishOrange }}
          >
            OK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    maxWidth: 400,
    backgroundColor: "#323232",
    padding: 0,
    alignItems: "center"
  },
  textWrapper: {
    padding: 16,
    flex: 1,
    justifyContent: "center"
  },
  text: {
    fontSize: 16,
    color: "#fff"
  },
  okBtn: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Snackbar;
export { showSnackbar };
