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

import { SCREENS, MAIN_CATEGORY_IDS } from "../../constants";
import { API_BASE_URL, getProductDetails } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import Analytics from "../../analytics";

import I18n from "../../i18n";

import { colors } from "../../theme";

import Details from "./details";
import ImportantTab from "./important-tab";
import GeneralTab from "./general-tab";
import SellerTab from "./seller-tab";
import ContactAfterSaleButton from "./after-sale-button";
import LoadingOverlay from "../../components/loading-overlay";

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  startBasicDetailsEdit = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_PRODUCT_EDIT);
    const { product } = this.props;
    if (product.categoryId == 664) {
      this.props.navigation.navigate(SCREENS.EDIT_INSURANCE_SCREEN, {
        typeId: product.sub_category_id,
        mainCategoryId: product.masterCategoryId,
        categoryId: product.categoryId,
        productId: product.id,
        jobId: product.jobId,
        planName: product.productName,
        insuranceFor: product.model,
        copies: []
      });
    } else {
      this.props.navigation.navigate(
        SCREENS.EDIT_PRODUCT_BASIC_DETAILS_SCREEN,
        {
          product: product
        }
      );
    }
  };

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
          tabLabel={I18n.t("product_details_screen_important")}
          product={product}
          navigation={this.props.navigation}
          openServiceSchedule={openServiceSchedule}
        />
      ) : null;
    const sellerTab = (
      <SellerTab
        tabLabel={I18n.t("product_details_screen_sellers")}
        product={product}
        onEditPress={this.startBasicDetailsEdit}
        fetchProductDetails={this.fetchProductDetails}
      />
    );

    const generalTab = (
      <GeneralTab
        tabLabel={I18n.t("product_details_screen_gen_info")}
        product={product}
        onEditPress={this.startBasicDetailsEdit}
        fetchProductDetails={this.fetchProductDetails}
      />
    );

    return (
      <View collapsable={false} style={styles.container}>
        <ScrollView style={styles.container}>
          <Details product={product} navigation={this.props.navigation} />
          <ScrollableTabView
            style={{ marginTop: 20, marginBottom: 70 }}
            renderTabBar={() => <DefaultTabBar />}
            tabBarUnderlineStyle={{
              backgroundColor: colors.mainBlue,
              height: 2
            }}
            tabBarBackgroundColor="#fafafa"
            tabBarTextStyle={{ fontSize: 14, fontFamily: `Roboto-Bold` }}
            tabBarActiveTextColor={colors.mainBlue}
            tabBarInactiveTextColor={colors.secondaryText}
          >
            {product.masterCategoryId != MAIN_CATEGORY_IDS.TRAVEL &&
            [
              MAIN_CATEGORY_IDS.AUTOMOBILE,
              MAIN_CATEGORY_IDS.ELECTRONICS,
              MAIN_CATEGORY_IDS.FURNITURE
            ].indexOf(product.masterCategoryId) > -1
              ? importantTab
              : generalTab}

            {product.categoryId != 664 ? (
              <SellerTab
                tabLabel="SELLER"
                product={product}
                onEditPress={this.startBasicDetailsEdit}
                fetchProductDetails={this.fetchProductDetails}
              />
            ) : (
              <View collapsable={false} />
            )}

            {[
              MAIN_CATEGORY_IDS.AUTOMOBILE,
              MAIN_CATEGORY_IDS.ELECTRONICS,
              MAIN_CATEGORY_IDS.FURNITURE
            ].indexOf(product.masterCategoryId) > -1
              ? generalTab
              : importantTab}
          </ScrollableTabView>
        </ScrollView>
        {showCustomerCareBtn ? (
          <View collapsable={false} style={styles.contactAfterSalesBtn}>
            <ContactAfterSaleButton
              product={product}
              navigation={this.props.navigation}
            />
          </View>
        ) : (
          <View collapsable={false} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  upperContainer: {
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100
  },
  name: {
    fontSize: 24
  },
  metaUnderName: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18
  },
  totalText: {
    fontSize: 24,
    marginBottom: 7
  },
  totalAmount: {
    fontSize: 24
  },
  contactAfterSalesBtn: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16
  }
});

export default ProductCard;
