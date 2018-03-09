import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import moment from "moment";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import I18n from "../../../i18n";
import { API_BASE_URL } from "../../../api";
import { Text, Button, ScreenContainer } from "../../../elements";
import KeyValueItem from "../../../components/key-value-item";

import { openBillsPopUp } from "../../../navigation";

import { colors } from "../../../theme";
import { getProductMetasString } from "../../../utils";

import UploadBillOptions from "../../../components/upload-bill-options";

const dropdownIcon = require("../../../images/ic_dropdown_arrow.png");
const viewBillIcon = require("../../../images/ic_ehome_view_bill.png");

import ViewBillButton from "../view-bill-button";
import { MAIN_CATEGORY_IDS } from "../../../constants";

const headerBg = require("../../../images/product_card_header_bg.png");

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      product,
      navigator,
      activeTabIndex = 0,
      onTabChange,
      showCustomerCareTab = false
    } = this.props;
    let productName = product.productName;
    if (!productName) {
      productName = product.categoryName;
    }

    const metaUnderName = getProductMetasString(product.metaData);

    let amountBreakdownOptions = [];

    if (product.categoryId != 664) {
      amountBreakdownOptions.push(
        <View style={{ width: "100%" }}>
          <KeyValueItem
            keyText={I18n.t("product_details_screen_cost_breakdown_product")}
            valueText={`₹ ${product.value}`}
          />
        </View>
      );
    }

    product.warrantyDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        <View style={{ width: "100%" }}>
          <KeyValueItem
            keyText={
              I18n.t("product_details_screen_cost_breakdown_warranty") + date
            }
            valueText={`₹ ${item.premiumAmount}`}
          />
        </View>
      );
    });

    product.insuranceDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        <View style={{ width: "100%" }}>
          <KeyValueItem
            keyText={
              I18n.t("product_details_screen_cost_breakdown_insurance") + date
            }
            valueText={`₹ ${item.premiumAmount}`}
          />
        </View>
      );
    });

    product.amcDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        <View style={{ width: "100%" }}>
          <KeyValueItem
            keyText={I18n.t("product_details_screen_cost_breakdown_amc") + date}
            valueText={`₹ ${item.premiumAmount}`}
          />
        </View>
      );
    });

    product.repairBills.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        <View style={{ width: "100%" }}>
          <KeyValueItem
            keyText={
              I18n.t("product_details_screen_cost_breakdown_repairs") + date
            }
            valueText={`₹ ${item.premiumAmount}`}
          />
        </View>
      );
    });

    const warrantyAmount = product.warrantyDetails.reduce(
      (total, item) => total + item.premiumAmount,
      0
    );
    const insuranceAmount = product.insuranceDetails.reduce(
      (total, item) => total + item.premiumAmount,
      0
    );
    const amcAmount = product.amcDetails.reduce(
      (total, item) => total + item.premiumAmount,
      0
    );
    const repairAmount = product.repairBills.reduce(
      (total, item) => total + item.premiumAmount,
      0
    );

    const totalAmount =
      product.value +
      warrantyAmount +
      insuranceAmount +
      amcAmount +
      repairAmount;

    amountBreakdownOptions.push(
      <View style={{ width: "100%" }}>
        <KeyValueItem
          keyText={I18n.t("product_details_screen_cost_breakdown_total")}
          valueText={`₹ ${totalAmount}`}
        />
      </View>
    );

    let imageSource = { uri: API_BASE_URL + "/" + product.cImageURL + "0" };
    if (
      product.masterCategoryId == MAIN_CATEGORY_IDS.OTHERS &&
      product.copies &&
      product.copies.length > 0
    ) {
      imageSource = { uri: API_BASE_URL + product.copies[0].copyUrl };
    }

    return (
      <View style={styles.container}>
        <View style={styles.upparHalf}>
          <Image style={styles.bg} source={headerBg} resizeMode="cover" />
          <Image
            style={styles.image}
            source={imageSource}
            resizeMode="contain"
          />
        </View>
        <View style={styles.lowerHalf}>
          <View style={styles.lowerHalfInner}>
            {product.categoryId != 664 && (
              <ViewBillButton product={product} navigator={navigator} />
            )}
            <Text weight="Bold" style={styles.name}>
              {productName}
            </Text>
            <Text weight="Bold" style={styles.brandAndModel}>
              {product.brand ? product.brand.name : ""}
              {product.brand && product.model ? "/" : ""}
              {product.model ? product.model : null}
            </Text>
            <TouchableOpacity
              onPress={() => this.priceBreakdown.show()}
              style={styles.totalContainer}
            >
              <Text weight="Bold" style={styles.totalAmount}>
                ₹ {totalAmount}
              </Text>
              <Image style={styles.dropdownIcon} source={dropdownIcon} />
            </TouchableOpacity>
            <ActionSheet
              ref={o => (this.priceBreakdown = o)}
              cancelButtonIndex={amountBreakdownOptions.length}
              options={[
                ...amountBreakdownOptions,
                I18n.t("product_details_screen_cost_breakdown_close")
              ]}
            />
            <View style={styles.tabs}>
              {[
                I18n.t("product_details_screen_tab_customer_care"),
                I18n.t("product_details_screen_tab_all_info"),
                I18n.t("product_details_screen_tab_important")
              ].map((tab, index) => {
                if (!showCustomerCareTab && index == 0) {
                  return null;
                }
                return (
                  <TouchableOpacity
                    onPress={() => onTabChange(index)}
                    key={index}
                    style={[styles.tab]}
                  >
                    <Text
                      numberOfLines={1}
                      weight="Bold"
                      style={[
                        styles.tabText,
                        index == activeTabIndex ? styles.activeTabText : {}
                      ]}
                    >
                      {tab}
                    </Text>
                    <View
                      style={
                        index == activeTabIndex ? styles.activeIndicator : {}
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  upparHalf: {
    backgroundColor: "#fff",
    height: 216,
    width: "100%",
    alignItems: "center"
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  },
  image: {
    marginTop: 60,
    width: 100,
    height: 70
  },
  lowerHalf: {
    marginTop: -65,
    width: "100%",
    paddingHorizontal: 16
  },
  lowerHalfInner: {
    backgroundColor: "#fff",
    padding: 10,
    paddingBottom: 0,
    borderRadius: 3,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },

  name: {
    fontSize: 18,
    marginRight: 85
  },
  brandAndModel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 8
  },
  totalContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  totalAmount: {
    fontSize: 18
  },
  dropdownIcon: {
    width: 24,
    height: 24
  },
  tabs: {
    marginTop: 15,
    height: 40,
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row"
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#fff",
    flex: 1
  },
  tabText: {
    color: colors.lighterText,
    fontSize: 11
  },
  activeTabText: {
    fontWeight: "500",
    color: colors.mainBlue
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.mainBlue
  }
});

export default Header;
