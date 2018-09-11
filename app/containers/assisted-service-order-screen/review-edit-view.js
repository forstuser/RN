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

import { showSnackbar } from "../../utils/snackbar";

import I18n from "../../i18n";

import { Text, Button } from "../../elements";
import { colors } from "../../theme";
import { SCREENS } from "../../constants";

class Review extends React.Component {
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating || 0
    });
  }

  render() {
    const {
      title,
      starCount,
      reviewInput,
      onStarRatingPress,
      onReviewInputChange
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.reviewHeader}>
          <Text
            weight="Bold"
            style={{ fontSize: 15.5, textAlign: "center", marginBottom: 15 }}
          >
            {title}
          </Text>
          <View style={styles.starsWrapper}>
            <StarRating
              starColor="#FFA909"
              disabled={false}
              maxStars={5}
              rating={starCount}
              halfStarEnabled={true}
              starStyle={{ marginHorizontal: 10 }}
              selectedStar={rating => onStarRatingPress(rating)}
            />
          </View>
        </View>
        <View style={styles.reviewInputWrapper}>
          <TextInput
            underlineColorAndroid="transparent"
            ref={ref => (this.reviewInput = ref)}
            numberOfLines={4}
            maxLength={500}
            placeholder="Write your review"
            value={reviewInput}
            onChangeText={onReviewInputChange}
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
    padding: 0
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
    height: 100,
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
export default Review;
