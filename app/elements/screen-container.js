import React from "react";
import {
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Platform
} from "react-native";

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
    height: Dimensions.get("window").height,
    backgroundColor: "#fff"
  },
  withBottomTabs: {
    height:
      Dimensions.get("window").height - (Platform.OS == "android" ? 75 : 49)
  },
  withNavBar: {
    height:
      Dimensions.get("window").height - (Platform.OS == "android" ? 75 : 49)
  }
});

const ScreenContainer = ({
  children,
  style = {},
  bottomTabs = false,
  navBar = false
}) => (
  <View
    style={[
      styles.containerStyle,
      bottomTabs && !navBar ? styles.withBottomTabs : {},
      navBar && !bottomTabs ? styles.withNavBar : {},
      style
    ]}
  >
    {children}
  </View>
);

export default ScreenContainer;
