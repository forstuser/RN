import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import moment from "moment";
import call from "react-native-phone-call";

import { Text, Button, ScreenContainer } from "../../elements";

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

  render() {
    const { product } = this.props;
    return (
      <ScrollView>
        <KeyValueItem
          keyText="Seller Category"
          valueText={product.categoryName}
        />
        <KeyValueItem
          keyText="Seller Name"
          valueText={product.sellers.sellerName}
        />
        <KeyValueItem
          keyText="Location"
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
              <Text style={{ color: colors.secondaryText }}>Address</Text>
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
            <View style={{ width: 70 }}>
              <View style={{ alignItems: "center" }}>
                <Image style={{ width: 24, height: 24 }} source={mapIcon} />
                <Text
                  weight="Bold"
                  style={{ fontSize: 10, color: colors.pinkishOrange }}
                >
                  FIND STORE
                </Text>
              </View>
            </View>
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
