import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors, defaultStyles } from "../../theme";
import { API_BASE_URL } from "../../api";
import { openBillsPopUp } from "../../navigation";
import UploadBillOptions from "../../components/upload-bill-options";

import { MAIN_CATEGORY_IDS, SCREENS } from "../../constants";

import ProductType1 from "./product-list-item-type-1";
import ProductType2 from "./product-list-item-type-2";
import ProductType3 from "./product-list-item-type-3";

const viewBillIcon = require("../../images/ic_ehome_view_bill.png");

const ProductListItem = ({
  product,
  onPress,
  navigator,
  hideViewBillBtn = false,
  hideDirectionsAndCallBtns = false,
  style
}) => {
  const ViewBillButton = ({ onPress }) => {
    if (product.copies && product.copies.length > 0 && !hideViewBillBtn) {
      return (
        <TouchableOpacity
          onPress={() =>
            openBillsPopUp({
              date: product.purchaseDate,
              id: product.id,
              copies: product.copies,
              type:
                product.masterCategoryId == MAIN_CATEGORY_IDS.PERSONAL
                  ? product.productName
                  : "Product"
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
    } else if (!hideViewBillBtn) {
      return (
        <TouchableOpacity
          onPress={() => this.uploadBillOptions.show()}
          style={styles.viewBillBtn}
        >
          <Image style={styles.viewBillIcon} source={viewBillIcon} />
          <Text style={styles.viewBillText}>
            UPLOAD{" "}
            {product.masterCategoryId == MAIN_CATEGORY_IDS.PERSONAL ||
            product.masterCategoryId == MAIN_CATEGORY_IDS.OTHERS
              ? "DOC"
              : "BILL"}
          </Text>
          <UploadBillOptions
            ref={o => (this.uploadBillOptions = o)}
            navigator={navigator}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const openProductScreen = () => {
    navigator.push({
      screen: SCREENS.PRODUCT_DETAILS_SCREEN,
      passProps: {
        productId: product.id
      }
    });
  };
  switch (product.masterCategoryId) {
    case MAIN_CATEGORY_IDS.ELECTRONICS:
    case MAIN_CATEGORY_IDS.AUTOMOBILE:
      return (
        <View collapsable={false}  style={[styles.container, style]}>
          <ProductType1 onPress={openProductScreen} product={product} />
        </View>
      );
    case MAIN_CATEGORY_IDS.PERSONAL:
      return (
        <View collapsable={false}  style={[styles.container, style]}>
          <ProductType3 product={product} onPress={openProductScreen} />
        </View>
      );
    default:
      return (
        <View collapsable={false}  style={[styles.container, style]}>
          <ProductType1
            product={product}
            onPress={openProductScreen}
            hideDirectionsAndCallBtns={hideDirectionsAndCallBtns}
          />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 3,
    ...defaultStyles.card
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
