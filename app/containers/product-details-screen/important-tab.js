import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";

import call from "react-native-phone-call";
import moment from "moment";

import { Text, Button, ScreenContainer } from "../../elements";

import { colors } from "../../theme";
import Collapsible from "../../components/collapsible";
import KeyValueItem from "../../components/key-value-item";

class ImportantTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      product: {}
    };
  }

  render() {
    const { product } = this.props;
    const {
      warrantyDetails,
      insuranceDetails,
      amcDetails,
      repairBills
    } = product;

    const ViewBillRow = ({ date }) => (
      <TouchableOpacity style={{ flex: 1 }}>
        <KeyValueItem
          KeyComponent={() => (
            <Text style={{ flex: 1, color: colors.pinkishOrange }}>{date}</Text>
          )}
          ValueComponent={() => (
            <Text
              weight="Bold"
              style={{
                color: colors.pinkishOrange
              }}
            >
              View
            </Text>
          )}
        />
      </TouchableOpacity>
    );

    return (
      <ScrollView>
        <Collapsible headerText="Warranty Details">
          <ViewBillRow
            date={moment(warrantyDetails[0].expiryDate).format("MMM YYYY")}
          />
          <KeyValueItem
            keyText="Expiry Date"
            valueText={moment(warrantyDetails[0].expiryDate).format(
              "DD MMM YYYY"
            )}
          />
          <KeyValueItem keyText="Warranty Type" valueText="" />
          <KeyValueItem
            keyText="Seller"
            valueText={warrantyDetails[0].sellers.sellerName}
          />
          <KeyValueItem
            keyText="Seller Contact"
            ValueComponent={() => (
              <Text
                onPress={() =>
                  call({
                    number: String(warrantyDetails[0].sellers.contact)
                  }).catch(e => Alert.alert(e.message))
                }
                weight="Medium"
                style={{
                  flex: 1,
                  textAlign: "right",
                  textDecorationLine: "underline",
                  color: colors.tomato
                }}
              >
                {warrantyDetails[0].sellers.contact}
              </Text>
            )}
          />
        </Collapsible>
        <Collapsible headerText="Insurance Details">
          <ViewBillRow
            date={moment(insuranceDetails[0].expiryDate).format("MMM YYYY")}
          />
          <KeyValueItem
            keyText="Expiry Date"
            valueText={moment(insuranceDetails[0].expiryDate).format(
              "DD MMM YYYY"
            )}
          />
          <KeyValueItem
            keyText="Policy No."
            valueText={insuranceDetails[0].policyNo || ""}
          />
          <KeyValueItem
            keyText="Premium Amount"
            valueText={insuranceDetails[0].premiumAmount || ""}
          />
          <KeyValueItem
            keyText="Amount Insured"
            valueText={insuranceDetails[0].amountInsured || ""}
          />
          <KeyValueItem
            keyText="Seller"
            valueText={insuranceDetails[0].sellers.sellerName || ""}
          />
          <KeyValueItem
            keyText="Seller Contact"
            ValueComponent={() => (
              <Text
                onPress={() =>
                  call({
                    number: String(insuranceDetails[0].sellers.contact)
                  }).catch(e => Alert.alert(e.message))
                }
                weight="Medium"
                style={{
                  flex: 1,
                  textAlign: "right",
                  textDecorationLine: "underline",
                  color: colors.tomato
                }}
              >
                {insuranceDetails[0].sellers.contact}
              </Text>
            )}
          />
        </Collapsible>
        <Collapsible headerText="AMC Details">
          <ViewBillRow
            date={moment(amcDetails[0].expiryDate).format("MMM YYYY")}
          />
          <KeyValueItem
            keyText="Expiry Date"
            valueText={moment(amcDetails[0].expiryDate).format("DD MMM YYYY")}
          />
          <KeyValueItem
            keyText="Policy No."
            valueText={amcDetails[0].policyNo || ""}
          />
          <KeyValueItem
            keyText="Premium Amount"
            valueText={amcDetails[0].premiumAmount || ""}
          />
          <KeyValueItem
            keyText="Amount Insured"
            valueText={amcDetails[0].amountInsured || ""}
          />
          <KeyValueItem
            keyText="Seller"
            valueText={amcDetails[0].sellers.sellerName || ""}
          />
          <KeyValueItem
            keyText="Seller Contact"
            ValueComponent={() => (
              <Text
                onPress={() =>
                  call({
                    number: String(amcDetails[0].sellers.contact)
                  }).catch(e => Alert.alert(e.message))
                }
                weight="Medium"
                style={{
                  flex: 1,
                  textAlign: "right",
                  textDecorationLine: "underline",
                  color: colors.tomato
                }}
              >
                {amcDetails[0].sellers.contact}
              </Text>
            )}
          />
        </Collapsible>
        <Collapsible headerText="Repair/Service">
          <ViewBillRow
            date={moment(repairBills[0].purchaseDate).format("MMM YYYY")}
          />
          <KeyValueItem
            keyText="Repair Date"
            valueText={moment(repairBills[0].purchaseDate).format(
              "DD MMM YYYY"
            )}
          />
          <KeyValueItem
            keyText="Premium Amount"
            valueText={repairBills[0].premiumAmount}
          />
          <KeyValueItem
            keyText="Seller"
            valueText={repairBills[0].sellers.sellerName || ""}
          />
          <KeyValueItem
            keyText="Seller Contact"
            ValueComponent={() => (
              <Text
                onPress={() =>
                  call({
                    number: String(repairBills[0].sellers.contact)
                  }).catch(e => Alert.alert(e.message))
                }
                weight="Medium"
                style={{
                  flex: 1,
                  textAlign: "right",
                  textDecorationLine: "underline",
                  color: colors.tomato
                }}
              >
                {repairBills[0].sellers.contact}
              </Text>
            )}
          />
        </Collapsible>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: 100,
    height: 100
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30
  }
});

export default ImportantTab;
