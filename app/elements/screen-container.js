import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  containerStyle: {
    padding: 20,
    height: Dimensions.get("window").height,
    backgroundColor: "#ffffff"
  }
});

const ScreenContainer = ({ children, style = {} }) => (
  <View style={[styles.containerStyle, style]}>{children}</View>
);

export default ScreenContainer;
