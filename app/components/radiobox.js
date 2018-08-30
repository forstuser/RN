import React from "react";
import { View } from "react-native";
import { colors } from "../theme";

export default ({ isChecked, style = {} }) => (
  <View
    style={[
      {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: isChecked ? colors.pinkishOrange : colors.secondaryText
      },
      style
    ]}
  >
    {isChecked ? (
      <View
        style={[
          {
            width: 15,
            height: 15,
            borderRadius: 8,
            backgroundColor: colors.pinkishOrange
          }
        ]}
      />
    ) : (
      <View />
    )}
  </View>
);
