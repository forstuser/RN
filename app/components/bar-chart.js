import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
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

const BarChart = ({
  timeSpanText = "Nov 14 - 20 Nov",
  filterText = "Last 7 Days",
  color = "primary",
  data = [
    { time: "Nov 1", spend: 3 },
    { time: "Nov 2", spend: 16 },
    { time: "Nov 3", spend: 1422 },
    { time: "Nov 4", spend: 190 },
    { time: "Nov 5", spend: 14 },
    { time: "Nov 6", spend: 19 },
    { time: "Nov 7", spend: 190 }
  ]
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.timeSpan}>{timeSpanText}</Text>
      <Text style={styles.filterText}>{filterText}</Text>
    </View>
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={{ x: 20, y: 5 }}
      padding={{ left: 40, top: 50, right: 40, bottom: 40 }}
    >
      <VictoryAxis style={{ tickLabels: { fontSize: 9 } }} />
      <VictoryAxis
        dependentAxis
        style={{ tickLabels: { fontSize: 9 } }}
        tickFormat={tick => `₹${Math.round(tick)}`}
        tickLabelComponent={
          <VictoryPortal>
            <VictoryLabel />
          </VictoryPortal>
        }
      />
      <VictoryBar
        alignment="start"
        data={data}
        x="time"
        y="spend"
        style={{ data: { fill: "#c43a31" } }}
        animate={{
          duration: 1000,
          onLoad: { duration: 1000 }
        }}
      />
    </VictoryChart>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff"
  },
  upperContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  nameAndIcon: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5
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
