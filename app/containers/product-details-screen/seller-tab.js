import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Linking
} from "react-native";
import moment from "moment";
import call from "react-native-phone-call";

import { Text, Button, ScreenContainer } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import KeyValueItem from "../../components/key-value-item";

let mapIcon = require("../../images/ic_details_map.png");

class SellerTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      product: {}
    };
  }

  openMap = () => {
    const seller = this.props.product.sellers;
    const address = [seller.address, seller.city, seller.state].join(", ");
    Linking.openURL(
      Platform.OS == "ios"
        ? `http://maps.apple.com/?q=${address}`
        : `https://www.google.com/maps/search/?api=1&query=${address}`
    );
  };

  render() {
    const { product } = this.props;
    if (!product.sellers) {
      return (
        <Text weight="Bold" style={{ textAlign: "center", padding: 16 }}>
          {I18n.t("product_details_screen_seller_no_info")}
        </Text>
      );
    }
    return (
      <ScrollView>
        <KeyValueItem
          keyText={I18n.t("product_details_screen_seller_category")}
          valueText={product.categoryName}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_seller_name")}
          valueText={product.sellers.sellerName}
        />
        <KeyValueItem
          keyText={I18n.t("product_details_screen_seller_location")}
          valueText={product.sellers.city + ", " + product.sellers.state}
        />
        <KeyValueItem
          keyText="Contact No."
          ValueComponent={() => (
            <Text
              onPress={() =>
                call({ number: String(product.sellers.contact) }).catch(e =>
                  Alert.alert(e.message)
                )
              }
              weight="Medium"
              style={{
                flex: 1,
                textAlign: "right",
                textDecorationLine: "underline",
                color: colors.tomato
              }}
            >
              {product.sellers.contact}
            </Text>
          )}
        />
        <KeyValueItem
          KeyComponent={() => (
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.secondaryText }}>
                {I18n.t("product_details_screen_seller_address")}
              </Text>
              <Text weight="Medium" style={{ color: colors.mainText }}>
                {product.sellers.address +
                  ", " +
                  product.sellers.city +
                  ", " +
                  product.sellers.state}
              </Text>
            </View>
          )}
          ValueComponent={() => (
            <TouchableOpacity onPress={this.openMap} style={{ width: 70 }}>
              <View style={{ alignItems: "center" }}>
                <Image style={{ width: 24, height: 24 }} source={mapIcon} />
                <Text
                  weight="Bold"
                  style={{ fontSize: 10, color: colors.pinkishOrange }}
                >
                  {I18n.t("product_details_screen_seller_find_store")}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: 100,
    height: 100
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30
  }
});

export default SellerTab;
