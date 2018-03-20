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

import { SCREENS, MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../constants";
import { API_BASE_URL, fetchCalendarItemById } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import Analytics from "../../analytics";

import I18n from "../../i18n";

import { colors } from "../../theme";

import Header from "./header";
import Attendance from "./attendance";
import Report from "./report";
import OtherDetails from "./other-details";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

class CalendarServiceCard extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    drawUnderNavBar: true,
    navBarTranslucent: Platform.OS === "ios",
    navBarTransparent: true,
    navBarBackgroundColor: "#fff",
    topBarElevationShadowEnabled: false
  };

  constructor(props) {
    super(props);
    this.state = {
      isScreenVisible: true,
      item: null,
      isFetchingItemDetails: true,
      activeTabIndex: 0,
      activePaymentDetailIndex: 0,
      showCustomerCareTab: false,
      showImportantTab: true,
      error: null
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("calendar_service_screen_title")
    });
    this.fetchItemDetails();
  }

  fetchItemDetails = async () => {
    this.setState({
      isFetchingItemDetails: true,
      error: null
    });

    const newState = {};
    try {
      const res = await fetchCalendarItemById(this.props.itemId);
      newState.item = res.item;
    } catch (e) {
      newState.error = e;
    }
    newState.isFetchingItemDetails = false;
    this.setState(newState);
  };

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

  onPaymentDetailIndexChange = index => {
    const { item } = this.state;
    const paymentDetails = item.payment_detail;
    if (index < 0 || index == paymentDetails.length) return;
    this.setState({
      activePaymentDetailIndex: index
    });
  };

  handleScroll = event => {
    if (!this.state.isScreenVisible) {
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
      item,
      isFetchingItemDetails,
      activeTabIndex,
      activePaymentDetailIndex,
      showCustomerCareTab,
      showImportantTab,
      error
    } = this.state;

    const cardWidthWhenMany = Dimensions.get("window").width - 52;
    const cardWidthWhenOne = Dimensions.get("window").width - 32;

    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchItems} />;
    }

    return (
      <View style={styles.container}>
        {item && (
          <ScrollView
            ref={ref => (this.scrollView = ref)}
            onScroll={this.handleScroll}
            style={styles.container}
          >
            <Header
              activeTabIndex={activeTabIndex}
              onTabChange={this.onTabChange}
              activePaymentDetailIndex={activePaymentDetailIndex}
              onPaymentDetailIndexChange={this.onPaymentDetailIndexChange}
              item={item}
              navigator={this.props.navigator}
            />
            <View style={styles.pages}>
              {activeTabIndex == 0 && (
                <Attendance
                  item={item}
                  navigator={this.props.navigator}
                  activePaymentDetailIndex={activePaymentDetailIndex}
                  onPaymentDetailIndexChange={this.onPaymentDetailIndexChange}
                  reloadScreen={this.fetchItemDetails}
                />
              )}
              {activeTabIndex == 1 && (
                <Report
                  item={item}
                  navigator={this.props.navigator}
                  activePaymentDetailIndex={activePaymentDetailIndex}
                  onPaymentDetailIndexChange={this.onPaymentDetailIndexChange}
                  reloadScreen={this.fetchItemDetails}
                />
              )}
              {activeTabIndex == 2 && (
                <OtherDetails
                  item={item}
                  navigator={this.props.navigator}
                  activePaymentDetailIndex={activePaymentDetailIndex}
                  onPaymentDetailIndexChange={this.onPaymentDetailIndexChange}
                  reloadScreen={this.fetchItemDetails}
                />
              )}
            </View>
          </ScrollView>
        )}
        <LoadingOverlay visible={isFetchingItemDetails} />
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

export default CalendarServiceCard;