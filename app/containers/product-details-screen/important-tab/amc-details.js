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

class AmcDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {}
    };
  }

  openAddEditAmcScreen = amc => {
    const { product } = this.props;

    this.props.navigation.push({
      screen: SCREENS.ADD_EDIT_AMC_SCREEN,
      passProps: {
        mainCategoryId: product.masterCategoryId,
        categoryId: product.categoryId,
        productId: product.id,
        jobId: product.jobId,
        amc: amc
      },
      overrideBackPress: true
    });
  };

  render() {
    const { product } = this.props;
    const { amcDetails } = product;

    return (
      <View collapsable={false}>
        <Collapsible headerText={I18n.t("product_details_screen_amc_title")}>
          {amcDetails.length > 0 ? (
            <View collapsable={false}>
              {amcDetails.map(amc => (
                <View collapsable={false}>
                  <EditOptionRow
                    date={amc.expiryDate}
                    onEditPress={() => {
                      this.openAddEditAmcScreen(amc);
                    }}
                  />
                  <ViewBillRow
                    collapsable={false}
                    expiryDate={amc.expiryDate}
                    purchaseDate={amc.purchaseDate}
                    docType="AMC"
                    copies={amc.copies || []}
                  />
                  <KeyValueItem
                    keyText={I18n.t("product_details_screen_amc_expiry")}
                    valueText={
                      moment(amc.expiryDate).isValid() &&
                      moment(amc.expiryDate).format("DD MMM YYYY")
                    }
                  />
                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_amc_premium_amount"
                    )}
                    valueText={amc.premiumAmount || "-"}
                  />
                  <KeyValueItem
                    keyText={I18n.t("product_details_screen_amc_seller")}
                    valueText={amc.sellers ? amc.sellers.sellerName : "-"}
                  />
                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_amc_seller_contact"
                    )}
                    ValueComponent={() => (
                      <MultipleContactNumbers
                        contact={amc.sellers ? amc.sellers.contact : "-"}
                      />
                    )}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text
              weight="Bold"
              style={{ textAlign: "center", padding: 16, color: "red" }}
            >
              {I18n.t("product_details_screen_amc_no_info")}
            </Text>
          )}
          <Button
            text="+ ADD AMC"
            onPress={() => this.openAddEditAmcScreen(null)}
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

export default AmcDetails;
