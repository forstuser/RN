import React from "react";
import {
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  View
} from "react-native";

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
    flex: 1,
    backgroundColor: "#ffffff"
  }
});

const ScreenContainer = ({ children, style = {} }) => (
  <View behavior="padding" style={[styles.containerStyle, style]}>
    {children}
  </View>
);

export default ScreenContainer;
