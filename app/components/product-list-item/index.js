import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { openBillsPopUp } from "../../navigation";

import ProductType1 from "./product-list-item-type-1";
import ProductType2 from "./product-list-item-type-2";
import ProductType3 from "./product-list-item-type-3";

const viewBillIcon = require("../../images/ic_ehome_view_bill.png");

const ProductListItem = ({ product, onPress, navigator }) => {
  const ViewBillButton = ({ onPress }) => {
    if (product.copies.length > 0) {
      return (
        <TouchableOpacity
          onPress={() =>
            openBillsPopUp({
              date: product.purchaseDate,
              id: product.id,
              copies: product.copies
            })
          }
          style={styles.viewBillBtn}
        >
          <Image style={styles.viewBillIcon} source={viewBillIcon} />
          <Text style={styles.viewBillText}>VIEW BILL</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const openProductScreen = () => {
    navigator.push({
      screen: "ProductDetailsScreen",
      passProps: {
        productId: product.id
      }
    });
  };
  switch (product.masterCategoryId) {
    case 2:
    case 3:
      return (
        <View style={styles.container}>
          <ViewBillButton />
          <ProductType1 onPress={openProductScreen} product={product} />
        </View>
      );
    case 1:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return (
        <View style={styles.container}>
          <ViewBillButton />
          <ProductType2 product={product} />
        </View>
      );
    case 10:
      return (
        <View style={styles.container}>
          <ProductType3 product={product} />
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: "#eaeaea",
    borderWidth: 1
  },
  viewBillBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    borderColor: colors.pinkishOrange,
    borderWidth: 2,
    height: 20,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
    zIndex: 2
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
