import React from "react";
import { StyleSheet, Image, View, TouchableOpacity } from "react-native";
import moment from "moment";
import _ from "lodash";
import getDirections from "react-native-google-maps-directions";

import Analytics from "../../../analytics";
import Icon from "react-native-vector-icons/Ionicons";
import call from "react-native-phone-call";
import KeyValueItem from "../../../components/key-value-item";
import MultipleContactNumbers from "../../../components/multiple-contact-numbers";
import { Text, Button } from "../../../elements";
import { colors } from "../../../theme";
import I18n from "../../../i18n";

import { MAIN_CATEGORY_IDS, SCREENS, CATEGORY_IDS } from "../../../constants";

let mapIcon = require("../../../images/ic_details_map.png");

import InsuranceDetails from "./important/insurance-details";
import ViewMoreBtn from "../../../components/view-more-btn";
import Important from "./important";

class AllInfo extends React.Component {
  state = {
    listHeight: "less",
    sellerName: "Seller Name"
  };
  componentDidMount() {
    if (
      this.props.product.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE ||
      this.props.product.masterCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS
    ) {
      this.setState({
        sellerName: "Dealer Name"
      });
    }
  }
  toggleListHeight = () => {
    if (this.state.listHeight == "less") {
      this.setState({
        listHeight: "auto"
      });
    } else {
      this.setState({
        listHeight: "less"
      });
    }
  };
  onEditPress = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_EDIT, { entity: "product" });
    const { product } = this.props;
    if (product.categoryId == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
      const insurance = product.insuranceDetails[0] || {};

      this.props.navigation.navigate(SCREENS.EDIT_INSURANCE_SCREEN, {
        typeId: product.sub_category_id,
        mainCategoryId: product.masterCategoryId,
        categoryId: product.categoryId,
        productId: product.id,
        jobId: product.jobId,
        planName: product.productName,
        insuranceFor: product.model,
        copies: product.copies || [],
        insuranceId: insurance.id,
        value: insurance.value,
        providerId: insurance.provider_id,
        effectiveDate: insurance.effectiveDate,
        policyNo: insurance.policyNo,
        amountInsured: insurance.amountInsured
      });
    } else {
      this.props.navigation.navigate(
        SCREENS.EDIT_PRODUCT_BASIC_DETAILS_SCREEN,
        {
          product: product
        }
      );
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
    const { listHeight, sellerName } = this.state;
    const {
      product,
      navigation,
      cardWidthWhenMany,
      cardWidthWhenOne
    } = this.props;
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
      sellerName: "",
      city: "",
      contact: "",
      address: "",
      state: ""
    };

    if (product.sellers) {
      seller = {
        sellerName: product.sellers.sellerName || "",
        city: product.sellers.city || "",
        state: product.sellers.state || "",
        contact: product.sellers.contact || "",
        address: product.sellers.address || ""
      };
    }

    return (
      <View collapsable={false} style={styles.container}>
        {product.categoryId != CATEGORY_IDS.HEALTHCARE.INSURANCE ? (
          <View collapsable={false}>
            <View collapsable={false} style={styles.card}>
              <TouchableOpacity
                onPress={this.onEditPress}
                style={{ flex: 1, backgroundColor: "#EBEBEB" }}
              >
                <KeyValueItem
                  KeyComponent={() => (
                    <Text
                      weight="Bold"
                      style={{
                        flex: 2,
                        color: colors.mainText,
                        fontSize: 16
                      }}
                    >
                      {"General Information"}
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
                      {"EDIT"}
                    </Text>
                  )}
                />
              </TouchableOpacity>
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
              {listHeight == "auto" ? (
                <View>
                  {product.metaData.map((metaItem, index) => (
                    <KeyValueItem
                      key={index}
                      keyText={metaItem.name}
                      valueText={metaItem.value}
                    />
                  ))}
                  <KeyValueItem
                    keyText={sellerName}
                    valueText={seller.sellerName || "-"}
                  />
                  <KeyValueItem
                    keyText={I18n.t("product_details_screen_seller_location")}
                    valueText={
                      _.trim(seller.city + ", " + seller.state, ", ") || "-"
                    }
                  />
                  <KeyValueItem
                    keyText="Contact No."
                    ValueComponent={() => (
                      <TouchableOpacity>
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1
                          }}
                        >
                          <View style={{ width: "70%" }}>
                            <MultipleContactNumbers contact={seller.contact} />
                          </View>
                          <View style={{ width: "30%" }}>
                            <Text
                              style={{ paddingHorizontal: 5, paddingTop: 3 }}
                            >
                              {seller.contact ? (
                                <Icon
                                  name="md-call"
                                  size={15}
                                  color={colors.tomato}
                                />
                              ) : (
                                ""
                              )}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                  {(seller.address.length > 0 ||
                    seller.city.length > 0 ||
                    seller.state.length > 0) && (
                    <KeyValueItem
                      KeyComponent={() => (
                        <View collapsable={false} style={{ flex: 1 }}>
                          <Text style={{ color: colors.secondaryText }}>
                            {I18n.t("product_details_screen_seller_address")}
                          </Text>
                          <Text
                            weight="Medium"
                            style={{ color: colors.mainText }}
                          >
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
                    />
                  )}
                </View>
              ) : (
                <View />
              )}
            </View>
            <View style={{ marginBottom: 20 }}>
              <ViewMoreBtn
                collapsable={false}
                height={listHeight}
                onPress={this.toggleListHeight}
              />
            </View>
            <Important
              product={product}
              navigation={navigation}
              cardWidthWhenMany={cardWidthWhenMany}
              cardWidthWhenOne={cardWidthWhenOne}
            />
          </View>
        ) : (
          <InsuranceDetails
            product={product}
            navigation={navigation}
            openAddEditInsuranceScreen={this.onEditPress}
          />
        )}
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
    // marginBottom: 30,
    borderRadius: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  }
});

export default AllInfo;
