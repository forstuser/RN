import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput
} from "react-native";
import StarRating from "react-native-star-rating";

import { addProductReview } from "../api";
import { showSnackbar } from "../utils/snackbar";

import I18n from "../i18n";

import { Text, Button } from "../elements";
import { colors } from "../theme";
import { SCREENS } from "../constants";

import LoadingOverlay from "../components/loading-overlay";
import Analytics from "../analytics";
class UploadProductImage extends React.Component {
  state = {
    starCount: 0,
    reviewInput: "",
    isSaving: false,
    isStarIsZero: false
  };

  componentDidMount() {
    this.setReviewFromProps(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.setReviewFromProps(newProps);
  }

  setReviewFromProps(props) {
    const review = props.review;
    if (review) {
      this.setState({
        starCount: review.ratings,
        reviewInput: review.feedback
      });
    }
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating || 0
    });
  }

  onSubmitReview = async () => {
    const { starCount, reviewInput, isSaving } = this.state;
    const { product, onReviewSubmit } = this.props;
    if (!starCount) {
      return this.setState({
        isStarIsZero: true
      });
    }
    try {
      this.setState({
        isSaving: true
      });
      Analytics.logEvent(Analytics.EVENTS.SUBMIT_REVIEW);
      await addProductReview({
        productId: product.id,
        ratings: starCount,
        feedback: reviewInput
      });

      if (typeof onReviewSubmit == "function") {
        onReviewSubmit({
          ratings: starCount,
          feedback: reviewInput
        });
      }
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    } finally {
      this.setState({
        isSaving: false
      });
    }
  };

  render() {
    const { starCount, reviewInput, isSaving, isStarIsZero } = this.state;
    return (
      <View collapsable={false} style={styles.container}>
        <LoadingOverlay visible={isSaving} />
        <View collapsable={false} style={styles.reviewHeader}>
          <View collapsable={false} style={styles.starsWrapper}>
            <StarRating
              starColor="#FFA909"
              disabled={false}
              maxStars={5}
              rating={starCount}
              halfStarEnabled={true}
              starStyle={{ marginHorizontal: 10 }}
              selectedStar={rating => this.onStarRatingPress(rating)}
            />
          </View>
          <Text style={styles.ratingMsg}>
            {isStarIsZero
              ? "Please provide rating or feedback before Submit!"
              : ""}
          </Text>
        </View>
        <View collapsable={false} style={styles.reviewInputWrapper}>
          <TextInput
            underlineColorAndroid="transparent"
            ref={ref => (this.reviewInput = ref)}
            numberOfLines={4}
            maxLength={500}
            placeholder={I18n.t("product_details_screen_write_feedback")}
            value={reviewInput}
            onChangeText={text => this.setState({ reviewInput: text })}
            style={styles.reviewInput}
            multiline={true}
          />
          <Text
            weight="Medium"
            style={{
              fontSize: 10,
              alignSelf: "flex-end",
              color: colors.secondaryText
            }}
          >
            {I18n.t("max_chars", { count: 500 })}
          </Text>
        </View>
        <Button
          onPress={this.onSubmitReview}
          style={styles.reviewSubmitBtn}
          text={I18n.t("product_details_screen_submit").toUpperCase()}
          color="secondary"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15
  },
  reviewHeader: {
    padding: 20
  },
  starsWrapper: {
    marginBottom: 10
  },
  reviewInputWrapper: {
    borderColor: colors.lighterText,
    borderWidth: 1,
    width: "100%",
    borderRadius: 5,
    padding: 5
  },
  reviewInput: {
    height: 150
  },
  reviewSubmitBtn: {
    marginTop: 20,
    height: 36,
    width: 170
  },
  ratingMsg: {
    textAlign: "center",
    color: colors.tomato
  }
});
export default UploadProductImage;
