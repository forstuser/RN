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

import { openBillsPopUp } from "../../navigation";

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

    const ViewBillRow = ({ expiryDate, purchaseDate, docType, copies }) => (
      <TouchableOpacity
        onPress={() =>
          openBillsPopUp({
            date: purchaseDate,
            id: docType,
            copies: copies
          })
        }
        style={{ flex: 1 }}
      >
        <KeyValueItem
          KeyComponent={() => (
            <Text style={{ flex: 1, color: colors.pinkishOrange }}>
              {moment(expiryDate).format("MMM YYYY")}
            </Text>
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
          {warrantyDetails.length > 0 && (
            <View>
              {warrantyDetails.map(warranty => (
                <View>
                  <ViewBillRow
                    expiryDate={warranty.expiryDate}
                    purchaseDate={warranty.purchaseDate}
                    docType="Warranty"
                    copies={warranty.copies}
                  />
                  <KeyValueItem
                    keyText="Expiry Date"
                    valueText={moment(warranty.expiryDate).format(
                      "DD MMM YYYY"
                    )}
                  />
                  <KeyValueItem keyText="Warranty Type" valueText="" />
                  {warranty.sellers != null && (
                    <KeyValueItem
                      keyText="Seller"
                      valueText={warranty.sellers.sellerName}
                    />
                  )}
                  {warranty.sellers != null && (
                    <KeyValueItem
                      keyText="Seller Contact"
                      ValueComponent={() => (
                        <Text
                          onPress={() =>
                            call({
                              number: String(warranty.sellers.contact)
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
                          {warranty.sellers.contact}
                        </Text>
                      )}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
          {warrantyDetails.length == 0 && (
            <Text weight="Bold" style={{ textAlign: "center", padding: 16 }}>
              No info available
            </Text>
          )}
        </Collapsible>

        <Collapsible headerText="Insurance Details">
          {insuranceDetails.length > 0 && (
            <View>
              {insuranceDetails.map(insurance => (
                <View>
                  <ViewBillRow
                    expiryDate={insurance.expiryDate}
                    purchaseDate={insurance.purchaseDate}
                    docType="Insurance"
                    copies={insurance.copies}
                  />
                  <KeyValueItem
                    keyText="Expiry Date"
                    valueText={moment(insurance.expiryDate).format(
                      "DD MMM YYYY"
                    )}
                  />
                  <KeyValueItem
                    keyText="Policy No."
                    valueText={insurance.policyNo || ""}
                  />
                  <KeyValueItem
                    keyText="Premium Amount"
                    valueText={insurance.premiumAmount || ""}
                  />
                  <KeyValueItem
                    keyText="Amount Insured"
                    valueText={insurance.amountInsured || ""}
                  />
                  {insurance.sellers != null && (
                    <KeyValueItem
                      keyText="Seller"
                      valueText={insurance.sellers.sellerName || ""}
                    />
                  )}
                  {insurance.sellers != null && (
                    <KeyValueItem
                      keyText="Seller Contact"
                      ValueComponent={() => (
                        <Text
                          onPress={() =>
                            call({
                              number: String(insurance.sellers.contact)
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
                          {insurance.sellers.contact}
                        </Text>
                      )}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
          {insuranceDetails.length == 0 && (
            <Text weight="Bold" style={{ textAlign: "center", padding: 16 }}>
              No info available
            </Text>
          )}
        </Collapsible>

        <Collapsible headerText="AMC Details">
          {amcDetails.length > 0 && (
            <View>
              {amcDetails.map(amc => (
                <View>
                  <ViewBillRow
                    expiryDate={amc.expiryDate}
                    purchaseDate={amc.purchaseDate}
                    docType="AMC"
                    copies={amc.copies}
                  />
                  <KeyValueItem
                    keyText="Expiry Date"
                    valueText={moment(amc.expiryDate).format("DD MMM YYYY")}
                  />
                  <KeyValueItem
                    keyText="Policy No."
                    valueText={amc.policyNo || ""}
                  />
                  <KeyValueItem
                    keyText="Premium Amount"
                    valueText={amc.premiumAmount || ""}
                  />
                  <KeyValueItem
                    keyText="Amount Insured"
                    valueText={amc.amountInsured || ""}
                  />
                  {amc.sellers != null && (
                    <KeyValueItem
                      keyText="Seller"
                      valueText={amc.sellers.sellerName || ""}
                    />
                  )}
                  {amc.sellers != null && (
                    <KeyValueItem
                      keyText="Seller Contact"
                      ValueComponent={() => (
                        <Text
                          onPress={() =>
                            call({
                              number: String(amc.sellers.contact)
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
                          {amc.sellers.contact}
                        </Text>
                      )}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
          {amcDetails.length == 0 && (
            <Text weight="Bold" style={{ textAlign: "center", padding: 16 }}>
              No info available
            </Text>
          )}
        </Collapsible>

        <Collapsible headerText="Repair/Service">
          {repairBills.length > 0 && (
            <View>
              {repairBills.map(repairBill => (
                <View>
                  <ViewBillRow
                    expiryDate={repairBill.expiryDate}
                    purchaseDate={repairBill.purchaseDate}
                    docType="Repair Bill"
                    copies={repairBill.copies}
                  />
                  <KeyValueItem
                    keyText="Repair Date"
                    valueText={moment(repairBill.purchaseDate).format(
                      "DD MMM YYYY"
                    )}
                  />
                  <KeyValueItem
                    keyText="Premium Amount"
                    valueText={repairBill.premiumAmount}
                  />
                  {repairBill.sellers != null && (
                    <KeyValueItem
                      keyText="Seller"
                      valueText={repairBill.sellers.sellerName || ""}
                    />
                  )}
                  {repairBill.sellers != null && (
                    <KeyValueItem
                      keyText="Seller Contact"
                      ValueComponent={() => (
                        <Text
                          onPress={() =>
                            call({
                              number: String(repairBill.sellers.contact)
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
                          {repairBill.sellers.contact}
                        </Text>
                      )}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
          {repairBills.length == 0 && (
            <Text weight="Bold" style={{ textAlign: "center", padding: 16 }}>
              No info available
            </Text>
          )}
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
