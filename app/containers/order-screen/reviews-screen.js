import React from "react";
import { View, ScrollView } from "react-native";

import { addSellerReview, addAssistedServiceReview } from "../../api";

import LoadingOverlay from "../../components/loading-overlay";
import { Text, Button } from "../../elements";
import Review from "./review-edit-view";
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

  componentDidMount() {
    const { navigation } = this.props;
    const sellerRating = navigation.getParam("sellerRatings", 0);
    const sellerReviewText = navigation.getParam("sellerReviewText", "");
    const serviceRating = navigation.getParam("serviceRatings", 0);
    const serviceReviewText = navigation.getParam("serviceReviewText", "");

    this.setState({
      sellerRating,
      sellerReviewText,
      serviceRating,
      serviceReviewText
    });
  }

  onSubmit = async () => {
    const { navigation } = this.props;
    const order = navigation.getParam("order", {});
    const deliveryUserId = order.delivery_user_id;

    const {
      serviceRating,
      serviceReviewText,
      sellerRating,
      sellerReviewText
    } = this.state;

    if (deliveryUserId && !serviceRating) {
      return showSnackbar({ text: "Please rate service/delivery provider" });
    }

    if (!sellerRating) {
      return showSnackbar({ text: "Please rate seller" });
    }

    this.setState({ isLoading: true });

    try {
      if (deliveryUserId) {
        await addAssistedServiceReview({
          id: order.delivery_user_id,
          sellerId: order.seller_id,
          ratings: serviceRating,
          feedback: serviceReviewText,
          orderId: order.id
        });
      }

      await addSellerReview({
        sellerId: order.seller_id,
        ratings: sellerRating,
        feedback: sellerReviewText,
        orderId: order.id
      });

      this.props.navigation.goBack();
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onMayBeLaterPress = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { navigation } = this.props;
    const order = navigation.getParam("order", {});
    const deliveryUserId = order.delivery_user_id;

    const {
      serviceRating,
      serviceReviewText,
      sellerRating,
      sellerReviewText,
      isLoading
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView>
          {deliveryUserId && (
            <Review
              starCount={serviceRating}
              onStarRatingPress={rating => {
                this.setState({
                  serviceRating: rating || 0
                });
              }}
              reviewInput={serviceReviewText}
              onReviewInputChange={serviceReviewText => {
                this.setState({ serviceReviewText });
              }}
              title="Rate your Service Experience"
            />
          )}
          <Review
            starCount={sellerRating}
            onStarRatingPress={rating => {
              this.setState({
                sellerRating: rating || 0
              });
            }}
            reviewInput={sellerReviewText}
            onReviewInputChange={sellerReviewText => {
              this.setState({ sellerReviewText });
            }}
            title="Rate Seller Responsiveness"
          />
          <View style={{ margin: 15 }}>
            <Button
              onPress={this.onSubmit}
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
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
