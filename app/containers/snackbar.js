import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";

import Snackbar from "react-native-snackbar";

import I18n from "../i18n";
import { Navigation } from "react-native-navigation";
import { SCREENS } from "../constants";
import Text from "../elements/text";
import { colors } from "../theme";

const showSnackbar = ({
  text = "",
  autoDismissTimerSec = 2,
  isOnTabsScreen = false
}) => {
  hideSnackbar();

  if (Platform.OS == "android" && isOnTabsScreen) {
    return Navigation.showSnackbar({
      text,
      actionText: "OK",
      actionId: "fabClicked", // Mandatory if you've set actionText
      actionColor: colors.pinkishOrange, // optional
      textColor: "#fff", // optional
      backgroundColor: "#323232", // optional
      duration: autoDismissTimerSec > 5 ? "long" : "short" // default is `short`. Available options: short, long, indefinite
    });
  } else {
    return Navigation.showInAppNotification({
      screen: SCREENS.SNACKBAR_SCREEN,
      passProps: {
        text: text
      },
      position: "bottom", // 'top' or 'bottom',
      autoDismissTimerSec: autoDismissTimerSec
    });
  }
};

const hideSnackbar = () => {
  Navigation.dismissInAppNotification();
};

class SnackbarView extends React.Component {
  render() {
    const { text, navigator } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <Text weight="Medium" style={styles.text}>
            {text}
          </Text>
        </View>
        <TouchableOpacity style={styles.okBtn} onPress={hideSnackbar}>
          <Text
            weight="Bold"
            style={{ fontSize: 16, color: colors.pinkishOrange }}
          >
            {I18n.t("add_edit_force_ok")}
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

export default SnackbarView;
export { showSnackbar, hideSnackbar };
