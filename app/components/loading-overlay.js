import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { colors } from "../theme";

const styles = StyleSheet.create({
  overlayStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)"
  }
});

const LoadingOverlay = () => (
  <View style={styles.overlayStyle}>
    <ActivityIndicator color={colors.mainBlue} />
  </View>
);

export default LoadingOverlay;
