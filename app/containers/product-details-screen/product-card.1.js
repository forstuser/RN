import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated
} from "react-native";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
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

const initialLayout = {
  height: 0,
  width: Dimensions.get("window").width
};

const HEADER_HEIGHT = 390;
const COLLAPSED_HEIGHT = 72;
const SCROLLABLE_HEIGHT = HEADER_HEIGHT - COLLAPSED_HEIGHT;

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "1", title: "First" },
        { key: "2", title: "Second" },
        { key: "3", title: "Third" }
      ],
      scroll: new Animated.Value(0)
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => {
    const translateY = this.state.scroll.interpolate({
      inputRange: [0, SCROLLABLE_HEIGHT],
      outputRange: [0, -SCROLLABLE_HEIGHT],
      extrapolate: "clamp"
    });

    return (
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <Details
          product={this.props.product}
          navigator={this.props.navigator}
        />
        <TabBar {...props} style={styles.tabbar} />
      </Animated.View>
    );
  };

  _renderScene = SceneMap({
    "1": () =>
      this.props.product.masterCategoryId != MAIN_CATEGORY_IDS.TRAVEL ? (
        <ImportantTab
          tabLabel="IMPORTANT"
          product={this.props.product}
          navigator={this.props.navigator}
          openServiceSchedule={this.props.openServiceSchedule}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scroll } } }],
            { useNativeDriver: true }
          )}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        />
      ) : null,
    "2": () => (
      <SellerTab
        tabLabel="SELLER"
        product={this.props.product}
        onEditPress={this.startBasicDetailsEdit}
        fetchProductDetails={this.fetchProductDetails}
      />
    ),
    "3": () => (
      <GeneralTab
        tabLabel="GENERAL INFO"
        product={this.props.product}
        onEditPress={this.startBasicDetailsEdit}
        fetchProductDetails={this.fetchProductDetails}
      />
    )
  });

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

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
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
        <ScrollView contentContainerStyle={{}}>
          <Details product={product} navigator={this.props.navigator} />

          <TabViewAnimated
            style={styles.container}
            navigationState={this.state}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            initialLayout={initialLayout}
          />
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
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden"
  },
  tabbar: {
    backgroundColor: "rgba(0, 0, 0, .32)",
    elevation: 0,
    shadowOpacity: 0
  },
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
