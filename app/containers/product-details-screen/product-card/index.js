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

import { connect } from "react-redux";
import { actions as uiActions } from "../../../modules/ui";
import Tour from "../../../components/app-tour";

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
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.updateStateFromProps(newProps);
  }

  updateStateFromProps = props => {
    const { product } = props;
    const { brand, insuranceDetails, warrantyDetails } = product;

    let newState = {};
    if (
      ((brand && brand.id > 0 && brand.status_type == 1) ||
        (insuranceDetails.length > 0 &&
          insuranceDetails[0].provider &&
          insuranceDetails[0].provider.status_type == 1) ||
        (warrantyDetails.length > 0 &&
          warrantyDetails[0].provider &&
          warrantyDetails[0].provider.status_type == 1)) &&
      product.masterCategoryId != MAIN_CATEGORY_IDS.FASHION
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

    if (
      !props.hasProductCardTourShown &&
      [
        MAIN_CATEGORY_IDS.AUTOMOBILE,
        MAIN_CATEGORY_IDS.ELECTRONICS,
        MAIN_CATEGORY_IDS.FURNITURE,
        MAIN_CATEGORY_IDS.FASHION
      ].indexOf(product.masterCategoryId) > -1
    ) {
      setTimeout(() => {
        this.tour.startTour();
        props.setUiHasProductCardTourShown(true);
      }, 1000);
    }
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
    if (index === 1) {
      Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ALL_INFO);
    } else if (index === 2) {
      Analytics.logEvent(Analytics.EVENTS.CLICK_ON_IMPORTANT);
    }
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
            viewBillRef={ref => (this.viewBillRef = ref)}
            shareBtnRef={ref => (this.shareBtnRef = ref)}
            reviewBtnRef={ref => (this.reviewBtnRef = ref)}
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
                scrollScreenToAsc={y =>
                  this.scrollView.scrollTo({ y: y + 100, animated: true })
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
        <View
          style={styles.centerRefDummy}
          ref={ref => (this.centerRef = ref)}
        />
        <View
          style={styles.addProductImageBtnDummy}
          ref={ref => (this.addProductImageRef = ref)}
        />
        <Tour
          ref={ref => (this.tour = ref)}
          enabled={true}
          steps={[
            {
              ref: this.centerRef,
              text: I18n.t("product_card_tip", {
                categoryName: product.categoryName || ""
              })
            },
            {
              ref: this.viewBillRef,
              text: I18n.t("product_card_upload_bill_tip")
            },
            { ref: this.shareBtnRef, text: I18n.t("product_card_share_tip") },
            { ref: this.reviewBtnRef, text: I18n.t("product_card_review_tip") },
            {
              ref: this.addProductImageRef,
              text: I18n.t("product_card_add_image_tip")
            }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  pages: {
    marginTop: 20
  },
  centerRefDummy: {
    position: "absolute",
    top: "50%",
    right: "50%",
    width: 1,
    height: 0,
    backgroundColor: "transparent"
  },
  addProductImageBtnDummy: {
    position: "absolute",
    opacity: 1,
    ...Platform.select({
      ios: {
        top: 27,
        right: 47,
        width: 50,
        height: 30
      },
      android: {
        top: 15,
        right: 45,
        width: 50,
        height: 30
      }
    })
  }
});

const mapStateToProps = state => {
  return {
    hasProductCardTourShown: state.ui.hasProductCardTourShown
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUiHasProductCardTourShown: newValue => {
      dispatch(uiActions.setUiHasProductCardTourShown(newValue));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
