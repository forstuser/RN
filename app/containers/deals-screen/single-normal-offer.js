import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native";
import moment from "moment";

import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import Analytics from "../../analytics";

import QuantityPlusMinus from "../../components/quantity-plus-minus";
import LoadingOverlay from "../../components/loading-overlay";
import { API_BASE_URL } from "../../api";

const deviceWidth = Dimensions.get("window").width;

export default class SingleNormalOffer extends React.Component {
  render() {
    const { item } = this.props;
    console.log("GENERAL OFFERS______________________", item);
    let imgUrl = null;
    if (item.brand_offer_id) {
      imgUrl = `/suggested/offers/${item.brand_offer_id}/images`;
    } else
      imgUrl = `/offer/${item.id}/images/${item.document_details.index || 0}`;
    return (
      <View
        style={{
          ...defaultStyles.card,
          margin: 5,
          marginLeft: 10,
          borderRadius: 5,
          height: 210,
          width: deviceWidth - 20
        }}
      >
        <Image
          style={{ height: 130, width: deviceWidth - 20 }}
          source={{
            uri: API_BASE_URL + imgUrl
          }}
          resizeMode="stretch"
        />
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, marginTop: -3 }}>{item.title}</Text>
          {/* <Text style={{ fontSize: 15 }}>{item.description}</Text> */}
          <Text style={{ fontSize: 14, color: colors.mainBlue }}>
            Expiring on: {moment(item.end_date).format("DD MMM, YYYY")}
          </Text>
        </View>
      </View>
    );
  }
}
