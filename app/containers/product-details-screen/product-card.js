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
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <Details product={product} navigator={this.props.navigator} />
          <ScrollableTabView
            style={{ marginTop: 20, marginBottom: 70 }}
            renderTabBar={() => <DefaultTabBar />}
            tabBarUnderlineStyle={{
              backgroundColor: colors.mainBlue,
              height: 2
            }}
            tabBarBackgroundColor="#fafafa"
            tabBarTextStyle={{ fontSize: 14, fontFamily: `Quicksand-Bold` }}
            tabBarActiveTextColor={colors.mainBlue}
            tabBarInactiveTextColor={colors.secondaryText}
          >
            {product.masterCategoryId != MAIN_CATEGORY_IDS.TRAVEL && (
              <ImportantTab
                tabLabel="IMPORTANT"
                product={product}
                navigator={this.props.navigator}
                openServiceSchedule={openServiceSchedule}
              />
            )}
            {product.categoryId != 664 && (
              <SellerTab
                tabLabel="SELLER"
                product={product}
                onEditPress={this.startBasicDetailsEdit}
                fetchProductDetails={this.fetchProductDetails}
              />
            )}
            <GeneralTab
              tabLabel="GENERAL INFO"
              product={product}
              onEditPress={this.startBasicDetailsEdit}
              fetchProductDetails={this.fetchProductDetails}
            />
          </ScrollableTabView>
        </ScrollView>
        {showCustomerCareBtn && (
          <View style={styles.contactAfterSalesBtn}>
            <ContactAfterSaleButton
              product={product}
              navigator={this.props.navigator}
            />
          </View>
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
