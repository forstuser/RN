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
    height: Dimensions.get("window").height - 100
  },
  withTabs: {
    height: Dimensions.get("window").height - 80
  }
});

const ScreenContainer = ({ children, style = {}, withTabs = true }) => (
  <View style={[styles.containerStyle, styles.withTabs, style]}>
    {children}
  </View>
);

export default ScreenContainer;
