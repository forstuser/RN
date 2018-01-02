import React from "react";
import { StyleSheet, View, ActivityIndicator, Modal } from "react-native";
import { colors } from "../theme";
import Spinner from "react-native-loading-spinner-overlay";
import { Text } from "../elements";

const LoadingOverlay = ({ visible, text = "" }) => {
  if (visible) {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={colors.mainBlue} />
        <Text weight="Bold">{text}</Text>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 1000
  }
});

export default LoadingOverlay;
