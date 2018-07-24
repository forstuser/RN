import React from "react";
import { StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { colors } from "../theme";

export default () => (
  <LinearGradient
    start={{ x: 0.0, y: 0 }}
    end={{ x: 0.0, y: 1 }}
    colors={[colors.mainBlue, colors.aquaBlue]}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}
  >
    <StatusBar backgroundColor={colors.mainBlue} />
  </LinearGradient>
);
