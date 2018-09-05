import React from "react";
import { View, TouchableOpacity } from "react-native";

import { API_BASE_URL } from "../../api";
import { Text, Button, Image } from "../../elements";
import { defaultStyles } from "../../theme";

export default class SellerDetails extends React.Component {
  render() {
    const { seller } = this.props;

    return (
      <View
        style={{
          margin: 10
        }}
      >
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <View style={{ padding: 12 }}>
            <View style={{}}>
              <Image
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 35,
                  backgroundColor: "#eee"
                }}
                source={{ uri: API_BASE_URL + seller.image }}
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
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
