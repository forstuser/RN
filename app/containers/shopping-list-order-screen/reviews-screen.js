import React from "react";
import { View, ScrollView } from "react-native";

import { addSellerReview, addAssistedServiceReview } from "../../api";

import { Text, Button } from "../../elements";
import Review from "./review";
import { showSnackbar } from "../../utils/snackbar";

export default class ShoppingOrderReviewsScreen extends React.Component {
  static navigationOptions = {
    title: "Write a Review"
  };

  state = {
    serviceRating: 0,
    serviceReviewText: "",
    sellerRating: 0,
    sellerReviewText: "",
    isLoading: false
  };

  onSubmit = async () => {
    const { navigation } = this.props;
    const sellerId = navigation.getParam("sellerId", null);
    const serviceId = navigation.getParam("serviceId", null);

    const {
      serviceRating,
      serviceReviewText,
      sellerRating,
      sellerReviewText
    } = this.state;

    this.props.navigation.goBack();

    // try {
    //   await addAssistedServiceReview({ id: serviceId, sellerId });
    // } catch (e) {
    //   showSnackbar({ text: e.message });
    // }
  };

  onMayBeLaterPress = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {
      serviceRating,
      serviceReviewText,
      sellerRating,
      sellerReviewText
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView>
          <Review
            starCount={serviceRating}
            onStarRatingPress={rating => {
              this.setState({
                serviceRating: rating || 0
              });
            }}
            reviewInput={serviceReviewText}
            title="Rate your Service Experience"
          />
          <Review
            starCount={sellerRating}
            onStarRatingPress={rating => {
              this.setState({
                sellerRating: rating || 0
              });
            }}
            title="Rate Seller Responsiveness"
          />
          <View style={{ margin: 15 }}>
            <Button
              onPress={this.onMayBeLaterPress}
              text="Write your review"
              color="secondary"
              style={{ marginBottom: 15 }}
            />
            <Button
              onPress={this.onMayBeLaterPress}
              text="Maybe Later"
              color="grey"
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
