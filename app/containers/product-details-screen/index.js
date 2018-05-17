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

import Analytics from "../../analytics";

import Modal from "react-native-modal";

import ActionSheet from "react-native-actionsheet";

import { SCREENS, MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../constants";
import { API_BASE_URL, getProductDetails, deleteProduct } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import I18n from "../../i18n";
import { showSnackbar } from "../../utils/snackbar";

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

// const NavOptionsButton = ({ addImageText }) => (
//   <View collapsable={false}
//     style={{
//       flexDirection: "row",
//       backgroundColor: "transparent",
//       ...Platform.select({
//         ios: {},
//         android: {
//           position: "absolute",
//           top: 10,
//           right: 4,
//           width: 100,
//           height: 30,
//           alignItems: "center",
//           justifyContent: "flex-end"
//         }
//       })
//     }}
//   >
//     {addImageText ? (
//       <TouchableOpacity
//         style={{ marginRight: 20, flexDirection: "row", alignItems: "center" }}
//         onPress={() =>
//           Navigation.handleDeepLink({ link: "product-nav-add-product-pic-btn" })
//         }
//       >
//         <Icon name="camera" size={17} color={colors.pinkishOrange} />
//         <Text
//           weight="Bold"
//           style={{ marginLeft: 5, fontSize: 9, color: colors.pinkishOrange }}
//         >
//           {addImageText}
//         </Text>
//       </TouchableOpacity>
//     ) : null}

//     <TouchableOpacity
//       style={{
//         ...Platform.select({
//           ios: {},
//           android: {
//             marginRight: 10
//           }
//         })
//       }}
//       onPress={() =>
//         Navigation.handleDeepLink({ link: "product-nav-options-btn" })
//       }
//     >
//       <Icon name="dots-three-vertical" size={17} color={colors.pinkishOrange} />
//     </TouchableOpacity>
//   </View>
// );

// Navigation.registerComponent("NavOptionsButton", () => NavOptionsButton);

class ProductDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params.title ? params.title : "Product Details",
      headerTransparent: false //params.headerTransparent
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      productId: null,
      isScreenVisible: true,
      isLoading: true,
      product: {},
      openServiceSchedule: false
    };
  }

  async componentDidMount() {
    // this.props.navigation.setTitle({
    //   title: I18n.t("product_details_screen_title")
    // });
    const { navigation } = this.props;
    this.setState(
      {
        productId: navigation.getParam("productId", null)
      },
      () => {
        this.fetchProductDetails();
      }
    );
    const didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      payload => {
        console.debug("didFocus", payload);
      }
    );
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        console.log("didAppear");
        if (!this.state.productId) {
          return this.props.navigation.goBack();
        }
        this.setState(
          {
            isScreenVisible: true
          },
          () => {
            this.fetchProductDetails();
          }
        );

        break;
      case "willDisappear":
        console.log("willDisappear");
        this.setState(
          {
            isScreenVisible: false
          },
          () => {}
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
        Alert.alert(
          `Are you sure?`,
          "All the information and document copies related to this product will be deleted.",
          [
            {
              text: I18n.t("product_details_screen_yes_delete"),
              onPress: async () => {
                Analytics.logEvent(Analytics.EVENTS.DELETE_PRODUCT);
                this.setState({ isLoading: true });
                await deleteProduct(product.id);
                this.props.navigation.goBack();
              }
            },
            {
              text: I18n.t("product_details_screen_no_dnt_delete"),
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
        // isLoading: true
      });
      const res = await getProductDetails(this.state.productId);

      if (this.state.isScreenVisible) {
        const { product } = res;
        if (
          product.masterCategoryId == MAIN_CATEGORY_IDS.PERSONAL ||
          product.categoryId == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC
        ) {
          //normal header bar
        } else if (this.state.isLoading) {
          this.props.navigation.setParams({ headerTransparent: true });
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

        let title = I18n.t("product_details_screen_title");
        if (
          [
            MAIN_CATEGORY_IDS.TRAVEL,
            MAIN_CATEGORY_IDS.SERVICES,
            MAIN_CATEGORY_IDS.HEALTHCARE,
            MAIN_CATEGORY_IDS.HOUSEHOLD
          ].indexOf(product.masterCategoryId) > -1
        ) {
          title = "Expense Details";
        }
        switch (product.categoryId) {
          case CATEGORY_IDS.HEALTHCARE.INSURANCE:
            title = "Insurance Details";
            break;
          case CATEGORY_IDS.PERSONAL.VISITING_CARD:
            title = "Visiting Card Details";
            break;
          case CATEGORY_IDS.PERSONAL.RENT_AGREEMENT:
          case CATEGORY_IDS.PERSONAL.OTHER_PERSONAL_DOC:
          case CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC:
            title = "Document Details";
            break;
        }

        this.props.navigation.setParams({ title: title });
        // this.props.navigation.setTitle({
        //   title
        // });
        // this.props.navigation.setButtons({
        //   rightButtons: [
        //     {
        //       component: "NavOptionsButton",
        //       passProps: { addImageText }
        //     }
        //   ],
        //   animated: true
        // });

        this.setState(
          {
            product: res.product
          },
          () =>
            this.setState({
              isLoading: false
            })
        );
      }
    } catch (e) {
      showSnackbar({
        text: e.message
      });
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
        <PersonalDocCard product={product} navigation={this.props.navigation} />
      );
    } else if (product.categoryId == 86) {
      // else if (product.categoryId == 664) {
      //   //insurance
      //   content = (
      //     <InsuranceCard product={product} navigation={this.props.navigation} />
      //   );
      // }
      //medical docs
      content = (
        <MedicalDocsCard product={product} navigation={this.props.navigation} />
      );
    } else {
      content = (
        <ProductCard
          isScreenVisible={isScreenVisible}
          product={product}
          fetchProductDetails={this.fetchProductDetails}
          navigation={this.props.navigation}
          openServiceSchedule={openServiceSchedule}
        />
      );
    }
    return (
      <ScreenContainer style={{ padding: 0 }}>
        {content}
        <UploadProductImage
          ref={ref => (this.uploadProductImage = ref)}
          productId={this.state.productId}
          onImageUpload={() => {
            showSnackbar({
              text: I18n.t("product_image_updated")
            });
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
