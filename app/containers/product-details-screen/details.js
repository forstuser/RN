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
import I18n from "../../i18n";
import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import KeyValueItem from "../../components/key-value-item";

import { openBillsPopUp } from "../../navigation";

import { colors } from "../../theme";
import { getProductMetasString } from "../../utils";

import UploadBillOptions from "../../components/upload-bill-options";

const dropdownIcon = require("../../images/ic_dropdown_arrow.png");
const viewBillIcon = require("../../images/ic_ehome_view_bill.png");

import ViewBillButton from "./view-bill-button";

class Details extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { product, navigator } = this.props;

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

    return (
      <View style={styles.container}>
        {product.categoryId != 664 && (
          <ViewBillButton product={product} navigator={navigator} />
        )}
        {product.categoryId == 664 && <View style={{ height: 30 }} />}
        <Image
          style={styles.image}
          source={{ uri: API_BASE_URL + "/" + product.cImageURL + "1" }}
        />
        <Text weight="Bold" style={styles.name}>
          {productName}
        </Text>
        {product.categoryId == 664 && (
          <View style={{ marginVertical: 10 }}>
            <Text
              weight="Bold"
              style={{ fontSize: 18, color: colors.secondaryText }}
            >
              {product.model}
            </Text>
          </View>
        )}
        {(product.copies == null || product.copies.length == 0) &&
          product.categoryId != 664 && (
            <Text weight="Bold" style={styles.noBillMsg}>
              {I18n.t("product_details_screen_no_bill_msg")}
            </Text>
          )}
        {product.categoryId != 664 && (
          <Text weight="Medium" style={styles.metaUnderName}>
            {metaUnderName}
          </Text>
        )}
        <Text weight="Medium" style={styles.totalText}>
          {I18n.t("product_details_screen_total_text")}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100
  },
  name: {
    fontSize: 24,
    paddingHorizontal: 10,
    textAlign: "center"
  },
  noBillMsg: {
    color: "red",
    textAlign: "center",
    padding: 5
  },
  metaUnderName: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18
  },
  totalText: {
    fontSize: 24,
    marginBottom: 7
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  totalAmount: {
    fontSize: 24
  },
  dropdownIcon: {
    width: 24,
    height: 24
  }
});

export default Details;
