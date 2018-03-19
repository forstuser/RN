import React from "react";
import { StyleSheet, Image, View, TouchableOpacity } from "react-native";
import moment from "moment";
import _ from "lodash";
import getDirections from "react-native-google-maps-directions";

import Analytics from "../../analytics";

import KeyValueItem from "../../components/key-value-item";
import MultipleContactNumbers from "../../components/multiple-contact-numbers";
import { Text, Button } from "../../elements";
import { colors } from "../../theme";
import I18n from "../../i18n";

import { MAIN_CATEGORY_IDS, SCREENS } from "../../constants";

let mapIcon = require("../../images/ic_details_map.png");

class AllInfo extends React.Component {
  onEditPress = () => {
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
  openMap = () => {
    const seller = this.props.product.sellers;
    const address = [seller.address, seller.city, seller.state].join(", ");
    const data = {
      params: [
        {
          key: "daddr",
          value: address
        }
      ]
    };

    getDirections(data);
  };
  render() {
    const { product } = this.props;
    let dateText = "Date";
    if (
      [
        MAIN_CATEGORY_IDS.AUTOMOBILE,
        MAIN_CATEGORY_IDS.ELECTRONICS,
        MAIN_CATEGORY_IDS.FURNITURE
      ].indexOf(product.masterCategoryId) > -1
    ) {
      dateText = "Purchase Date";
    }

    let seller = {
      categoryName: "",
      sellerName: "",
      city: "",
      contact: "",
      address: "",
      state: ""
    };

    if (product.sellers) {
      seller = {
        categoryName: product.categoryName || "",
        sellerName: product.sellers.sellerName || "",
        city: product.sellers.city || "",
        state: product.sellers.state || "",
        contact: product.sellers.contact || "",
        address: product.sellers.address || ""
      };
    }

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity
            onPress={this.onEditPress}
            style={{ flex: 1, backgroundColor: "#EBEBEB" }}
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
                  {I18n.t("product_details_screen_general_details")}
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
                  {I18n.t("product_details_screen_edit")}
                </Text>
              )}
            />
          </TouchableOpacity>
          <KeyValueItem
            keyText={I18n.t("product_details_screen_main_category")}
            valueText={product.masterCategoryName}
          />
          <KeyValueItem
            keyText={I18n.t("product_details_screen_category")}
            valueText={product.categoryName}
          />
          {product.sub_category_name && (
            <KeyValueItem
              keyText={I18n.t("product_details_screen_sub_category")}
              valueText={product.sub_category_name}
            />
          )}
          {product.brand && (
            <KeyValueItem
              keyText={I18n.t("product_details_screen_brand")}
              valueText={product.brand.name}
            />
          )}
          {product.model ? (
            <KeyValueItem
              keyText={I18n.t("product_details_screen_model")}
              valueText={product.model}
            />
          ) : null}
          <KeyValueItem
            keyText={dateText}
            valueText={
              product.purchaseDate
                ? moment(product.purchaseDate).format("MMM DD, YYYY")
                : "-"
            }
          />
          {product.metaData.map((metaItem, index) => (
            <KeyValueItem
              key={index}
              keyText={metaItem.name}
              valueText={metaItem.value}
            />
          ))}
        </View>
        <View style={styles.card}>
          <TouchableOpacity
            onPress={this.onEditPress}
            style={{ flex: 1, backgroundColor: "#EBEBEB" }}
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
                  {I18n.t("product_details_screen_seller_details")}
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
                  {I18n.t("product_details_screen_edit")}
                </Text>
              )}
            />
          </TouchableOpacity>
          <KeyValueItem
            keyText={I18n.t("product_details_screen_seller_category")}
            valueText={product.categoryName || "-"}
          />
          <KeyValueItem
            keyText={I18n.t("product_details_screen_seller_name")}
            valueText={seller.sellerName || "-"}
          />
          <KeyValueItem
            keyText={I18n.t("product_details_screen_seller_location")}
            valueText={_.trim(seller.city + ", " + seller.state, ", ") || "-"}
          />
          <KeyValueItem
            keyText="Contact No."
            ValueComponent={() => (
              <MultipleContactNumbers contact={seller.contact} />
            )}
          />
          {(seller.address.length > 0 ||
            seller.city.length > 0 ||
            seller.state.length > 0) && (
            <KeyValueItem
              KeyComponent={() => (
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.secondaryText }}>
                    {I18n.t("product_details_screen_seller_address")}
                  </Text>
                  <Text weight="Medium" style={{ color: colors.mainText }}>
                    {_.trim(
                      seller.address + ", " + seller.city + ", " + seller.state,
                      ", "
                    )}
                  </Text>
                </View>
              )}
              ValueComponent={() => (
                <TouchableOpacity onPress={this.openMap} style={{ width: 70 }}>
                  <View style={{ alignItems: "center" }}>
                    <Image style={{ width: 24, height: 24 }} source={mapIcon} />
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 30,
    borderRadius: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  }
});

export default AllInfo;
