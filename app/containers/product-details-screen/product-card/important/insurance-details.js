import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import moment from "moment";
import _ from "lodash";
import getDirections from "react-native-google-maps-directions";

import Analytics from "../../../../analytics";

import KeyValueItem from "../../../../components/key-value-item";
import MultipleContactNumbers from "../../../../components/multiple-contact-numbers";
import { Text, Button } from "../../../../elements";
import { colors } from "../../../../theme";
import I18n from "../../../../i18n";

const SCREEN_WIDTH = Dimensions.get("window").width;

import {
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS,
  SCREENS,
  WARRANTY_TYPES
} from "../../../../constants";

import AddItemBtn from "./add-item-btn";
import ViewBillRow from "./view-bill-row";
import EditOptionRow from "./edit-option-row";

class InsuranceDetails extends React.Component {
  render() {
    const { product, navigation } = this.props;
    const { insuranceDetails } = product;

    const InsuranceItem = ({ insurance }) => (
      <View
        collapsable={false}
        style={[
          styles.card,
          product.categoryId == CATEGORY_IDS.HEALTHCARE.INSURANCE
            ? styles.fullCard
            : {}
        ]}
      >
        <EditOptionRow
          // text={I18n.t("product_details_screen_insurance_details")}
          onEditPress={() => {
            Analytics.logEvent(Analytics.EVENTS.CLICK_EDIT, {
              entity: "insurance"
            });
            this.props.openAddEditInsuranceScreen(insurance);
          }}
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
          keyText={I18n.t("product_details_screen_insurance_expiry")}
          valueText={
            moment(insurance.expiryDate).isValid() &&
            moment(insurance.expiryDate).format("DD MMM YYYY")
          }
        />
        {(insurance.copies || []).length > 0 && (
          <ViewBillRow
            collapsable={false}
            expiryDate={insurance.expiryDate}
            purchaseDate={insurance.purchaseDate}
            docType="Insurance"
            copies={insurance.copies || []}
          />
        )}
        {insurance.policyNo ? <KeyValueItem
          keyText={I18n.t("product_details_screen_insurance_policy_no")}
          valueText={insurance.policyNo || "-"}
        /> : <View />}

        {insurance.premiumAmount ? <KeyValueItem
          keyText={I18n.t("product_details_screen_insurance_premium_amount")}
          valueText={"₹ " + insurance.premiumAmount || "-"}
        /> : <View />}
        {insurance.amountInsured ? <KeyValueItem
          keyText={I18n.t("product_details_screen_insurance_amount_insured")}
          valueText={"₹ " + insurance.amountInsured || "-"}
        /> : <View />}
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
      <View collapsable={false} style={styles.container}>
        <ScrollView horizontal={true} style={styles.slider}>
          {insuranceDetails.map((insurance, index) => (
            <InsuranceItem key={index} insurance={insurance} />
          ))}
          {product.categoryId != CATEGORY_IDS.HEALTHCARE.INSURANCE ? (
            <AddItemBtn
              text={I18n.t("product_details_screen_add_insurance")}
              onPress={() => this.props.openAddEditInsuranceScreen(null)}
            />
          ) : (
              <View collapsable={false} />
            )}
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
  },
  fullCard: {
    width: SCREEN_WIDTH - 40,
    marginRight: 0
  }
});

export default InsuranceDetails;
