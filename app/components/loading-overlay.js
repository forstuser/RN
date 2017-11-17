import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { colors } from "../theme";
import Spinner from "react-native-loading-spinner-overlay";

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

const LoadingOverlay = ({ visible }) => (
  <Spinner
    color={colors.mainBlue}
    animation="fade"
    visible={visible}
    overlayColor="rgba(255,255,255,0.8)"
  />
);

export default LoadingOverlay;
