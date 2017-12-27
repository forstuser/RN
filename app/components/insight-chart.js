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

const dropdownIcon = require("../images/ic_dropdown_arrow.png");

const InsightChart = ({
  textColor = "#fff",
  hideXLabels = false,
  timeSpanText = "",
  filterText = "",
  totalSpend = null,
  bgColors = [colors.mainBlue, colors.aquaBlue],
  chartData = [],
  onFiltersPress
}) => {
  let barWidth = 30;
  if (chartData.length > 7) {
    barWidth = 10;
  }
  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      colors={bgColors}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text weight="Bold" style={[styles.timeSpan, { color: textColor }]}>
          {timeSpanText}
        </Text>
        <TouchableOpacity onPress={onFiltersPress} style={styles.filter}>
          <Text weight="Bold" style={[styles.filterText, { color: textColor }]}>
            {filterText}
          </Text>
          <Image
            style={[styles.filterDropdown, { tintColor: textColor }]}
            source={dropdownIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.totalSpendContainer}>
        {totalSpend !== null && (
          <View style={styles.totalSpendInner}>
            <Text style={[styles.totalSpendText, { color: textColor }]}>
              Total Spend{" "}
            </Text>
            <Text
              weight="Bold"
              style={[styles.totalSpendAmount, { color: textColor }]}
            >
              ₹ {totalSpend}
            </Text>
          </View>
        )}
      </View>
      {chartData.length > 0 && (
        <VictoryChart
          domainPadding={{ x: 20, y: 5 }}
          padding={{ left: 40, top: 20, right: 60, bottom: 40 }}
          height={200}
        >
          <VictoryAxis
            style={{
              axis: { stroke: textColor },
              tickLabels: {
                fontSize: 9,
                stroke: "#fff",
                fontWeight: "300",
                fontFamily: "Quicksand-Regular"
              }
            }}
            tickFormat={value => {
              if (hideXLabels) {
                return "";
              }
              return value;
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: textColor },
              tickLabels: {
                fontSize: 9,
                stroke: textColor,
                fontWeight: "300",
                fontFamily: "Quicksand-Regular"
              },
              grid: { stroke: "rgba(255,255,255,0.3)" }
            }}
            tickFormat={value => {
              let displayValue = `₹${Math.round(value)}`;
              if (value > 1000) {
                displayValue = `₹${Math.round(value / 1000)}k`;
              }
              return displayValue;
            }}
          />
          <VictoryBar
            alignment="middle"
            data={chartData}
            style={{
              data: { fill: "#ffffff", width: barWidth, cornerRadius: 4 }
            }}
            animate={{
              duration: 700,
              onLoad: { duration: 700 }
            }}
          />
        </VictoryChart>
      )}
      {chartData.length == 0 && (
        <View style={styles.noDataContainer}>
          <Text weight="Bold" style={[styles.noDataText, { color: textColor }]}>
            No Data for Chart
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

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
    fontSize: 16
  },
  filter: {
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 15,
    height: 30,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  filterDropdown: {
    width: 24,
    height: 24,
    tintColor: "#fff"
  },
  filterText: {
    fontSize: 14
  },
  totalSpendContainer: {
    marginTop: 14,
    height: 32,
    borderColor: "rgba(255,255,255,0.3)",
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  totalSpendInner: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
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