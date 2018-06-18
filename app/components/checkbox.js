import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../theme";

export default ({ isChecked, onPress, style = {} }) => {
  console.log("isChecked: ", isChecked);
  return (
    <View
      style={[
        {
          width: 20,
          height: 20,
          borderRadius: 3,
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          borderColor: isChecked ? colors.pinkishOrange : colors.secondaryText
        },
        style
      ]}
    >
      {isChecked ? (
        <Icon name="md-checkmark" size={16} color={colors.pinkishOrange} />
      ) : (
        <View />
      )}
    </View>
  );
};
