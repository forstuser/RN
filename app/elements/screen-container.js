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
      Dimensions.get("window").height - (Platform.OS == "android" ? 80 : 49)
  }
});

const ScreenContainer = ({ children, style = {}, bottomTabs = false }) => (
  <View
    style={[
      styles.containerStyle,
      bottomTabs ? styles.withBottomTabs : {},
      style
    ]}
  >
    {children}
  </View>
);

export default ScreenContainer;
