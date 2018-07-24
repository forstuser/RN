import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import I18n from "../i18n";
import { colors, defaultStyles } from "../theme";
import { Text, Button } from "../elements";

const ViewMore = ({ height, onPress, color }) => (
  <TouchableOpacity style={styles.viewBtn} onPress={onPress}>
    <View
      collapsable={false}
      style={{
        backgroundColor: color || colors.pinkishOrange,
        height: 36,
        width: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        paddingTop: 3,
        overflow: "hidden"
      }}
    >
      <Icon
        style={height == "less" ? {} : { marginTop: -3 }}
        name={height == "less" ? "ios-arrow-down" : "ios-arrow-up"}
        size={28}
        color="#fff"
      />
    </View>
    <Text
      weight="Medium"
      style={{ color: color || colors.pinkishOrange, fontSize: 12 }}
    >
      {height == "less"
        ? I18n.t("component_items_view_more")
        : I18n.t("component_items_view_less")}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  list: {
    width: "100%",
    minHeight: 50,
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  listLessHeight: {
    maxHeight: 131
  },
  viewBtn: {
    alignItems: "center",
    marginTop: -20,
    elevation: 3
  }
});

export default ViewMore;
