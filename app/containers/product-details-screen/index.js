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
import { API_BASE_URL, getProductDetails, deleteProduct } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import I18n from "../../i18n";

import { colors } from "../../theme";

import Details from "./details";
import ImportantTab from "./important-tab";
import GeneralTab from "./general-tab";
import SellerTab from "./seller-tab";
import ContactAfterSaleButton from "./after-sale-button";
import LoadingOverlay from "../../components/loading-overlay";
import ProductCard from "./product-card";
import PersonalDocCard from "./personal-doc-card";
import InsuranceCard from "./insurance-card";
import MedicalDocsCard from "./medical-docs-card";

const NavOptionsButton = () => (
  <TouchableOpacity
    onPress={() =>
      Navigation.handleDeepLink({ link: "product-nav-options-btn" })
    }
  >
    <Icon name="dots-three-vertical" size={17} color={colors.pinkishOrange} />
  </TouchableOpacity>
);

Navigation.registerComponent("NavOptionsButton", () => NavOptionsButton);

class ProductDetailsScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  static navigatorButtons = {
    rightButtons: [
      {
        component: "NavOptionsButton"
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      product: {}
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("product_details_screen_title")
    });
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.fetchProductDetails();
        break;
    }

    if (event.type == "DeepLink") {
      //when you press the button, it will be called here
      if (event.link == "product-nav-options-btn") {
        this.editOptions.show();
      }
    }
  };

  handleEditOptionPress = index => {
    const { product } = this.state;
    let openPickerOnStart = null;
    switch (index) {
      case 0:
        Alert.alert(
          `Delete ${product.productName || ""}?`,
          "This will be an irreversible task.",
          [
            {
              text: "Yes, delete",
              onPress: async () => {
                this.setState({ isLoading: true });
                await deleteProduct(product.id);
                this.props.navigator.pop();
              }
            },
            {
              text: "No, don't Delete",
              onPress: () => {},
              style: "cancel"
            }
          ]
        );
        break;
    }
  };

  fetchProductDetails = async () => {
    try {
      this.setState({
        isLoading: true
      });
      const res = await getProductDetails(this.props.productId);
      this.setState(
        {
          product: res.product
        },
        () =>
          this.setState({
            isLoading: false
          })
      );
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    const { product, isLoading } = this.state;
    let content = null;
    if (isLoading) {
      content = <LoadingOverlay visible={isLoading} />;
    } else if (product.masterCategoryId == MAIN_CATEGORY_IDS.PERSONAL) {
      content = (
        <PersonalDocCard product={product} navigator={this.props.navigator} />
      );
    } else if (product.categoryId == 664) {
      //insurance
      content = (
        <InsuranceCard product={product} navigator={this.props.navigator} />
      );
    } else if (product.categoryId == 86) {
      //medical docs
      content = (
        <MedicalDocsCard product={product} navigator={this.props.navigator} />
      );
    } else {
      content = (
        <ProductCard product={product} navigator={this.props.navigator} />
      );
    }
    return (
      <ScreenContainer style={{ padding: 0 }}>
        {content}
        <ActionSheet
          onPress={this.handleEditOptionPress}
          ref={o => (this.editOptions = o)}
          cancelButtonIndex={1}
          options={["Delete", "Cancel"]}
        />
      </ScreenContainer>
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

export default ProductDetailsScreen;
