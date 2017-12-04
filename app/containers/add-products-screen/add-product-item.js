import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { openBillsPopUp } from "../../navigation";

const AddProductItem = ({ item }) => {
  let icon = require("../../images/ic_comingup_bill.png");
  let text = "Gotta a Car! Why not add it to Your eHome";
  let subTitle = "";
  let sidebarTitle = "";
  let sidebarSubTitle = "";

  switch (item) {
    default:
  }
  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={icon} />
      <View style={styles.centerContainer}>
        <Text weight="Medium" style={styles.title}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderColor: "#eaeaea",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 65
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16
  },
  centerContainer: {
    flex: 1
  },
  title: {
    fontSize: 14,
    color: colors.mainText,
    marginBottom: 2
  },
  subTitle: {
    fontSize: 12,
    color: colors.secondaryText
  }
});
export default AddProductItem;
