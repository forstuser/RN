import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";

import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import KeyValueItem from "../../components/key-value-item";

import { colors } from "../../theme";
import { getProductMetasString } from "../../utils";

const dropdownIcon = require("../../images/ic_dropdown_arrow.png");

class Details extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { product } = this.props;

    const metaUnderName = getProductMetasString(product.metaData);

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

    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: API_BASE_URL + "/" + product.cImageURL + "1" }}
        />
        <Text weight="Bold" style={styles.name}>
          {product.productName}
        </Text>
        <Text weight="Medium" style={styles.metaUnderName}>
          {metaUnderName}
        </Text>
        <Text weight="Medium" style={styles.totalText}>
          Total
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
          cancelButtonIndex={5}
          options={[
            <View style={{ width: "100%" }}>
              <KeyValueItem
                keyText="Product Cost"
                valueText={`₹ ${product.value}`}
              />
            </View>,
            <View style={{ width: "100%" }}>
              <KeyValueItem
                keyText="Warranty"
                valueText={`₹ ${warrantyAmount}`}
              />
            </View>,
            <View style={{ width: "100%" }}>
              <KeyValueItem
                keyText="Insurance"
                valueText={`₹ ${insuranceAmount}`}
              />
            </View>,
            <View style={{ width: "100%" }}>
              <KeyValueItem keyText="Repairs" valueText={`₹ ${repairAmount}`} />
            </View>,
            <View style={{ width: "100%" }}>
              <KeyValueItem keyText="Total" valueText={`₹ ${totalAmount}`} />
            </View>,
            "Close"
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
