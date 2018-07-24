import React from "react";
import { TouchableOpacity, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const BackBtn = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      height: "100%",
      width: Platform.OS == "ios" ? 34 : 56,
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <Icon
      name={Platform.OS == "ios" ? "ios-arrow-back" : "md-arrow-back"}
      color={Platform.OS == "ios" ? "#007AFF" : "black"}
      size={Platform.OS == "ios" ? 34 : 25}
    />
  </TouchableOpacity>
);

export default BackBtn;
