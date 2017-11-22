import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";

import ProductType1 from "./product-list-item-type-1";

const viewBillIcon = require("../../images/ic_ehome_view_bill.png");

const ProductListItem = ({ product, onPress }) => {
  const ViewBillButton = ({ onPress }) => (
    <TouchableOpacity style={styles.viewBillBtn}>
      <Image style={styles.viewBillIcon} source={viewBillIcon} />
      <Text style={styles.viewBillText}>VIEW BILL</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <ViewBillButton />
      <ProductType1 onPress={onPress} product={product} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    marginBottom: 1,
    borderColor: "#eaeaea",
    borderWidth: 1
  },
  viewBillBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    borderColor: colors.pinkishOrange,
    borderWidth: 1,
    height: 18,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3
  },
  viewBillIcon: {
    width: 14,
    height: 14,
    marginRight: 2
  },
  viewBillText: {
    fontSize: 10,
    color: colors.pinkishOrange
  }
});
export default ProductListItem;
