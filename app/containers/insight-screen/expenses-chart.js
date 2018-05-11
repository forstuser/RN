import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "../../elements";
import { colors } from "../../theme";
import {
  VictoryAxis,
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryPortal,
  VictoryLabel
} from "victory-native";

const bgColors = {
  primary: [colors.mainBlue, colors.aquaBlue],
  secondary: [colors.pinkishOrange, colors.tomato]
};

const InsightChart = ({
  colors = [
    "#00B7FF",
    "#695FF8",
    "#CE2BF9",
    "#FF31E2",
    "#FF4F53",
    "#FFD300",
    "#A1F200",
    "#00E2B8"
  ],
  chartData = []
}) => (
  <View collapsable={false}  style={styles.container}>
    <VictoryPie
      colorScale={colors}
      height={300}
      width={300}
      data={chartData}
      animate={{
        duration: 300
      }}
      labels={() => ``}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  }
});
export default InsightChart;
