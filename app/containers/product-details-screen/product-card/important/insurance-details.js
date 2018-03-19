import React from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import moment from "moment";
import _ from "lodash";
import getDirections from "react-native-google-maps-directions";

import Analytics from "../../../../analytics";

import KeyValueItem from "../../../../components/key-value-item";
import MultipleContactNumbers from "../../../../components/multiple-contact-numbers";
import { Text, Button } from "../../../../elements";
import { colors } from "../../../../theme";
import I18n from "../../../../i18n";

import {
  MAIN_CATEGORY_IDS,
  SCREENS,
  WARRANTY_TYPES
} from "../../../../constants";

import AddItemBtn from "./add-item-btn";
import ViewBillRow from "./view-bill-row";
import EditOptionRow from "./edit-option-row";

class InsuranceDetails extends React.Component {
  render() {
    const { product, navigator } = this.props;
    const { insuranceDetails } = product;

    const InsuranceItem = ({ insurance }) => (
      <View style={styles.card}>
        <EditOptionRow
          text={I18n.t("product_details_screen_insurance_details")}
          onEditPress={() => {
            this.props.openAddEditInsuranceScreen(insurance);
          }}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_insurance_expiry")}
          valueText={
            moment(insurance.expiryDate).isValid() &&
            moment(insurance.expiryDate).format("DD MMM YYYY")
          }
        />
        <ViewBillRow
          expiryDate={insurance.expiryDate}
          purchaseDate={insurance.purchaseDate}
          docType="Insurance"
          copies={insurance.copies || []}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_insurance_provider")}
          ValueComponent={() => (
            <Text
              numberOfLines={1}
              weight="Medium"
              style={{
                textAlign: "right",
                flex: 1,
                paddingLeft: 10
              }}
            >
              {insurance.provider ? insurance.provider.name : "-"}
            </Text>
          )}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_insurance_policy_no")}
          valueText={insurance.policyNo || "-"}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_insurance_premium_amount")}
          valueText={insurance.premiumAmount || "-"}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_insurance_amount_insured")}
          valueText={insurance.amountInsured || "-"}
        />
        {insurance.sellers != null && (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_insurance_seller")}
            valueText={insurance.sellers ? insurance.sellers.sellerName : "-"}
          />
        )}
        {insurance.sellers != null && (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_insurance_seller_contact")}
            ValueComponent={() => (
              <MultipleContactNumbers
                contact={insurance.sellers ? insurance.sellers.contact : "-"}
              />
            )}
          />
        )}
      </View>
    );

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} style={styles.slider}>
          {insuranceDetails.map(insurance => (
            <InsuranceItem
              insurance={insurance}
              insuranceType={WARRANTY_TYPES.NORMAL}
            />
          ))}
          <AddItemBtn
            text={I18n.t("product_details_screen_add_insurance")}
            onPress={() => this.props.openAddEditInsuranceScreen(null)}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  slider: {
    paddingBottom: 20
  },
  card: {
    width: 300,
    backgroundColor: "#fff",
    marginRight: 20,
    marginLeft: 5,
    borderRadius: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  }
});

export default InsuranceDetails;
