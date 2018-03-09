import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import moment from "moment";
import _ from "lodash";
import getDirections from "react-native-google-maps-directions";

import Analytics from "../../../../analytics";

import KeyValueItem from "../../../../components/key-value-item";
import MultipleContactNumbers from "../../../../components/multiple-contact-numbers";
import { Text, Button } from "../../../../elements";
import { colors } from "../../../../theme";
import I18n from "../../../../i18n";

import { MAIN_CATEGORY_IDS, SCREENS } from "../../../../constants";

import WarrantyDetails from "./warranty-details";
import InsuranceDetails from "./insurance-details";
import AmcDetails from "./amc-details";
import RepairDetails from "./repair-details";
import PucDetails from "./puc-details";
import ServiceSchedules from "./service-schedules";

class Important extends React.Component {
  render() {
    const { product, navigator } = this.props;
    const { serviceSchedules } = product;

    return (
      <View style={styles.container}>
        {(product.categoryId != 664 ||
          [MAIN_CATEGORY_IDS.AUTOMOBILE, MAIN_CATEGORY_IDS.ELECTRONICS].indexOf(
            product.masterCategoryId
          ) > -1) && (
          <View>
            <Text weight="Bold" style={styles.sectionTitle}>
              {I18n.t("product_details_screen_warranty_title")}
            </Text>
            <WarrantyDetails product={product} navigator={navigator} />
          </View>
        )}

        {([MAIN_CATEGORY_IDS.AUTOMOBILE, MAIN_CATEGORY_IDS.ELECTRONICS].indexOf(
          product.masterCategoryId
        ) > -1 ||
          product.categoryId == 664) && (
          <View>
            <Text weight="Bold" style={styles.sectionTitle}>
              {I18n.t("product_details_screen_insurance_title")}
            </Text>
            <InsuranceDetails product={product} navigator={navigator} />
          </View>
        )}

        {[MAIN_CATEGORY_IDS.AUTOMOBILE, MAIN_CATEGORY_IDS.ELECTRONICS].indexOf(
          product.masterCategoryId
        ) > -1 && (
          <View>
            <Text weight="Bold" style={styles.sectionTitle}>
              {I18n.t("product_details_screen_amc_title")}
            </Text>
            <AmcDetails product={product} navigator={navigator} />
          </View>
        )}

        {[
          MAIN_CATEGORY_IDS.AUTOMOBILE,
          MAIN_CATEGORY_IDS.ELECTRONICS,
          MAIN_CATEGORY_IDS.FURNITURE
        ].indexOf(product.masterCategoryId) > -1 && (
          <View>
            <Text weight="Bold" style={styles.sectionTitle}>
              {I18n.t("product_details_screen_repairs_title")}
            </Text>
            <RepairDetails product={product} navigator={navigator} />
          </View>
        )}

        {product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE && (
          <View>
            <Text weight="Bold" style={styles.sectionTitle}>
              {I18n.t("product_details_screen_puc_title")}
            </Text>
            <PucDetails product={product} navigator={navigator} />
          </View>
        )}

        {product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE &&
          serviceSchedules &&
          serviceSchedules.length > 0 && (
            <View>
              <Text weight="Bold" style={styles.sectionTitle}>
                {I18n.t("product_details_screen_service_schedule_title")}
              </Text>
              <ServiceSchedules product={product} navigator={navigator} />
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  },
  sectionTitle: {}
});

export default Important;
