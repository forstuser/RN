import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import Analytics from "../../analytics";

import QuantityPlusMinus from "../../components/quantity-plus-minus";
import LoadingOverlay from "../../components/loading-overlay";
import { API_BASE_URL, addSkuFromOffersToWishlist } from "../../api";

export default class SkuItemOffer extends React.Component {
  state = {
    showBtn: true,
    isClearItems: false
  };

  addItem = async item => {
    //console.log("SKU ID", item.sku_id);
    //console.log("SELLER ID", item.seller_id);
    //console.log("SKU MEASUREMENT ID", item.sku_measurement_id);
    try {
      const res = await addSkuFromOffersToWishlist(
        item.sku_id,
        item.seller_id,
        item.sku_measurement_id
      );
      //console.log("Response of add SKU from offers to wishlist", res);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ showBtn: false });
      //console.log("Item added");
    }
  };

  addItemToShoppingList = item => {
    const { wishList } = this.props;
    if (wishList.length == 0) {
      this.addItem(item);
    }
    let updated_wishlist = [];
    updated_wishlist = wishList.filter(
      wishList => wishList.seller_id == item.seller_id
    );
    console.log("Updated Wishlist", updated_wishlist);
    if (wishList.length == updated_wishlist.length) {
      this.addItem(item);
    } else {
      this.setState({ isClearItems: true });
    }
  };

  hideIsClearItems = () => {
    this.setState({ isClearItems: false });
  };

  onProceed = item => {
    this.setState({ isClearItems: false });
    this.addItem(item);
  };

  render() {
    const { item, wishList } = this.props;
    const { showBtn, isClearItems } = this.state;
    console.log("Wishlist_____", wishList);
    let price = 0;
    price = item.mrp * (1 - item.offer_discount / 100).toFixed(2);

    return (
      <View
        style={[
          {
            flex: 1,
            padding: 10,
            borderRadius: 5,
            marginHorizontal: 10,
            marginVertical: 5,
            ...defaultStyles.card
          }
        ]}
      >
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <View style={{ marginLeft: 5 }}>
            <Image
              style={{
                width: 80,
                height: 80,
                justifyContent: "flex-start",
                alignSelf: "flex-start",
                alignContent: "flex-start"
              }}
              resizeMode="contain"
              source={{
                uri:
                  API_BASE_URL +
                  `/skus/${item.sku_id}/measurements/${
                    item.sku_measurement_id
                  }/images`
              }}
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              weight="Medium"
              style={{
                marginLeft: 5,
                fontSize: 14,
                flex: 1,
                marginRight: 10,
                flexWrap: "wrap"
              }}
            >
              {item.sku_title}
            </Text>
            <Text
              weight="Bold"
              style={{
                marginLeft: 5,
                fontSize: 16,
                flex: 1,
                marginRight: 10,
                marginTop: 5
              }}
            >
              Price: ₹ {price}{" "}
              <Text style={{ color: colors.mainBlue }}>
                ({item.offer_discount}% off)
              </Text>
            </Text>
            <Text
              style={{
                marginLeft: 5,
                fontSize: 14,
                flex: 1,
                marginRight: 10
              }}
            >
              MRP: ₹ {item.mrp}
            </Text>
            <Text
              weight="Light"
              style={{
                fontStyle: "italic",
                marginLeft: 5,
                fontSize: 10,
                flex: 1,
                marginRight: 10,
                marginTop: 5
              }}
            >
              Offer valid till stocks last
            </Text>
            {showBtn ? (
              <Button
                textStyle={{ fontSize: 14 }}
                style={{ height: 35, width: 180, marginTop: 8 }}
                onPress={() => this.addItemToShoppingList(item)}
                text="Add to Shopping List"
                color="secondary"
              />
            ) : (
              <Text
                style={{
                  fontSize: 10,
                  color: colors.success,
                  marginTop: 8,
                  marginLeft: 6
                }}
              >
                Already added to Your Shopping List
              </Text>
            )}
          </View>
        </View>
        <Modal
          isVisible={isClearItems}
          useNativeDriver={true}
          onBackButtonPress={this.hideIsClearItems}
          onBackdropPress={this.hideIsClearItems}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: 280,
              height: 175,
              alignSelf: "center",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              weight="Medium"
              style={{
                fontSize: 15,
                padding: 10,
                textAlign: "center",
                marginBottom: 20
              }}
            >
              Items and Offers can be added to your Shopping List from the same
              Seller only. Items in your Shopping List will be erased if you Add
              this Offer.
            </Text>
            <View
              style={{
                width: "100%",
                maxWidth: 220,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Button
                text="Cancel"
                style={{ width: 100, height: 40 }}
                textStyle={{ fontSize: 12 }}
                color="secondary"
                type="outline"
                onPress={this.hideIsClearItems}
              />
              <Button
                text="Proceed"
                style={{ width: 100, height: 40 }}
                color="secondary"
                textStyle={{ fontSize: 12 }}
                onPress={() => this.onProceed(item)}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
