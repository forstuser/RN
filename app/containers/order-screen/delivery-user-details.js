import React from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import call from "react-native-phone-call";
import StarRating from "react-native-star-rating";
import Modal from "react-native-modal";

import { API_BASE_URL } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

import { ORDER_TYPES, SERVICE_PRICE_TYPES } from "../../constants";
import Reviews from "../../components/reviews";

export default class DeliveryUserDetails extends React.Component {
  state = {
    isReviewsModalVisible: false
  };

  call = () => {
    const { deliveryUser } = this.props;
    call({ number: deliveryUser.mobile_no }).catch(e =>
      showSnackbar({
        text: e.message
      })
    );
  };

  showReviewsModal = () => {
    this.setState({ isReviewsModalVisible: true });
  };

  hideReviewsModal = () => {
    this.setState({ isReviewsModalVisible: false });
  };

  render() {
    let { deliveryUser = {}, orderType } = this.props;
    const { isReviewsModalVisible } = this.state;

    let hourlyPrice = 0;
    if (orderType == ORDER_TYPES.ASSISTED_SERVICE) {
      const hourlyPriceItem = deliveryUser.service_type.price.find(
        p => p.price_type == SERVICE_PRICE_TYPES.HOURLY_PRICE
      );

      hourlyPrice = hourlyPriceItem ? hourlyPriceItem.value : 0;
    }

    return (
      <View style={{}}>
        <Text weight="Bold">
          {orderType == ORDER_TYPES.FMCG
            ? "Delivery Agent"
            : "Service Provider"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View style={{ paddingRight: 12 }}>
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 35,
                backgroundColor: "#eee"
              }}
            >
              <Image
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 35
                }}
                source={{
                  uri: API_BASE_URL + `/assisted/${deliveryUser.id}/profile`
                }}
              />
            </View>
          </View>
          <View style={{ padding: 12, paddingLeft: 0, flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <View style={{ flexDirection: "row" }}>
                  <Text weight="Bold" style={{ fontSize: 13.5, flex: 1 }}>
                    {deliveryUser.name}
                  </Text>
                  {orderType == ORDER_TYPES.ASSISTED_SERVICE && (
                    <Text weight="Bold" style={{ fontSize: 13.5 }}>
                      Rs. {hourlyPrice}
                      /hour
                    </Text>
                  )}
                </View>
                {/* <Text style={{ fontSize: 11 }}>
                  Mobile: {deliveryUser.mobile_no}
                </Text> */}
                <TouchableOpacity
                  onPress={() => this.call()}
                  style={{
                    marginTop: 8,
                    flexDirection: "row",
                    height: 26,
                    width: 65,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 15,
                    borderColor: "#c5c5c5",
                    borderWidth: 1
                  }}
                >
                  <Icon
                    name="ios-call-outline"
                    size={18}
                    color={colors.pinkishOrange}
                  />
                  <Text weight="Medium" style={{ fontSize: 9, marginLeft: 7 }}>
                    Call
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    marginTop: 4
                  }}
                >
                  <StarRating
                    starColor={colors.yellow}
                    disabled={true}
                    maxStars={5}
                    rating={Number(deliveryUser.ratings)}
                    halfStarEnabled={true}
                    starSize={11}
                    starStyle={{ marginHorizontal: 0 }}
                  />
                  <Text
                    weight="Medium"
                    style={{
                      fontSize: 10,
                      marginLeft: 2,
                      color: colors.secondaryText
                    }}
                  >
                    ({deliveryUser.ratings || 0})
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ padding: 5, paddingLeft: 0 }}
                  onPress={this.showReviewsModal}
                >
                  <Text
                    weight="Medium"
                    style={{
                      fontSize: 10,
                      marginLeft: 2,
                      color: colors.pinkishOrange
                    }}
                  >
                    Reviews{" "}
                    {deliveryUser.reviews ? deliveryUser.reviews.length : 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <Modal
          isVisible={isReviewsModalVisible}
          onBackButtonPress={this.hideReviewsModal}
          onBackdropPress={this.hideReviewsModal}
          useNativeDriver
        >
          <View style={{ backgroundColor: "#fff", padding: 10 }}>
            <ScrollView>
              <Reviews reviews={deliveryUser.reviews || []} />
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}
