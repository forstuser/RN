import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated
} from "react-native";

import call from "react-native-phone-call";
import moment from "moment";

import {
  SCREENS,
  WARRANTY_TYPES,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS
} from "../../../constants";
import { Text, Button, ScreenContainer } from "../../../elements";
import I18n from "../../../i18n";
import { colors } from "../../../theme";
import Collapsible from "../../../components/collapsible";
import KeyValueItem from "../../../components/key-value-item";

import { openBillsPopUp } from "../../../navigation";

import MultipleContactNumbers from "../multiple-contact-numbers";
import ViewBillRow from "./view-bill-row";
import WarrantyDetails from "./warranty-details";
import InsuranceDetails from "./insurance-details";
import AmcDetails from "./amc-details";
import RepairDetails from "./repair-details";
import PucDetails from "./puc-details";
import ServiceSchedules from "./service-schedules";

class ImportantTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      product: {}
    };
  }

  render() {
    const { product, navigation, openServiceSchedule } = this.props;
    const {
      warrantyDetails,
      insuranceDetails,
      amcDetails,
      repairBills
    } = product;

    return (
      <Animated.ScrollView>
        {product.categoryId != CATEGORY_IDS.HEALTHCARE.INSURANCE && (
          <WarrantyDetails
            warrantyType={WARRANTY_TYPES.NORMAL}
            product={product}
            navigation={navigation}
          />
        )}

        {[MAIN_CATEGORY_IDS.AUTOMOBILE, MAIN_CATEGORY_IDS.ELECTRONICS].indexOf(
          product.masterCategoryId
        ) > -1 && (
          <WarrantyDetails
            warrantyType={WARRANTY_TYPES.EXTENDED}
            product={product}
            navigation={navigation}
          />
        )}

        {([MAIN_CATEGORY_IDS.AUTOMOBILE, MAIN_CATEGORY_IDS.ELECTRONICS].indexOf(
          product.masterCategoryId
        ) > -1 ||
          product.categoryId == CATEGORY_IDS.HEALTHCARE.INSURANCE) && (
          <InsuranceDetails product={product} navigation={navigation} />
        )}

        {[MAIN_CATEGORY_IDS.AUTOMOBILE, MAIN_CATEGORY_IDS.ELECTRONICS].indexOf(
          product.masterCategoryId
        ) > -1 && <AmcDetails product={product} navigation={navigation} />}

        {[
          MAIN_CATEGORY_IDS.AUTOMOBILE,
          MAIN_CATEGORY_IDS.ELECTRONICS,
          MAIN_CATEGORY_IDS.FURNITURE
        ].indexOf(product.masterCategoryId) > -1 && (
          <RepairDetails product={product} navigation={navigation} />
        )}
        {product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE && (
          <PucDetails product={product} navigation={navigation} />
        )}
        {product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE &&
          product.serviceSchedules &&
          product.serviceSchedules.length > 0 && (
            <ServiceSchedules
              product={product}
              navigation={navigation}
              openServiceSchedule={openServiceSchedule}
            />
          )}
      </Animated.ScrollView>
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
    // flex:1
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30
  }
});

export default ImportantTab;
