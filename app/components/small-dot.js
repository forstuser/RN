import React from "react";
import { View, Text } from "react-native";

import { colors } from "../theme";

export default ({ style, visible }) => {
  if (!visible) return null;
  return (
    <View
      style={[
        {
          position: "absolute",
          top: 4,
          right: 4,
          width: 8,
          height: 8,
          backgroundColor: colors.pinkishOrange,
          borderRadius: 4
        },
        style
      ]}
    />
  );
};
