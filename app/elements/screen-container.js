import React from "react";
import { Dimensions, StyleSheet, KeyboardAvoidingView } from "react-native";

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
    flex: 1,
    backgroundColor: "#ffffff"
  }
});

const ScreenContainer = ({ children, style = {} }) => (
  <KeyboardAvoidingView
    behavior="padding"
    style={[styles.containerStyle, style]}
  >
    {children}
  </KeyboardAvoidingView>
);

export default ScreenContainer;
