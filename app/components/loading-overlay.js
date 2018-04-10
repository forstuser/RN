import React from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Modal,
  Platform
} from "react-native";
import { colors } from "../theme";
import Spinner from "react-native-loading-spinner-overlay";
import { Text } from "../elements";

const LoadingOverlay = ({ visible, text = "", style = {} }) => {
  if (Platform.OS == "ios" && !visible) return null;
  return (
    <View
      style={[styles.overlay, style, visible ? styles.visible : styles.hidden]}
    >
      <ActivityIndicator size="large" color={colors.mainBlue} />
      <Text weight="Bold">{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 1000,
    elevation: 5
  },
  visible: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  hidden: {
    height: 0
  }
});

export default LoadingOverlay;
