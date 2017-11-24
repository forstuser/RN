import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";
import {
  VictoryAxis,
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
  timeSpanText = "",
  filterText = "",
  totalSpend = "",
  color = "primary",
  chartData = []
}) => (
  <LinearGradient
    start={{ x: 0.0, y: 0.1 }}
    end={{ x: 0.9, y: 0.9 }}
    colors={bgColors[color]}
    style={styles.container}
  >
    <View style={styles.header}>
      <Text weight="Bold" style={styles.timeSpan}>
        {timeSpanText}
      </Text>
      <View style={styles.filter}>
        <Text weight="Bold" style={styles.filterText}>
          {filterText}
        </Text>
      </View>
    </View>
    <View style={styles.totalSpendContainer}>
      <Text style={styles.totalSpendText}>Total Spend </Text>
      <Text weight="Bold" style={styles.totalSpendAmount}>
        ₹ {totalSpend}
      </Text>
    </View>
    {chartData.length > 0 && (
      <VictoryChart
        domainPadding={{ x: 20, y: 5 }}
        padding={{ left: 30, top: 20, right: 60, bottom: 40 }}
        height={200}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "#fff" },
            tickLabels: { fontSize: 9, stroke: "#fff" }
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#fff" },
            tickLabels: { fontSize: 9 },
            grid: { stroke: "rgba(255,255,255,0.3)" }
          }}
          tickFormat={tick => `₹${Math.round(tick)}`}
        />
        <VictoryBar
          alignment="start"
          data={chartData}
          style={{ data: { fill: "#ffffff" } }}
          animate={{
            duration: 1000,
            onLoad: { duration: 1000 }
          }}
        />
      </VictoryChart>
    )}
    {chartData.length == 0 && (
      <View style={styles.noDataContainer}>
        <Text weight="Bold" style={styles.noDataText}>
          Data Not Available
        </Text>
      </View>
    )}
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 6
  },
  header: {
    flexDirection: "row",
    alignItems: "center"
  },
  timeSpan: {
    flex: 1,
    color: "#fff",
    fontSize: 16
  },
  filter: {
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 15,
    height: 30,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12
  },
  filterText: {
    fontSize: 14,
    color: "#fff"
  },
  totalSpendContainer: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    borderColor: "rgba(255,255,255,0.3)",
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  totalSpendText: {
    color: "#fff",
    fontSize: 16
  },
  totalSpendAmount: {
    color: "#fff",
    fontSize: 16
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  noDataText: {
    color: "#fff"
  }
});
export default InsightChart;
