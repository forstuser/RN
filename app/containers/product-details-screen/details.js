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

class Details extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { product } = this.props;

    const metaUnderName = getProductMetasString(product.metaData);

    let amountBreakdownOptions = [
      <View style={{ width: "100%" }}>
        <KeyValueItem
          keyText={I18n.t("product_details_screen_cost_breakdown_product")}
          valueText={`₹ ${product.value}`}
        />
      </View>
    ];

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

    const ViewBillButton = ({ onPress }) => {
      if (product.copies && product.copies.length > 0) {
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
              {I18n.t("product_details_screen_view_bill_btn")}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => this.uploadBillOptions.show()}
            style={styles.viewBillBtn}
          >
            <UploadBillOptions
              ref={o => (this.uploadBillOptions = o)}
              navigator={this.props.navigator}
            />
            <Text style={styles.viewBillText}>
              {I18n.t("product_details_screen_upload_bill_btn")}
            </Text>
          </TouchableOpacity>
        );
      }
    };

    return (
      <View style={styles.container}>
        <ViewBillButton />
        <Image
          style={styles.image}
          source={{ uri: API_BASE_URL + "/" + product.cImageURL + "1" }}
        />
        <Text weight="Bold" style={styles.name}>
          {product.productName}
        </Text>
        {(product.copies == null || product.copies.length == 0) && (
          <Text weight="Bold" style={styles.noBillMsg}>
            {I18n.t("product_details_screen_no_bill_msg")}
          </Text>
        )}
        <Text weight="Medium" style={styles.metaUnderName}>
          {metaUnderName}
        </Text>
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
  },
  container: {
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100
  },
  name: {
    fontSize: 24
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
