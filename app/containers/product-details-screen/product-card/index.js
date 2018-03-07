import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Text as NativeText
} from "react-native";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/Entypo";
import { Navigation } from "react-native-navigation";

import Modal from "react-native-modal";

import ActionSheet from "react-native-actionsheet";

import { SCREENS, MAIN_CATEGORY_IDS } from "../../../constants";
import { API_BASE_URL, getProductDetails } from "../../../api";
import { Text, Button, ScreenContainer } from "../../../elements";

import Analytics from "../../../analytics";

import I18n from "../../../i18n";

import { colors } from "../../../theme";

import Header from "./header";
import CustomerCare from "./customer-care";
import ImportantTab from "../important-tab";
import GeneralTab from "../general-tab";
import SellerTab from "../seller-tab";
import ContactAfterSaleButton from "../after-sale-button";
import LoadingOverlay from "../../../components/loading-overlay";

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  startBasicDetailsEdit = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_PRODUCT_EDIT);
    const { product } = this.props;
    if (product.categoryId == 664) {
      this.props.navigator.push({
        screen: SCREENS.EDIT_INSURANCE_SCREEN,
        passProps: {
          typeId: product.sub_category_id,
          mainCategoryId: product.masterCategoryId,
          categoryId: product.categoryId,
          productId: product.id,
          jobId: product.jobId,
          planName: product.productName,
          insuranceFor: product.model,
          copies: []
        }
      });
    } else {
      this.props.navigator.push({
        screen: SCREENS.EDIT_PRODUCT_BASIC_DETAILS_SCREEN,
        passProps: {
          product: product
        }
      });
    }
  };

  onTabChange = () => {};

  render() {
    const { product, openServiceSchedule } = this.props;
    let showCustomerCareBtn = false;
    if (
      [
        MAIN_CATEGORY_IDS.AUTOMOBILE,
        MAIN_CATEGORY_IDS.ELECTRONICS,
        MAIN_CATEGORY_IDS.FURNITURE
      ].indexOf(product.masterCategoryId) > -1 ||
      product.categoryId == 664
    ) {
      showCustomerCareBtn = true;
    }

    const importantTab =
      product.masterCategoryId != MAIN_CATEGORY_IDS.TRAVEL ? (
        <ImportantTab
          tabLabel="IMPORTANT"
          product={product}
          navigator={this.props.navigator}
          openServiceSchedule={openServiceSchedule}
        />
      ) : null;
    const sellerTab = (
      <SellerTab
        tabLabel="SELLER"
        product={product}
        onEditPress={this.startBasicDetailsEdit}
        fetchProductDetails={this.fetchProductDetails}
      />
    );

    const generalTab = (
      <GeneralTab
        tabLabel="GENERAL INFO"
        product={product}
        onEditPress={this.startBasicDetailsEdit}
        fetchProductDetails={this.fetchProductDetails}
      />
    );

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <Header
            onTabChange={this.onTabChange}
            product={product}
            navigator={this.props.navigator}
          />
          <View style={styles.pages}>
            <CustomerCare product={product} navigator={this.props.navigator} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  pages: {
    marginTop: 20
  }
});

export default ProductCard;
