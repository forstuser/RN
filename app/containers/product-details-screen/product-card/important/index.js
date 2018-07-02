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

import {
  MAIN_CATEGORY_IDS,
  SCREENS,
  WARRANTY_TYPES,
  CATEGORY_IDS
} from "../../../../constants";

import AddItemBtn from "./add-item-btn";

import WarrantyDetails from "./warranty-details";
import InsuranceDetails from "./insurance-details";
import AmcDetails from "./amc-details";
import RepairDetails from "./repair-details";
import PucDetails from "./puc-details";

class Important extends React.Component {
  openAddEditWarrantyScreen = (warranty, warrantyType) => {
    const { product } = this.props;
    this.props.navigation.navigate(SCREENS.ADD_EDIT_WARRANTY_SCREEN, {
      mainCategoryId: product.masterCategoryId,
      categoryId: product.categoryId,
      productId: product.id,
      jobId: product.jobId,
      warranty: warranty,
      warrantyType: warrantyType
    });
  };

  openAddEditInsuranceScreen = insurance => {
    const { product } = this.props;
    this.props.navigation.navigate(SCREENS.ADD_EDIT_INSURANCE_SCREEN, {
      mainCategoryId: product.masterCategoryId,
      categoryId: product.categoryId,
      productId: product.id,
      jobId: product.jobId,
      insurance: insurance
    });
  };

  openAddEditAmcScreen = amc => {
    const { product } = this.props;
    this.props.navigation.navigate(SCREENS.ADD_EDIT_AMC_SCREEN, {
      mainCategoryId: product.masterCategoryId,
      categoryId: product.categoryId,
      productId: product.id,
      jobId: product.jobId,
      amc: amc
    });
  };

  openAddEditRepairScreen = repair => {
    const { product } = this.props;
    this.props.navigation.navigate(SCREENS.ADD_EDIT_REPAIR_SCREEN, {
      mainCategoryId: product.masterCategoryId,
      categoryId: product.categoryId,
      productId: product.id,
      jobId: product.jobId,
      repair: repair
    });
  };

  openAddEditPucScreen = puc => {
    const { product } = this.props;
    this.props.navigation.navigate(SCREENS.ADD_EDIT_PUC_SCREEN, {
      mainCategoryId: product.masterCategoryId,
      categoryId: product.categoryId,
      productId: product.id,
      jobId: product.jobId,
      puc: puc
    });
  };

  render() {
    const {
      product,
      navigation,
      cardWidthWhenMany,
      cardWidthWhenOne
    } = this.props;

    const {
      warrantyDetails,
      insuranceDetails,
      amcDetails,
      repairBills,
      pucDetails
    } = product;

    return (
      <View collapsable={false} style={styles.container}>
        {(product.categoryId != CATEGORY_IDS.HEALTHCARE.INSURANCE ||
          [
            MAIN_CATEGORY_IDS.AUTOMOBILE,
            MAIN_CATEGORY_IDS.ELECTRONICS,
            MAIN_CATEGORY_IDS.FURNITURE
          ].indexOf(product.masterCategoryId) > -1) &&
          warrantyDetails.length > 0 && (
            <View collapsable={false}>
              <Text weight="Bold" style={styles.sectionTitle}>
                {I18n.t("product_details_screen_warranty_title")}
              </Text>
              <WarrantyDetails
                product={product}
                navigation={navigation}
                openAddEditWarrantyScreen={this.openAddEditWarrantyScreen}
              />
            </View>
          )}

        {([
          MAIN_CATEGORY_IDS.AUTOMOBILE,
          MAIN_CATEGORY_IDS.ELECTRONICS,
          MAIN_CATEGORY_IDS.FURNITURE
        ].indexOf(product.masterCategoryId) > -1 ||
          product.categoryId == CATEGORY_IDS.HEALTHCARE.INSURANCE) &&
          insuranceDetails.length > 0 && (
            <View collapsable={false}>
              <Text weight="Bold" style={styles.sectionTitle}>
                {I18n.t("product_details_screen_insurance_title")}
              </Text>
              <InsuranceDetails
                product={product}
                navigation={navigation}
                openAddEditInsuranceScreen={this.openAddEditInsuranceScreen}
              />
            </View>
          )}

        {[
          MAIN_CATEGORY_IDS.AUTOMOBILE,
          MAIN_CATEGORY_IDS.ELECTRONICS,
          MAIN_CATEGORY_IDS.FURNITURE
        ].indexOf(product.masterCategoryId) > -1 &&
          amcDetails.length > 0 && (
            <View collapsable={false}>
              <Text weight="Bold" style={styles.sectionTitle}>
                {I18n.t("product_details_screen_amc_title")}
              </Text>
              <AmcDetails
                product={product}
                navigation={navigation}
                openAddEditAmcScreen={this.openAddEditAmcScreen}
              />
            </View>
          )}

        {[
          MAIN_CATEGORY_IDS.AUTOMOBILE,
          MAIN_CATEGORY_IDS.ELECTRONICS,
          MAIN_CATEGORY_IDS.FURNITURE
        ].indexOf(product.masterCategoryId) > -1 &&
          repairBills.length > 0 && (
            <View collapsable={false}>
              <Text weight="Bold" style={styles.sectionTitle}>
                {I18n.t("product_details_screen_repairs_title")}
              </Text>
              <RepairDetails
                product={product}
                navigation={navigation}
                openAddEditRepairScreen={this.openAddEditRepairScreen}
              />
            </View>
          )}

        {product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE &&
          pucDetails.length > 0 && (
            <View collapsable={false}>
              <Text weight="Bold" style={styles.sectionTitle}>
                {I18n.t("product_details_screen_puc_title")}
              </Text>
              <PucDetails
                product={product}
                navigation={navigation}
                openAddEditPucScreen={this.openAddEditPucScreen}
              />
            </View>
          )}

        <View collapsable={false} style={styles.addBtns}>
          {(product.categoryId != CATEGORY_IDS.HEALTHCARE.INSURANCE ||
            [
              MAIN_CATEGORY_IDS.AUTOMOBILE,
              MAIN_CATEGORY_IDS.ELECTRONICS,
              MAIN_CATEGORY_IDS.FURNITURE
            ].indexOf(product.masterCategoryId) > -1) &&
            warrantyDetails.filter(
              warranty => warranty.warranty_type == WARRANTY_TYPES.NORMAL
            ).length == 0 && (
              <AddItemBtn
                biggerSize={true}
                text={I18n.t("product_details_screen_add_warranty")}
                onPress={() => {
                  Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_WARRANTY);
                  this.openAddEditWarrantyScreen(null, WARRANTY_TYPES.NORMAL);
                }}
              />
            )}
          {(product.categoryId != CATEGORY_IDS.HEALTHCARE.INSURANCE ||
            [
              MAIN_CATEGORY_IDS.AUTOMOBILE,
              MAIN_CATEGORY_IDS.ELECTRONICS,
              MAIN_CATEGORY_IDS.FURNITURE
            ].indexOf(product.masterCategoryId) > -1) &&
            warrantyDetails.filter(
              warranty => warranty.warranty_type == WARRANTY_TYPES.EXTENDED
            ).length == 0 && (
              <AddItemBtn
                biggerSize={true}
                text={I18n.t("product_details_screen_add_extended_warranty")}
                onPress={() => {
                  Analytics.logEvent(
                    Analytics.EVENTS.CLICK_ON_ADD_EXTENDED_WARRANTY
                  );
                  this.openAddEditWarrantyScreen(null, WARRANTY_TYPES.EXTENDED);
                }}
              />
            )}

          {([
            MAIN_CATEGORY_IDS.AUTOMOBILE,
            MAIN_CATEGORY_IDS.ELECTRONICS,
            MAIN_CATEGORY_IDS.FURNITURE
          ].indexOf(product.masterCategoryId) > -1 ||
            product.categoryId == CATEGORY_IDS.HEALTHCARE.INSURANCE) &&
            insuranceDetails.length == 0 && (
              <AddItemBtn
                biggerSize={true}
                text={I18n.t("product_details_screen_add_insurance")}
                onPress={() => {
                  Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_INSURANCE);
                  this.openAddEditInsuranceScreen(null);
                }}
              />
            )}

          {[
            MAIN_CATEGORY_IDS.AUTOMOBILE,
            MAIN_CATEGORY_IDS.ELECTRONICS,
            MAIN_CATEGORY_IDS.FURNITURE
          ].indexOf(product.masterCategoryId) > -1 &&
            amcDetails.length == 0 && (
              <AddItemBtn
                biggerSize={true}
                text={I18n.t("product_details_screen_add_amc")}
                onPress={() => {
                  Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_AMC);
                  this.openAddEditAmcScreen(null);
                }}
              />
            )}

          {[
            MAIN_CATEGORY_IDS.AUTOMOBILE,
            MAIN_CATEGORY_IDS.ELECTRONICS,
            MAIN_CATEGORY_IDS.FURNITURE
          ].indexOf(product.masterCategoryId) > -1 &&
            repairBills.length == 0 && (
              <AddItemBtn
                biggerSize={true}
                text={I18n.t("product_details_screen_add_repair")}
                onPress={() => {
                  Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_REPAIR);
                  this.openAddEditRepairScreen(null);
                }}
              />
            )}

          {product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE &&
            pucDetails.length == 0 && (
              <AddItemBtn
                biggerSize={true}
                text={I18n.t("product_details_screen_add_puc")}
                onPress={() => {
                  Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_PUC);
                  this.openAddEditPucScreen(null);
                }}
              />
            )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  sectionTitle: {},
  addBtns: {
    width: 300,
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap"
  }
});

export default Important;
