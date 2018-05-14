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

import { SCREENS } from "../../../constants";
import { Text, Button, ScreenContainer } from "../../../elements";
import I18n from "../../../i18n";
import { colors } from "../../../theme";
import Collapsible from "../../../components/collapsible";
import KeyValueItem from "../../../components/key-value-item";

import { openBillsPopUp } from "../../../navigation";

import MultipleContactNumbers from "../multiple-contact-numbers";
import ViewBillRow from "./view-bill-row";
import EditOptionRow from "./edit-option-row";

class InsuranceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {}
    };
  }

  openAddEditInsuranceScreen = insurance => {
    const { product } = this.props;

    this.props.navigator.push({
      screen: SCREENS.ADD_EDIT_INSURANCE_SCREEN,
      passProps: {
        mainCategoryId: product.masterCategoryId,
        categoryId: product.categoryId,
        productId: product.id,
        jobId: product.jobId,
        insurance: insurance
      },
      overrideBackPress: true
    });
  };

  render() {
    const { product } = this.props;
    const { insuranceDetails } = product;

    return (
      <View collapsable={false} >
        <Collapsible
          headerText={I18n.t("product_details_screen_insurance_title")}
        >
          {insuranceDetails.length > 0 ? (
            <View collapsable={false} >
              {insuranceDetails.map(insurance => (
                <View collapsable={false} >
                  <EditOptionRow
                    date={insurance.expiryDate}
                    onEditPress={() => {
                      this.openAddEditInsuranceScreen(insurance);
                    }}
                  />
                  <View collapsable={false} BillRow
                    expiryDate={insurance.expiryDate}
                    purchaseDate={insurance.purchaseDate}
                    docType="Insurance"
                    copies={insurance.copies || []}
                  />
                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_insurance_provider"
                    )}
                    valueText={
                      insurance.provider ? insurance.provider.name : "-"
                    }
                  />
                  <KeyValueItem
                    keyText={I18n.t("product_details_screen_insurance_expiry")}
                    valueText={
                      moment(insurance.expiryDate).isValid() &&
                      moment(insurance.expiryDate).format("DD MMM YYYY")
                    }
                  />
                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_insurance_policy_no"
                    )}
                    valueText={insurance.policyNo || "-"}
                  />
                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_insurance_premium_amount"
                    )}
                    valueText={insurance.premiumAmount || "-"}
                  />
                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_insurance_amount_insured"
                    )}
                    valueText={insurance.amountInsured || "-"}
                  />
                  {insurance.sellers != null ? (
                    <KeyValueItem
                      keyText={I18n.t(
                        "product_details_screen_insurance_seller"
                      )}
                      valueText={
                        insurance.sellers ? insurance.sellers.sellerName : "-"
                      }
                    />
                  ) : (
                    <View collapsable={false}  />
                  )}
                  {insurance.sellers != null ? (
                    <KeyValueItem
                      keyText={I18n.t(
                        "product_details_screen_insurance_seller_contact"
                      )}
                      ValueComponent={() => (
                        <MultipleContactNumbers
                          contact={
                            insurance.sellers ? insurance.sellers.contact : "-"
                          }
                        />
                      )}
                    />
                  ) : (
                    <View collapsable={false}  />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text
              weight="Bold"
              style={{ textAlign: "center", padding: 16, color: "red" }}
            >
              {I18n.t("product_details_screen_insurance_no_info")}
            </Text>
          )}
          <Button
            text={I18n.t("product_details_screen_add_insurance")}
            onPress={() => this.openAddEditInsuranceScreen(null)}
            type="outline"
            borderRadius={0}
            outlineBtnStyle={{ borderColor: "transparent" }}
          />
        </Collapsible>
      </View>
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

export default InsuranceDetails;
