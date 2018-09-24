import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import call from "react-native-phone-call";
import StarRating from "react-native-star-rating";

import { API_BASE_URL } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

import { ORDER_TYPES, SERVICE_PRICE_TYPES } from "../../constants";

export default class DeliveryUserDetails extends React.Component {
  // call = () => {
  //   const { deliveryUser } = this.props;
  //   call({ number: seller.contact_no }).catch(e =>
  //     showSnackbar({
  //       text: e.message
  //     })
  //   );
  // };

  render() {
    let { deliveryUser = {}, orderType } = this.props;

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
                <Text style={{ fontSize: 11 }}>
                  Mobile: {deliveryUser.mobile_no}
                </Text>
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
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
