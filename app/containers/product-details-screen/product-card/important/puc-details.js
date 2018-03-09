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
  openAddEditPucScreen = puc => {
    const { product } = this.props;
    this.props.navigator.push({
      screen: SCREENS.ADD_EDIT_PUC_SCREEN,
      passProps: {
        mainCategoryId: product.masterCategoryId,
        categoryId: product.categoryId,
        productId: product.id,
        jobId: product.jobId,
        puc: puc
      },
      overrideBackPress: true
    });
  };

  render() {
    const { product, navigator } = this.props;
    const { pucDetails } = product;

    const PucItem = ({ puc }) => (
      <View style={styles.card}>
        <EditOptionRow
          text={I18n.t("product_details_screen_puc_details")}
          onEditPress={() => {
            this.openAddEditPucScreen(puc);
          }}
        />
        <ViewBillRow
          expiryDate={puc.expiryDate}
          purchaseDate={puc.purchaseDate}
          docType="PUC"
          copies={puc.copies || []}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_puc_effective_date")}
          valueText={
            puc.effectiveDate
              ? moment(puc.effectiveDate).format("MMM DD, YYYY")
              : "-"
          }
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_puc_expiry_date")}
          valueText={
            puc.expiryDate ? moment(puc.expiryDate).format("MMM DD, YYYY") : "-"
          }
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_puc_seller")}
          valueText={puc.sellers ? puc.sellers.sellerName : "-"}
        />

        <KeyValueItem
          keyText={I18n.t("product_details_screen_puc_seller_contact")}
          ValueComponent={() => (
            <MultipleContactNumbers
              contact={puc.sellers ? puc.sellers.contact : "-"}
            />
          )}
        />
      </View>
    );

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} style={styles.slider}>
          {pucDetails.map(puc => <PucItem puc={puc} />)}
          <AddItemBtn
            text={I18n.t("product_details_screen_add_puc")}
            onPress={() => this.openAddEditPucScreen(null)}
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

export default PucDetails;
