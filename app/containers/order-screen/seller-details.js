import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import call from "react-native-phone-call";

import { API_BASE_URL } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default class SellerDetails extends React.Component {
  call = () => {
    const { order } = this.props;
    call({ number: order.seller.contact_no }).catch(e =>
      showSnackbar({
        text: e.message
      })
    );
  };

  render() {
    const { order } = this.props;

    const { seller } = order;
    const orderDate = order.created_at;

    console.log(
      "seller image: " +
        API_BASE_URL +
        `/consumer/sellers/${order.seller_id}/upload/1/images/0`
    );

    return (
      <View style={{}}>
        <Text weight="Bold">Order Summary</Text>
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
                  uri:
                    API_BASE_URL +
                    `/consumer/sellers/${order.seller_id}/upload/1/images/0`
                }}
              />
            </View>
          </View>
          <View style={{ padding: 12, paddingLeft: 0, flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text weight="Bold" style={{ fontSize: 13 }}>
                  {seller.seller_name}
                </Text>
                <Text style={{ fontSize: 11 }}>{seller.address}</Text>
                <Text style={{ fontSize: 10, color: "#777777" }}>
                  {moment(orderDate).format("DD MMM, YYYY")} |{" "}
                  {moment(orderDate).format("hh:mm a")}
                </Text>
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
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
