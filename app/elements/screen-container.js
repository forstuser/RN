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
    flex: 1,
    backgroundColor: "#fff"
  }
});

const ScreenContainer = ({
  children,
  style = {},
  bottomTabs = false,
  navBar = true
}) => (
  <View collapsable={false} 
    style={[
      styles.containerStyle,
      bottomTabs && !navBar ? styles.withBottomTabs : {},
      navBar && !bottomTabs ? styles.withNavBar : {},
      navBar && bottomTabs ? styles.withNavBarAndBottomTabs : {},
      style
    ]}
  >
    {children}
  </View>
);

export default ScreenContainer;
