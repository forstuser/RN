import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  Text as NativeText
} from "react-native";
import _ from "lodash";
import moment from "moment";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/Entypo";
import { Navigation } from "react-native-navigation";

import Modal from "react-native-modal";

import { SCREENS } from "../../constants";
import { API_BASE_URL, getProductDetails } from "../../api";
import { Text, Button, ScreenContainer, Image } from "../../elements";

import I18n from "../../i18n";

import { colors } from "../../theme";

import ContactAfterSaleButton from "./after-sale-button";
import KeyValueItem from "../../components/key-value-item";

const insuranceIcon = require("../../images/categories/insurance.png");

import { openBillsPopUp } from "../../navigation";
import ViewBillButton from "./view-bill-button";

class InsuranceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onEditPress = () => {
    const { product } = this.props;
    let insurance = {
      id: null,
      value: 0,
      effectiveDate: "",
      amountInsured: "",
      policyNo: "",
      providerId: null
    };

    if (product.insuranceDetails.length > 0) {
      const productInsurance = product.insuranceDetails[0];
      insurance = {
        id: productInsurance.id,
        value: productInsurance.value,
        effectiveDate: productInsurance.effectiveDate,
        policyNo: productInsurance.policyNo,
        amountInsured: productInsurance.amountInsured
      };

      if (productInsurance.provider) {
        insurance.providerId = productInsurance.provider.id;
      }
    }

    this.props.navigator.push({
      screen: SCREENS.EDIT_INSURANCE_SCREEN,
      passProps: {
        typeId: product.sub_category_id,
        mainCategoryId: product.masterCategoryId,
        categoryId: product.categoryId,
        productId: product.id,
        jobId: product.jobId,
        planName: product.productName,
        insuranceFor: product.model,
        insuranceId: insurance.id,
        value: insurance.value,
        providerId: insurance.providerId,
        effectiveDate: insurance.effectiveDate,
        policyNo: insurance.policyNo,
        amountInsured: insurance.amountInsured,
        copies: product.copies || []
      },
      overrideBackPress: true
    });
  };

  render() {
    const { product, navigator } = this.props;
    let insurance = {
      value: 0,
      effectiveDate: "",
      policyNo: "",
      amountInsured: ""
    };

    if (product.insuranceDetails.length > 0) {
      insurance = {
        value: product.insuranceDetails[0].value,
        effectiveDate: product.insuranceDetails[0].effectiveDate,
        policyNo: product.insuranceDetails[0].policyNo,
        amountInsured: product.insuranceDetails[0].amountInsured
      };
    }

    let imageSource = insuranceIcon;
    if (product.copies && product.copies.length > 0) {
      imageSource = { uri: API_BASE_URL + product.copies[0].copyUrl };
    }

    return (
      <View collapsable={false} style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <ViewBillButton
            collapsable={false}
            product={product}
            navigator={navigator}
            docType="Insurance"
          />
          <Image
            style={styles.image}
            source={{ uri: API_BASE_URL + "/" + product.cImageURL }}
          />
          <Text weight="Bold" style={styles.name}>
            {product.productName}
          </Text>
          <Text weight="Bold" style={styles.for}>
            {product.model}
          </Text>
          <Text weight="Bold" style={styles.amount}>
            ₹ {insurance.value}
          </Text>
          <TouchableOpacity
            onPress={this.onEditPress}
            style={{
              marginTop: 20,
              width: "100%",
              backgroundColor: "#EBEBEB"
            }}
          >
            <KeyValueItem
              KeyComponent={() => (
                <Text
                  weight="Bold"
                  style={{
                    flex: 1,
                    color: colors.mainText,
                    fontSize: 16
                  }}
                >
                  General Info
                </Text>
              )}
              ValueComponent={() => (
                <Text
                  weight="Bold"
                  style={{
                    textAlign: "right",
                    flex: 1,
                    color: colors.pinkishOrange
                  }}
                >
                  EDIT
                </Text>
              )}
            />
          </TouchableOpacity>
          <KeyValueItem keyText="Name" valueText={product.productName} />
          <KeyValueItem keyText="For" valueText={product.model} />
          <KeyValueItem keyText="Type" valueText={product.sub_category_name} />
          <KeyValueItem
            keyText="Effective Date"
            valueText={
              insurance.effectiveDate &&
              moment(insurance.effectiveDate).format("MMM DD, YYYY")
            }
          />
          <KeyValueItem keyText="Policy No" valueText={insurance.policyNo} />
          <KeyValueItem
            keyText="Coverage"
            valueText={insurance.amountInsured}
          />
        </ScrollView>
        <View collapsable={false} style={styles.contactAfterSalesBtn}>
          <ContactAfterSaleButton
            product={product}
            navigator={this.props.navigator}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    alignItems: "center"
  },
  image: {
    width: 310,
    height: 100,
    alignSelf: "center",
    margin: 16
  },
  name: {
    fontSize: 24
  },
  for: {
    fontSize: 16,
    color: colors.secondaryText,
    marginVertical: 10
  },
  amount: {
    fontSize: 24
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
  totalAmount: {
    fontSize: 24
  },
  contactAfterSalesBtn: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16
  }
});

export default InsuranceCard;
