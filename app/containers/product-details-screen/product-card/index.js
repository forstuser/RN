import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions
} from "react-native";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/Entypo";
import { Navigation } from "react-native-navigation";

import Modal from "react-native-modal";

import ActionSheet from "react-native-actionsheet";

import { SCREENS, MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../../constants";
import { API_BASE_URL, getProductDetails } from "../../../api";
import { Text, Button, ScreenContainer } from "../../../elements";

import Analytics from "../../../analytics";

import I18n from "../../../i18n";

import { colors } from "../../../theme";

import Header from "./header";
import CustomerCare from "./customer-care";
import AllInfo from "./all-info";
import Important from "./important";
import ImportantTab from "../important-tab";
import GeneralTab from "../general-tab";
import SellerTab from "../seller-tab";
import ContactAfterSaleButton from "../after-sale-button";
import LoadingOverlay from "../../../components/loading-overlay";

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 1,
      showCustomerCareTab: false,
      showImportantTab: true
    };
  }

  componentDidMount() {
    const { product } = this.props;
    const { brand, insuranceDetails, warrantyDetails } = product;

    let newState = {};
    if (
      (brand && brand.id > 0 && brand.status_type == 1) ||
      (insuranceDetails.length > 0 &&
        insuranceDetails[0].provider &&
        insuranceDetails[0].provider.status_type == 1) ||
      (warrantyDetails.length > 0 &&
        warrantyDetails[0].provider &&
        warrantyDetails[0].provider.status_type == 1)
    ) {
      newState = {
        activeTabIndex: 0,
        showCustomerCareTab: true
      };
    }

    if (
      [
        MAIN_CATEGORY_IDS.FASHION,
        MAIN_CATEGORY_IDS.HEALTHCARE,
        MAIN_CATEGORY_IDS.TRAVEL,
        MAIN_CATEGORY_IDS.HOUSEHOLD
      ].indexOf(product.masterCategoryId) > -1
    ) {
      newState.showImportantTab = false;
    }

    if (product.categoryId == CATEGORY_IDS.HOUSEHOLD.HOME_DECOR) {
      newState.showImportantTab = true;
    }

    this.setState(newState);
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

  onTabChange = index => {
    this.setState({
      activeTabIndex: index
    });
  };

  handleScroll = event => {
    if (!this.props.isScreenVisible) {
      return;
    }

    if (event.nativeEvent.contentOffset.y > 0) {
      this.props.navigator.setStyle({
        navBarTransparent: false,
        navBarBackgroundColor: "#fff",
        ...Platform.select({
          ios: {},
          android: {
            topBarElevationShadowEnabled: true
          }
        })
      });
    } else {
      this.props.navigator.setStyle({
        navBarTransparent: true,
        navBarBackgroundColor: "transparent",
        ...Platform.select({
          ios: {},
          android: {
            topBarElevationShadowEnabled: false
          }
        })
      });
    }
  };

  render() {
    const {
      activeTabIndex,
      showCustomerCareTab,
      showImportantTab
    } = this.state;
    const { product, openServiceSchedule } = this.props;

    const cardWidthWhenMany = Dimensions.get("window").width - 52;
    const cardWidthWhenOne = Dimensions.get("window").width - 32;

    return (
      <View style={styles.container}>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          onScroll={this.handleScroll}
          style={styles.container}
        >
          <Header
            activeTabIndex={activeTabIndex}
            showCustomerCareTab={showCustomerCareTab}
            showImportantTab={showImportantTab}
            onTabChange={this.onTabChange}
            product={product}
            navigator={this.props.navigator}
          />
          <View style={styles.pages}>
            {activeTabIndex == 0 && (
              <CustomerCare
                product={product}
                navigator={this.props.navigator}
                scrollScreenToBottom={() =>
                  this.scrollView.scrollToEnd({ animated: true })
                }
                cardWidthWhenMany={cardWidthWhenMany}
                cardWidthWhenOne={cardWidthWhenOne}
              />
            )}
            {activeTabIndex == 1 && (
              <AllInfo product={product} navigator={this.props.navigator} />
            )}
            {activeTabIndex == 2 && (
              <Important
                product={product}
                navigator={this.props.navigator}
                cardWidthWhenMany={cardWidthWhenMany}
                cardWidthWhenOne={cardWidthWhenOne}
              />
            )}
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
