import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/Entypo";
import { Navigation } from "react-native-navigation";

import Analytics from "../../analytics";

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
import UploadProductImage from "../../components/upload-product-image";
import ProductCard from "./product-card";
import PersonalDocCard from "./personal-doc-card";
import InsuranceCard from "./insurance-card";
import MedicalDocsCard from "./medical-docs-card";

const NavOptionsButton = ({ addImageText }) => (
  <View
    style={{
      flexDirection: "row",
      backgroundColor: "transparent",
      ...Platform.select({
        ios: {},
        android: {
          position: "absolute",
          top: 10,
          right: 4,
          width: 100,
          height: 30,
          alignItems: "center",
          justifyContent: "flex-end"
        }
      })
    }}
  >
    {addImageText ? (
      <TouchableOpacity
        style={{ marginRight: 20, flexDirection: "row", alignItems: "center" }}
        onPress={() =>
          Navigation.handleDeepLink({ link: "product-nav-add-product-pic-btn" })
        }
      >
        <Icon name="camera" size={17} color={colors.pinkishOrange} />
        <Text
          weight="Bold"
          style={{ marginLeft: 5, fontSize: 9, color: colors.pinkishOrange }}
        >
          {addImageText}
        </Text>
      </TouchableOpacity>
    ) : null}

    <TouchableOpacity
      style={{
        ...Platform.select({
          ios: {},
          android: {
            marginRight: 10
          }
        })
      }}
      onPress={() =>
        Navigation.handleDeepLink({ link: "product-nav-options-btn" })
      }
    >
      <Icon name="dots-three-vertical" size={17} color={colors.pinkishOrange} />
    </TouchableOpacity>
  </View>
);

Navigation.registerComponent("NavOptionsButton", () => NavOptionsButton);

class ProductDetailsScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    drawUnderNavBar: true,
    navBarBackgroundColor: "#fff"
  };

  constructor(props) {
    super(props);
    this.state = {
      isScreenVisible: true,
      isLoading: true,
      product: {},
      openServiceSchedule: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("product_details_screen_title")
    });

    if (this.props.screenOpts) {
      const screenOpts = this.props.screenOpts;
      if (screenOpts.openServiceSchedule) {
        this.setState({ openServiceSchedule: true });
      }
    }
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        if (!this.props.productId) {
          return this.props.navigator.pop();
        }
        this.setState({
          isScreenVisible: true
        });
        this.fetchProductDetails();
        break;
      case "willDisappear":
        this.setState(
          {
            isScreenVisible: false
          },
          () => {
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
          }
        );
    }

    if (event.type == "DeepLink") {
      //when you press the button, it will be called here
      if (event.link == "product-nav-options-btn") {
        this.editOptions.show();
      } else if (event.link == "product-nav-add-product-pic-btn") {
        this.uploadProductImage.showOptions();
      }
    }
  };

  handleEditOptionPress = index => {
    const { product } = this.state;
    let openPickerOnStart = null;
    switch (index) {
      case 0:
        Analytics.logEvent(Analytics.EVENTS.PRODUCT_DELETE_INITIATED);
        Alert.alert(
          `Are you sure?`,
          "All the information and document copies related to this product will be deleted.",
          [
            {
              text: I18n.t("product_details_screen_yes_delete"),
              onPress: async () => {
                Analytics.logEvent(Analytics.EVENTS.PRODUCT_DELETE_COMPLETE);
                this.setState({ isLoading: true });
                await deleteProduct(product.id);
                this.props.navigator.pop();
              }
            },
            {
              text: I18n.t("product_details_screen_no_dnt_delete"),
              onPress: () => {
                Analytics.logEvent(Analytics.EVENTS.PRODUCT_DELETE_CANCELED);
              },
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
        // isLoading: true
      });
      const res = await getProductDetails(this.props.productId);
      const { product } = res;
      if (
        product.masterCategoryId == MAIN_CATEGORY_IDS.PERSONAL ||
        product.categoryId == 86
      ) {
        this.props.navigator.setStyle({
          drawUnderNavBar: false,
          navBarTranslucent: false,
          navBarTransparent: false,
          navBarBackgroundColor: "#fff",
          topBarElevationShadowEnabled: true
        });
      } else if (this.state.isLoading) {
        this.props.navigator.setStyle({
          drawUnderNavBar: true,
          navBarTranslucent: Platform.OS === "ios",
          navBarTransparent: true,
          navBarBackgroundColor: "#fff",
          topBarElevationShadowEnabled: false
        });
      }

      let addImageText = "";
      if (
        [
          MAIN_CATEGORY_IDS.AUTOMOBILE,
          MAIN_CATEGORY_IDS.ELECTRONICS,
          MAIN_CATEGORY_IDS.FURNITURE,
          MAIN_CATEGORY_IDS.FASHION,
          MAIN_CATEGORY_IDS.TRAVEL
        ].indexOf(res.product.masterCategoryId) > -1
      ) {
        addImageText = "Add";
        if (res.product.file_type) {
          addImageText = "Edit";
        }
      }
      this.props.navigator.setButtons({
        rightButtons: [
          {
            component: "NavOptionsButton",
            passProps: { addImageText }
          }
        ],
        animated: true
      });

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
    const {
      isScreenVisible,
      product,
      isLoading,
      openServiceSchedule
    } = this.state;
    let content = null;
    if (isLoading) {
      content = <LoadingOverlay visible={isLoading} />;
    } else if (product.masterCategoryId == MAIN_CATEGORY_IDS.PERSONAL) {
      content = (
        <PersonalDocCard product={product} navigator={this.props.navigator} />
      );
    } else if (product.categoryId == 86) {
      // else if (product.categoryId == 664) {
      //   //insurance
      //   content = (
      //     <InsuranceCard product={product} navigator={this.props.navigator} />
      //   );
      // }
      //medical docs
      content = (
        <MedicalDocsCard product={product} navigator={this.props.navigator} />
      );
    } else {
      content = (
        <ProductCard
          isScreenVisible={isScreenVisible}
          product={product}
          navigator={this.props.navigator}
          openServiceSchedule={openServiceSchedule}
        />
      );
    }
    return (
      <ScreenContainer style={{ padding: 0 }}>
        {content}
        <UploadProductImage
          ref={ref => (this.uploadProductImage = ref)}
          productId={this.props.productId}
          onImageUpload={() => {
            Alert.alert(I18n.t("product_image_updated"));
            this.fetchProductDetails();
          }}
        />
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
