import React from "react";
import { View, ScrollView, BackHandler } from "react-native";

import { addSellerReview, addAssistedServiceReview } from "../../api";

import LoadingOverlay from "../../components/loading-overlay";
import { Text, Button, Image } from "../../elements";
import Review from "./review-edit-view";
import { showSnackbar } from "../../utils/snackbar";
import { SCREENS } from "../../constants";
import HeaderBackButton from "../../components/header-nav-back-btn";
import { colors } from "../../theme";
export default class ShoppingOrderDeliveryReviewsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      header: null
      //   title: "Write a Review",
      //   headerLeft: <HeaderBackButton onPress={params.onBackPress} />
    };
  };

  state = {
    serviceRatings: 0,
    serviceReviewText: "",
    sellerRatings: 0,
    sellerReviewText: "",
    isLoading: false
  };

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });
    const { navigation } = this.props;
    const sellerRatings = navigation.getParam("sellerRatings", 0);
    const sellerReviewText = navigation.getParam("sellerReviewText", "");
    const serviceRatings = navigation.getParam("serviceRatings", 0);
    const serviceReviewText = navigation.getParam("serviceReviewText", "");

    this.setState({
      sellerRatings,
      sellerReviewText,
      serviceRatings,
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
      serviceRatings,
      serviceReviewText,
      sellerRatings,
      sellerReviewText
    } = this.state;

    if (deliveryUserId && !serviceRatings) {
      return showSnackbar({ text: "Please rate service/delivery provider" });
    }

    this.setState({ isLoading: true });

    try {
      if (deliveryUserId) {
        await addAssistedServiceReview({
          id: order.delivery_user_id,
          sellerId: order.seller_id,
          ratings: serviceRatings,
          feedback: serviceReviewText,
          orderId: order.id
        });
      }

      this.props.navigation.navigate(SCREENS.SELLER_REVIEW_SCREEN, {
        order: order,
        sellerRatings,
        sellerReviewText,
        serviceRatings,
        serviceReviewText
      });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onMayBeLaterPress = () => {
    const order = this.props.navigation.getParam("order", {});
    const {
      serviceRatings,
      serviceReviewText,
      sellerRatings,
      sellerReviewText
    } = this.state;

    this.props.navigation.navigate(SCREENS.SELLER_REVIEW_SCREEN, {
      order: order,
      sellerRatings,
      sellerReviewText,
      serviceRatings,
      serviceReviewText
    });
  };

  render() {
    const { navigation } = this.props;
    const order = navigation.getParam("order", {});
    const deliveryUserId = order.delivery_user_id;

    console.log("deliveryUserId: ", deliveryUserId);

    const {
      serviceRatings,
      serviceReviewText,
      sellerRatings,
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
            Rate your Delivery Experience
          </Text>
          <Image
            style={{ height: 175, width: 225, marginTop: 10 }}
            resizeMode="contain"
            source={require("../../images/delivery_review.png")}
          />
        </View>
        <View>
          <Review
            starCount={serviceRatings}
            onStarRatingPress={rating => {
              this.setState({
                serviceRatings: rating || 0
              });
            }}
            reviewInput={serviceReviewText}
            onReviewInputChange={serviceReviewText => {
              this.setState({ serviceReviewText });
            }}
            title=""
          />
          <View style={{ margin: 15 }}>
            <Button
              onPress={this.onSubmit}
              text="Submit Your Review"
              color="secondary"
              style={{ marginBottom: 15 }}
            />
            <Button
              onPress={this.onMayBeLaterPress}
              text="Maybe Later"
              color="grey"
            />
          </View>
        </View>
      </View>
    );
  }
}
