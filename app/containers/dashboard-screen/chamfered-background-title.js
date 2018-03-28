import React from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "../../elements";
import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from "react-native-svg";

const Title = ({ gradientColors = ["#ff652e", "#ffa33c"], text = "" }) => (
  <View style={styles.container}>
    <Svg style={styles.svg}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="170" y2="0">
          <Stop offset="0" stopColor={gradientColors[0]} stopOpacity="1" />
          <Stop offset="1" stopColor={gradientColors[1]} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path
        id="svg_3"
        d="
          M0,40
          v-30
          a10,10 0 0 1 10 -10
          h135
          a10,10 0 0 1 5 5
          l10,35
          Z"
        fill="url(#grad)"
      />
    </Svg>
    <View style={styles.textContainer}>
      <Text weight="Bold" style={{ color: "#fff" }}>
        {text.toUpperCase()}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 40,
    marginTop: 20
  },
  svg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  textContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 14
  }
});

export default Title;
