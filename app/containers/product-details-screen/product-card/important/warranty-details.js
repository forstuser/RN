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

class WarrantyDetails extends React.Component {
  render() {
    const { product, navigator } = this.props;
    const { warrantyDetails } = product;

    const WarrantyItem = ({ warranty, warrantyType }) => (
      <View style={styles.card}>
        <EditOptionRow
          text={
            warranty.warranty_type == WARRANTY_TYPES.NORMAL
              ? I18n.t("product_details_screen_service_manufacturer_warranty")
              : I18n.t("product_details_screen_service_third_party_warranty")
          }
          onEditPress={() => {
            if (warranty.warranty_type == WARRANTY_TYPES.NORMAL) {
              Analytics.logEvent(Analytics.EVENTS.CLICK_EDIT, { entity: 'warranty' });
            } else {
              Analytics.logEvent(Analytics.EVENTS.CLICK_EDIT, { entity: 'extended warranty' });
            }
            this.props.openAddEditWarrantyScreen(
              warranty,
              warranty.warranty_type
            );
          }}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_warranty_expiry_date")}
          valueText={
            moment(warranty.expiryDate).isValid() &&
            moment(warranty.expiryDate).format("DD MMM YYYY")
          }
        />

        {warranty.warranty_type == WARRANTY_TYPES.EXTENDED && (
          <KeyValueItem
            keyText={I18n.t("product_details_screen_warranty_provider")}
            valueText={warranty.provider ? warranty.provider.name : "-"}
          />
        )}

        <ViewBillRow
          expiryDate={warranty.expiryDate}
          purchaseDate={warranty.purchaseDate}
          docType="Warranty"
          copies={warranty.copies || []}
        />
      </View>
    );

    return (
      <View style={styles.container}>
        {product.categoryId != 664 && (
          <ScrollView horizontal={true} style={styles.slider}>
            {warrantyDetails
              .filter(
                warranty => warranty.warranty_type == WARRANTY_TYPES.NORMAL
              )
              .map((warranty, index) => <WarrantyItem key={index} warranty={warranty} />)}
            <AddItemBtn
              text={I18n.t("product_details_screen_add_warranty")}
              onPress={() =>
                this.props.openAddEditWarrantyScreen(
                  null,
                  WARRANTY_TYPES.NORMAL
                )
              }
            />
          </ScrollView>
        )}

        {[MAIN_CATEGORY_IDS.AUTOMOBILE, MAIN_CATEGORY_IDS.ELECTRONICS].indexOf(
          product.masterCategoryId
        ) > -1 &&
          warrantyDetails.filter(
            warranty => warranty.warranty_type == WARRANTY_TYPES.EXTENDED
          ).length > 0 && (
            <ScrollView horizontal={true} style={styles.slider}>
              {warrantyDetails
                .filter(
                  warranty => warranty.warranty_type == WARRANTY_TYPES.EXTENDED
                )
                .map(warranty => <WarrantyItem warranty={warranty} />)}
              <AddItemBtn
                text={I18n.t("product_details_screen_add_extended_warranty")}
                onPress={() =>
                  this.props.openAddEditWarrantyScreen(
                    null,
                    WARRANTY_TYPES.EXTENDED
                  )
                }
              />
            </ScrollView>
          )}
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

export default WarrantyDetails;
