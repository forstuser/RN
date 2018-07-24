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

class PucDetails extends React.Component {
  render() {
    const { product, navigation } = this.props;
    const { pucDetails } = product;

    const PucItem = ({ puc }) => (
      <View collapsable={false} style={styles.card}>
        <EditOptionRow
          text={I18n.t("product_details_screen_puc_details")}
          onEditPress={() => {
            Analytics.logEvent(Analytics.EVENTS.CLICK_EDIT, { entity: "puc" });
            this.props.openAddEditPucScreen(puc);
          }}
        />
        {puc.copies ? (
          <ViewBillRow
            collapsable={false}
            expiryDate={puc.expiryDate}
            purchaseDate={puc.purchaseDate}
            docType="PUC"
            copies={puc.copies || []}
          />
        ) : (
          <View />
        )}

        {puc.effectiveDate ? (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_puc_effective_date")}
            valueText={
              puc.effectiveDate
                ? moment(puc.effectiveDate).format("MMM DD, YYYY")
                : "-"
            }
          />
        ) : (
          <View />
        )}

        {puc.expiryDate ? (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_puc_expiry_date")}
            valueText={
              puc.expiryDate
                ? moment(puc.expiryDate).format("MMM DD, YYYY")
                : "-"
            }
          />
        ) : (
          <View />
        )}
        {puc.value ? (
          <KeyValueItem keyText={"PUC Amount"} valueText={"₹ " + puc.value} />
        ) : (
          <View />
        )}

        {/* <KeyValueItem
          keyText={I18n.t("product_details_screen_puc_seller_contact")}
          ValueComponent={() => (
            <MultipleContactNumbers
              contact={puc.sellers ? puc.sellers.contact : "-"}
            />
          )}
        /> */}
      </View>
    );

    return (
      <View collapsable={false} style={styles.container}>
        <ScrollView
          horizontal={true}           showsHorizontalScrollIndicator={false}
          style={styles.slider}
          showsHorizontalScrollIndicator={true}
        >
          {pucDetails.map((puc, index) => <PucItem key={index} puc={puc} />)}
          <AddItemBtn
            text={I18n.t("product_details_screen_add_puc")}
            onPress={() => this.props.openAddEditPucScreen(null)}
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

export default PucDetails;
