import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  TextInput
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";

import { addSellerReview } from "../../api";

import I18n from "../../i18n";
import { Text, Button } from "../../elements";

import LoadingOverlay from "../../components/loading-overlay";

import { colors } from "../../theme";
import Analytics from "../../analytics";
import { showSnackbar } from "../../utils/snackbar";

class ReviewModal extends React.Component {
  state = {
    isModalVisible: false,
    isSaving: false,
    starCount: 0,
    reviewInput: ""
  };

  show = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_REVIEW);
    this.setState({
      isModalVisible: true
    });
  };

  hide = () => {
    this.setState({
      isModalVisible: false
    });
  };

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating || 0
    });
  }

  onSubmitReview = async () => {
    const { starCount, reviewInput, isSaving } = this.state;
    const { seller } = this.props;
    if (!starCount) {
      return showSnackbar({ text: "Please give some rating" });
    }
    try {
      this.setState({
        isSaving: true
      });

      await addSellerReview({
        sellerId: seller.id,
        ratings: starCount,
        feedback: reviewInput
      });

      this.hide();
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
    const { isModalVisible, isSaving, starCount, reviewInput } = this.state;
    const { seller } = this.props;
    if (!isModalVisible) return null;

    return (
      <Modal
        isVisible={isModalVisible}
        useNativeDriver={true}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
        avoidKeyboard={Platform.OS == "ios"}
      >
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
            <Icon name="md-close" size={30} color={colors.mainText} />
          </TouchableOpacity>
          <Text
            weight="Bold"
            style={{ fontSize: 12, textAlign: "center", marginBottom: 5 }}
          >
            {I18n.t("product_details_screen_review_product").toUpperCase()}
          </Text>
          <View style={styles.container}>
            <View style={styles.reviewHeader}>
              <View style={styles.starsWrapper}>
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
            </View>
            <View style={styles.reviewInputWrapper}>
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
          <LoadingOverlay visible={isSaving} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    paddingTop: 40,
    backgroundColor: "#fff",
    borderRadius: 5
  },
  closeIcon: {
    position: "absolute",
    right: 15,
    top: 10
  },
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
    height: 150,
    textAlignVertical: "top"
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

export default ReviewModal;
