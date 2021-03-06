import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput
} from "react-native";
import _ from "lodash";
import moment from "moment";
import call from "react-native-phone-call";
import getDirections from "react-native-google-maps-directions";
import StarRating from "react-native-star-rating";

import { Text, Button, ScreenContainer } from "../../elements";
import I18n from "../../i18n";
import { showSnackbar } from "../snackbar";

import { colors } from "../../theme";
import KeyValueItem from "../../components/key-value-item";
import LoadingOverlay from "../../components/loading-overlay";
import SectionHeading from "../../components/section-heading";
import { addSellerReview } from "../../api";
import MultipleContactNumbers from "./multiple-contact-numbers";

let mapIcon = require("../../images/ic_details_map.png");

class SellerTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      product: {},
      starCount: 0,
      reviewInput: "",
      showEditReview: true,
      isAddingReview: false
    };
  }

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

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  onSubmitReview = async () => {
    try {
      this.setState({
        isAddingReview: true
      });
      await addSellerReview({
        url: this.props.product.sellers.reviewUrl,
        ratings: this.state.starCount,
        feedback: this.state.reviewInput
      });
      showSnackbar({
        text: I18n.t("product_details_screen_review_added")
      })
      this.props.fetchProductDetails();
    } catch (e) {
      showSnackbar({
        text: e.message
      })
    } finally {
      this.setState({
        isAddingReview: false
      });
    }
  };

  render() {
    const { product, onEditPress } = this.props;

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
      <View>
        <TouchableOpacity
          onPress={onEditPress}
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
          valueText={product.categoryName || ""}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_seller_name")}
          valueText={seller.sellerName}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_seller_location")}
          valueText={_.trim(seller.city + ", " + seller.state, ", ")}
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
        {product.sellers &&
          false && (
            <View style={styles.review}>
              <LoadingOverlay visible={this.state.isAddingReview} />
              <SectionHeading
                text={I18n.t("product_details_screen_your_experience")}
              />
              <View style={styles.reviewInner}>
                <View style={styles.reviewHeader}>
                  <View style={styles.starsWrapper}>
                    <StarRating
                      starColor="#FFA909"
                      disabled={false}
                      maxStars={5}
                      rating={this.state.starCount}
                      halfStarEnabled={true}
                      selectedStar={rating => this.onStarRatingPress(rating)}
                    />
                  </View>
                </View>
                <TextInput
                  ref={ref => (this.reviewInput = ref)}
                  placeholder={I18n.t("product_details_screen_write_feedback")}
                  value={this.state.reviewInput}
                  onChangeText={text => this.setState({ reviewInput: text })}
                  style={styles.reviewInput}
                  multiline={true}
                />
                <View style={styles.reviewFooter}>
                  <Button
                    onPress={this.onSubmitReview}
                    style={styles.reviewSubmitBtn}
                    text={I18n.t("product_details_screen_submit")}
                    color="secondary"
                    type="outline"
                  />
                </View>
              </View>
            </View>
          )}
        {product.sellers &&
          false && (
            <View style={styles.editReview}>
              <SectionHeading
                text={I18n.t("product_details_screen_your_review")}
              />
              <View style={styles.reviewInner}>
                <View style={styles.reviewHeader}>
                  <View style={styles.starsWrapper}>
                    <StarRating
                      disabled={true}
                      starColor="#FFA909"
                      maxStars={5}
                      rating={this.state.starCount}
                      halfStarEnabled={true}
                      selectedStar={rating => this.onStarRatingPress(rating)}
                    />
                  </View>
                </View>
                <Text weight="Bold" style={styles.reviewText}>
                  {this.state.reviewInput}
                </Text>
                <View style={styles.reviewFooter}>
                  <Button
                    onPress={this.onEditReviewClick}
                    style={styles.reviewSubmitBtn}
                    text={I18n.t("product_details_screen_edits")}
                    color="secondary"
                    type="outline"
                  />
                </View>
              </View>
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  reviewInner: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    margin: 20,
    marginTop: 0,
    padding: 20
  },
  reviewHeader: {
    padding: 20,
    paddingTop: 0,
    borderColor: "#ddd",
    borderBottomWidth: 1
  },
  reviewInput: {
    height: 150
  },
  reviewText: {
    height: 150
  },
  reviewFooter: {
    paddingTop: 20,
    borderColor: "#ddd",
    borderTopWidth: 1,
    alignItems: "flex-end"
  },
  reviewSubmitBtn: {
    height: 36,
    width: 100
  }
});

export default SellerTab;
