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

const BarChart = ({
  timeSpanText = "Nov 14 - 20 Nov",
  filterText = "Last 7 Days",
  totalSpend = "687.00",
  color = "primary",
  data = [
    { time: "Nov 1", spend: 20 },
    { time: "Nov 2", spend: 30 },
    { time: "Nov 3", spend: 10 },
    { time: "Nov 4", spend: 90 },
    { time: "Nov 5", spend: 30 },
    { time: "Nov 6", spend: 35 },
    { time: "Nov 7", spend: 35 }
  ]
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
        ₹{totalSpend}
      </Text>
    </View>
    <VictoryChart
      domainPadding={{ x: 20, y: 5 }}
      padding={{ left: 30, top: 20, right: 60, bottom: 40 }}
      height={250}
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
        alignment="middle"
        data={data}
        x="time"
        y="spend"
        style={{ data: { fill: "#ffffff" } }}
        animate={{
          duration: 1000,
          onLoad: { duration: 1000 }
        }}
      />
    </VictoryChart>
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
  screenName: {
    fontSize: 18,
    color: colors.secondaryText
  },
  messagesContainer: {},
  messagesIcon: {
    width: 24,
    height: 24
  },
  messagesCountContainer: {
    position: "absolute",
    borderRadius: 8,
    height: 18,
    paddingLeft: 3,
    paddingRight: 3,
    borderColor: "#eee",
    borderWidth: 1,
    top: -2,
    right: -5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  messagesCount: {
    color: colors.tomato,
    fontSize: 12,
    textAlign: "center",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center"
  },
  searchContainer: {
    height: 42,
    backgroundColor: "#eff1f6",
    borderRadius: 21,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingLeft: 15
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 10
  },
  searchText: {
    fontSize: 16,
    color: colors.secondaryText
  }
});
export default BarChart;
