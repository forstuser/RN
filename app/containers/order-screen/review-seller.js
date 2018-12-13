import React from "react";
import { View, ScrollView, BackHandler, TouchableOpacity } from "react-native";

import { addSellerReview, addAssistedServiceReview } from "../../api";

import LoadingOverlay from "../../components/loading-overlay";
import { Text, Button, Image } from "../../elements";
import Review from "./review-edit-view";
import { showSnackbar } from "../../utils/snackbar";
import { SCREENS } from "../../constants";
import HeaderBackButton from "../../components/header-nav-back-btn";
import { colors } from "../../theme";
export default class ShoppingOrderSellerReviewsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: null
      //   title: "Write a Review",
      //   headerLeft: <HeaderBackButton onPress={params.onBackPress} />
    };
  };

  state = {
    serviceRating: 0,
    serviceReviewText: "",
    sellerRating: 0,
    sellerReviewText: "",
    isLoading: false
  };

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });
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
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    this.props.navigation.navigate(SCREENS.ORDER_SCREEN);
    return true;
  };
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

    if (!sellerRating) {
      return showSnackbar({ text: "Please rate seller" });
    }

    this.setState({ isLoading: true });

    try {
      await addSellerReview({
        sellerId: order.seller_id,
        ratings: sellerRating,
        feedback: sellerReviewText,
        orderId: order.id
      });

      this.props.navigation.navigate(SCREENS.ORDER_SCREEN);
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onMayBeLaterPress = () => {
    this.props.navigation.navigate(SCREENS.ORDER_SCREEN);
  };

  render() {
    const { navigation } = this.props;
    const order = navigation.getParam("order", {});
    const deliveryUserId = order.delivery_user_id;

    console.log("deliveryUserId: ", deliveryUserId);

    const {
      serviceRating,
      serviceReviewText,
      sellerRating,
      sellerReviewText,
      isLoading
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            height: 250,
            backgroundColor: colors.mainBlue,
            alignItems: "center"
          }}
        >
          <Text
            weight="Medium"
            style={{ fontSize: 20, color: "#fff", marginTop: 10 }}
          >
            Rate Seller Responsiveness
          </Text>
          <Image
            style={{ height: 175, width: 225, marginTop: 20 }}
            resizeMode="contain"
            source={require("../../images/seller_review.png")}
          />
        </View>
        <View>
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
            title=""
          />
          <View style={{ margin: 15 }}>
            <Button
              onPress={this.onSubmit}
              text="Submit"
              color="secondary"
              style={{ marginBottom: 15 }}
            />
            {/* <Button
              onPress={this.onMayBeLaterPress}
              text="Maybe Later"
              color="grey"
            /> */}
            <TouchableOpacity onPress={this.onMayBeLaterPress}>
              <Text
                weight="Medium"
                style={{
                  color: colors.mainBlue,
                  textAlign: "center",
                  textDecorationLine: "underline",
                  textDecorationColor: colors.mainBlue
                }}
              >
                Maybe Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
