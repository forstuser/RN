import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, getOffers } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import SkuItemOffer from "./single-sku-offer";

class MoreOffers extends Component {
  static navigationOptions = {
    title: "Suggested Offers"
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      offers: [],
      moreOffer: true
    };
  }

  async componentDidMount() {
    this.getOfferData();
  }
  async getOfferData() {
    const item = this.props.navigation.getParam("item", null);
    try {
      const res = await getOffers({
        sellerId: item.seller_id,
        offerType: item.offer_type,
        skuId: item.sku_id,
        skuMeasurementId: item.sku_measurement_id
      });
      this.setState({ offers: res.result });
      console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  }
  renderDiscountOffers = ({ item, index }) => {
    const wishList = this.props.navigation.getParam("wishList", null);
    const getWishList = this.props.navigation.getParam("getWishList", null);
    const selectedSeller = this.props.navigation.getParam(
      "selectedSeller",
      null
    );
    const selectedCategory = this.props.navigation.getParam(
      "selectedCategory",
      null
    );

    const navigation = this.props.navigation.getParam("navigation", null);

    return (
      <SkuItemOffer
        key={index}
        item={item}
        wishList={wishList}
        selectedSeller={selectedSeller}
        getWishList={getWishList}
        navigation={navigation}
        selectedCategory={selectedCategory}
        moreOffer={this.state.moreOffer}
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        <FlatList
          contentContainerStyle={{
            paddingTop: 0
          }}
          style={{
            marginTop: 5
          }}
          data={this.state.offers}
          keyExtractor={item => item.id}
          renderItem={this.renderDiscountOffers}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  centerText: {
    // fontSize: 14,
    backgroundColor: "#eff1f6",
    padding: 0,
    height: "100%"
  }
});

export default MoreOffers;
