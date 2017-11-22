import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";

const icon = require("../images/ic_processing.png");
const arrow = require("../images/ic_processing_arrow.png");

const EhomeProcessingItems = ({ itemsCount = 0 }) => (
  <TouchableOpacity style={styles.container}>
    <Image style={styles.icon} source={icon} />
    <View style={styles.titleAndItemCount}>
      <Text weight="Medium" style={styles.title}>
        Processing Docs
      </Text>
      <Text style={styles.itemsCount}>{itemsCount} items pending</Text>
    </View>
    <Image style={styles.arrow} source={arrow} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 4,
    borderColor: "#eaeaea",
    borderWidth: 1
  },
  icon: {
    width: 20,
    height: 26,
    marginRight: 16
  },
  titleAndItemCount: {
    flex: 1,
    flexDirection: "column"
  },
  title: {
    fontSize: 14,
    color: colors.mainText
  },
  itemsCount: {
    color: colors.secondaryText,
    fontSize: 12
  },
  arrow: {
    width: 16,
    height: 16
  }
});
export default EhomeProcessingItems;
