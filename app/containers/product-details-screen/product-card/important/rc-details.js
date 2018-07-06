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
    const { rc_details } = product;

    const RcItem = ({ rc }) => (
      <View collapsable={false} style={styles.card}>
        <EditOptionRow
          text={I18n.t("product_details_screen_puc_details")}
          onEditPress={() => {
            Analytics.logEvent(Analytics.EVENTS.CLICK_EDIT, { entity: "rc" });
            this.props.openAddEditRcScreen(rc);
          }}
        />
        {rc.copies ? (
          <ViewBillRow
            collapsable={false}
            expiryDate={rc.expiryDate}
            purchaseDate={rc.purchaseDate}
            docType="RC"
            copies={rc.copies || []}
          />
        ) : (
          <View />
        )}

        {rc.effective_date ? (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_puc_effective_date")}
            valueText={
              rc.effective_date
                ? moment(rc.effective_date).format("MMM DD, YYYY")
                : "-"
            }
          />
        ) : (
          <View />
        )}

        {rc.expiry_date ? (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_puc_expiry_date")}
            valueText={
              rc.expiry_date
                ? moment(rc.expiry_date).format("MMM DD, YYYY")
                : "-"
            }
          />
        ) : (
          <View />
        )}

        {rc.expiry_date ? (
          <KeyValueItem keyText="State" valueText={rc.state.state_name} />
        ) : (
          <View />
        )}
      </View>
    );

    return (
      <View collapsable={false} style={styles.container}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
          showsHorizontalScrollIndicator={true}
        >
          {rc_details.map((rc, index) => <RcItem key={index} rc={rc} />)}
          <AddItemBtn
            text={I18n.t("product_details_screen_add_rc")}
            onPress={() => this.props.openAddEditRcScreen(null)}
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
