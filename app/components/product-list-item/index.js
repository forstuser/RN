import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { openBillsPopUp } from "../../navigation";

import { MAIN_CATEGORY_IDS } from "../../constants";

import ProductType1 from "./product-list-item-type-1";
import ProductType2 from "./product-list-item-type-2";
import ProductType3 from "./product-list-item-type-3";

const viewBillIcon = require("../../images/ic_ehome_view_bill.png");

const ProductListItem = ({
  product,
  onPress,
  navigator,
  hideViewBillBtn = false
}) => {
  const ViewBillButton = ({ onPress }) => {
    if (product.copies && product.copies.length > 0 && !hideViewBillBtn) {
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
          <Text style={styles.viewBillText}>
            VIEW{" "}
            {product.masterCategoryId == MAIN_CATEGORY_IDS.PERSONAL ||
            product.masterCategoryId == MAIN_CATEGORY_IDS.OTHERS
              ? "DOC"
              : "BILL"}
          </Text>
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
    case MAIN_CATEGORY_IDS.ELECTRONICS:
    case MAIN_CATEGORY_IDS.AUTOMOBILE:
      return (
        <View style={styles.container}>
          <ViewBillButton />
          <ProductType1 onPress={openProductScreen} product={product} />
        </View>
      );
    case MAIN_CATEGORY_IDS.PERSONAL:
      return (
        <View style={styles.container}>
          <ProductType3 product={product} />
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <ViewBillButton />
          <ProductType2 product={product} />
        </View>
      );
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
