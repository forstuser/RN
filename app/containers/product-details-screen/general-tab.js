import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import moment from "moment";
import StarRating from "react-native-star-rating";

import { Text, Button, ScreenContainer } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import KeyValueItem from "../../components/key-value-item";
import SectionHeading from "../../components/section-heading";
import { addProductReview } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import { MAIN_CATEGORY_IDS } from "../../constants";

class GeneralTab extends Component {
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

  componentDidMount() {
    const { productReviews } = this.props.product;
    if (productReviews.length > 0) {
      this.setState({
        starCount: productReviews[0].ratings,
        reviewInput: productReviews[0].feedback,
        showEditReview: false
      });
    }
  }

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
      await addProductReview({
        productId: this.props.product.id,
        ratings: this.state.starCount,
        feedback: this.state.reviewInput
      });
      Alert.alert("Review Added");
      this.props.fetchProductDetails();
    } catch (e) {
      Alert.alert(e.message);
    } finally {
      this.setState({
        isAddingReview: false
      });
    }
  };

  onEditReviewClick = () => {
    this.setState(
      {
        showEditReview: true
      },
      () => {
        this.reviewInput.focus();
      }
    );
  };

  render() {
    const { product, onEditPress } = this.props;
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
                General Details
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

        {false && (
          <View style={styles.review}>
            <LoadingOverlay visible={this.state.isAddingReview} />
            <SectionHeading text="REVIEW THIS PRODUCT" />
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
                placeholder="Write your feedback…"
                value={this.state.reviewInput}
                onChangeText={text => this.setState({ reviewInput: text })}
                style={styles.reviewInput}
                multiline={true}
              />
              <View style={styles.reviewFooter}>
                <Button
                  onPress={this.onSubmitReview}
                  style={styles.reviewSubmitBtn}
                  text="Submit"
                  color="secondary"
                  type="outline"
                />
              </View>
            </View>
          </View>
        )}
        {false && (
          <View style={styles.editReview}>
            <SectionHeading text="YOUR REVIEW" />
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
                  text="Edit"
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

export default GeneralTab;
