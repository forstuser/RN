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

class AmcDetails extends React.Component {
  render() {
    const { product, navigation } = this.props;
    const { amcDetails } = product;

    const AmcItem = ({ amc }) => (
      <View collapsable={false} style={styles.card}>
        <EditOptionRow
          text={I18n.t("product_details_screen_amc_details")}
          onEditPress={() => {
            Analytics.logEvent(Analytics.EVENTS.CLICK_EDIT, { entity: "amc" });
            this.props.openAddEditAmcScreen(amc);
          }}
        />
        {amc.copies ? (
          <ViewBillRow
            collapsable={false}
            expiryDate={amc.expiryDate}
            purchaseDate={amc.purchaseDate}
            docType="AMC"
            copies={amc.copies || []}
          />
        ) : (
          <View />
        )}
        {amc.expiryDate ? (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_amc_expiry")}
            valueText={
              moment(amc.expiryDate).isValid() &&
              moment(amc.expiryDate).format("DD MMM YYYY")
            }
          />
        ) : (
          <View />
        )}
        {amc.premiumAmount ? (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_amc_premium_amount")}
            valueText={amc.premiumAmount || "-"}
          />
        ) : (
          <View />
        )}
        {amc.sellers ? (
          <KeyValueItem
            keyText={"AMC Provider Name"}
            valueText={amc.sellers ? amc.sellers.sellerName : "-"}
          />
        ) : (
          <View />
        )}
        {amc.sellers ? (
          <KeyValueItem
            keyText={"AMC Provider Contact"}
            ValueComponent={() => (
              <MultipleContactNumbers
                contact={amc.sellers ? amc.sellers.contact : "-"}
              />
            )}
          />
        ) : (
          <View />
        )}
      </View>
    );

    return (
      <View collapsable={false} style={styles.container}>
        <ScrollView horizontal={true} style={styles.slider}>
          {amcDetails.map((amc, index) => <AmcItem key={index} amc={amc} />)}
          <AddItemBtn
            text={I18n.t("product_details_screen_add_amc")}
            onPress={() => this.props.openAddEditAmcScreen(null)}
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
    width: 290,
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

export default AmcDetails;
