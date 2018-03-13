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
import _ from "lodash";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/Entypo";
import { Navigation } from "react-native-navigation";

import Modal from "react-native-modal";

import { SCREENS } from "../../constants";
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
import KeyValueItem from "../../components/key-value-item";
import MultipleContactNumbers from "./multiple-contact-numbers";

let mapIcon = require("../../images/ic_details_map.png");
const visitingCardIcon = require("../../images/main-categories/ic_visiting_card.png");
const personalDocIcon = require("../../images/main-categories/ic_personal_doc.png");

import { openBillsPopUp } from "../../navigation";

import ViewBillButton from "./view-bill-button";

class PerosnalDocCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onEditPress = () => {
    const { product } = this.props;
    let seller = {
      name: "",
      contact: "",
      email: "",
      address: ""
    };

    if (product.sellers) {
      seller = {
        name: product.sellers.sellerName || "",
        contact: product.sellers.contact || "",
        email: product.sellers.email || "",
        address: product.sellers.address || ""
      };
    }

    this.props.navigator.push({
      screen: SCREENS.ADD_EDIT_PERSONAL_DOC_SCREEN,
      passProps: {
        categoryId: product.categoryId,
        productId: product.id,
        jobId: product.jobId,
        name: product.productName,
        businessName: seller.name,
        phone: seller.contact,
        email: seller.email,
        address: seller.address,
        copies: product.copies || []
      },
      overrideBackPress: true
    });
  };

  render() {
    const { product } = this.props;

    let productName = product.productName;
    if (!productName) {
      productName = product.sub_category_name || product.categoryName;
    }

    let seller = {
      sellerName: "",
      city: "",
      contact: "",
      email: "",
      address: "",
      state: ""
    };

    if (product.sellers) {
      seller = {
        sellerName: product.sellers.sellerName || "",
        city: product.sellers.city || "",
        state: product.sellers.state || "",
        contact: product.sellers.contact || "",
        email: product.sellers.email || "",
        address: product.sellers.address || ""
      };
    }

    let imageSource = personalDocIcon;

    //visiting card
    if (product.categoryId == 27) {
      imageSource = visitingCardIcon;
    }

    if (product.copies && product.copies.length > 0) {
      imageSource = { uri: API_BASE_URL + product.copies[0].copyUrl };
    }

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <ViewBillButton
            product={product}
            navigator={navigator}
            docType="Personal Doc"
            btnText="Doc"
          />
          <Image
            style={styles.image}
            source={imageSource}
            resizeMode="contain"
          />
          <Text weight="Bold" style={styles.name}>
            {productName}
          </Text>
          <TouchableOpacity
            onPress={this.onEditPress}
            style={{
              marginTop: 20,
              width: "100%",
              backgroundColor: "#EBEBEB"
            }}
          >
            <KeyValueItem
              KeyComponent={() => (
                <Text
                  weight="Bold"
                  style={{
                    flex: 1,
                    color: colors.mainText,
                    fontSize: 16
                  }}
                >
                  General Info
                </Text>
              )}
              ValueComponent={() => (
                <Text
                  weight="Bold"
                  style={{
                    textAlign: "right",
                    flex: 1,
                    color: colors.pinkishOrange
                  }}
                >
                  EDIT
                </Text>
              )}
            />
          </TouchableOpacity>
          <KeyValueItem keyText="Name" valueText={product.productName} />
          {product.categoryId == 27 && (
            <View style={{ width: "100%" }}>
              <KeyValueItem
                keyText="Business Name"
                valueText={seller.sellerName}
              />
              <KeyValueItem
                keyText="Phone Number"
                ValueComponent={() => (
                  <MultipleContactNumbers contact={seller.contact} />
                )}
              />
              <KeyValueItem
                keyText="Email"
                ValueComponent={() => (
                  <MultipleContactNumbers contact={seller.email} />
                )}
              />

              {(seller.address.length > 0 ||
                seller.city.length > 0 ||
                seller.state.length > 0) && (
                <KeyValueItem
                  KeyComponent={() => (
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.secondaryText }}>
                        Full Address
                      </Text>
                      <Text weight="Medium" style={{ color: colors.mainText }}>
                        {_.trim(
                          seller.address +
                            ", " +
                            seller.city +
                            ", " +
                            seller.state,
                          ", "
                        )}
                      </Text>
                    </View>
                  )}
                  ValueComponent={() => (
                    <TouchableOpacity
                      onPress={this.openMap}
                      style={{ width: 70 }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Image
                          style={{ width: 24, height: 24 }}
                          source={mapIcon}
                        />
                        <Text
                          weight="Bold"
                          style={{ fontSize: 10, color: colors.pinkishOrange }}
                        >
                          {I18n.t("product_details_screen_seller_find_store")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  contentContainer: {
    alignItems: "center"
  },
  image: {
    width: 300,
    height: 100,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20
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

export default PerosnalDocCard;
