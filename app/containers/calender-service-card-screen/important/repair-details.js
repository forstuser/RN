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

class RepairDetails extends React.Component {
  render() {
    const { product, navigator } = this.props;
    const { repairBills } = product;

    const RepairItem = ({ repair }) => (
      <View style={styles.card}>
        <EditOptionRow
          text={I18n.t("product_details_screen_repair_details")}
          onEditPress={() => {
            this.props.openAddEditRepairScreen(repair);
          }}
        />
        <ViewBillRow
          expiryDate={repair.expiryDate}
          purchaseDate={repair.purchaseDate}
          docType="Repair Bill"
          copies={repair.copies || []}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_repairs_repair_date")}
          valueText={
            repair.purchaseDate
              ? moment(repair.purchaseDate).format("DD MMM YYYY")
              : "-"
          }
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_repairs_amount")}
          valueText={repair.premiumAmount || "-"}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_repairs_for")}
          valueText={repair.repair_for}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_repairs_warranty_upto")}
          valueText={repair.warranty_upto || "-"}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_repairs_seller")}
          valueText={repair.sellers ? repair.sellers.sellerName : "-"}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_repairs_seller_contact")}
          ValueComponent={() => (
            <MultipleContactNumbers
              contact={repair.sellers ? repair.sellers.contact : "-"}
            />
          )}
        />
      </View>
    );

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} style={styles.slider}>
          {repairBills.map(repair => <RepairItem repair={repair} />)}
          <AddItemBtn
            text={I18n.t("product_details_screen_add_repair")}
            onPress={() => this.props.openAddEditRepairScreen(null)}
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

export default RepairDetails;
