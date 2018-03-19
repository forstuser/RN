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
// import AllInfo from "./all-info";
// import Important from "./important";
import LoadingOverlay from "../../components/loading-overlay";

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
      item: null,
      isFetchingItemDetails: true,
      activeTabIndex: 0,
      showCustomerCareTab: false,
      showImportantTab: true
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("calendar_service_screen_title")
    });
    this.fetchItemDetails(this.props.itemId);
  }

  fetchItemDetails = async itemId => {
    this.setState({
      isFetchingItemDetails: true
    });

    const newState = {};
    try {
      const res = await fetchCalendarItemById(itemId);
      newState.item = res.item;
      this.setState({
        item: res.item
      });
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

  handleScroll = event => {
    if (!this.props.isScreenVisible) {
      return;
    }
    console.log(
      "event.nativeEvent.contentOffset: ",
      event.nativeEvent.contentOffset
    );
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
      showCustomerCareTab,
      showImportantTab
    } = this.state;

    const cardWidthWhenMany = Dimensions.get("window").width - 52;
    const cardWidthWhenOne = Dimensions.get("window").width - 32;

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
              item={item}
              navigator={this.props.navigator}
            />
            <View style={styles.pages}>
              {activeTabIndex == 0 && (
                <Attendance item={item} navigator={this.props.navigator} />
              )}
              {/*{activeTabIndex == 1 && (
              <AllInfo product={product} navigator={this.props.navigator} />
            )}
            {activeTabIndex == 2 && (
              <Important
                product={product}
                navigator={this.props.navigator}
                cardWidthWhenMany={cardWidthWhenMany}
                cardWidthWhenOne={cardWidthWhenOne}
              />
            )}*/}
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
