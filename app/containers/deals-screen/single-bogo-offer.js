import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import Analytics from "../../analytics";

import QuantityPlusMinus from "../../components/quantity-plus-minus";
import LoadingOverlay from "../../components/loading-overlay";
import {
  API_BASE_URL,
  clearWishList,
  addSkuFromOffersToWishlist
} from "../../api";

export default class BogoOffer extends React.Component {
  state = {
    showBtn: true,
    isClearItems: false
  };

  componentWillMount() {
    const { wishList, item } = this.props;
    if (
      wishList.filter(
        wishlist =>
          wishlist.id == item.sku_id && wishlist.seller_id == item.seller_id
      ).length > 0
    ) {
      this.setState({ showBtn: false });
    }
  }

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
      this.props.getWishList();
      this.setState({ showBtn: false });
      //console.log("Item added");
    }
  };

  addItemToShoppingList = async item => {
    const { wishList, selectedCategory } = this.props;
    console.log("selectedCategory is", selectedCategory);
    const defaultSeller = JSON.parse(
      await AsyncStorage.getItem("defaultSeller")
    );
    if (defaultSeller && defaultSeller.id != selectedCategory.id) {
      if (wishList.length > 0) this.setState({ isClearItems: true });
      else {
        AsyncStorage.setItem("defaultSeller", JSON.stringify(selectedCategory));
        this.addItem(item);
      }
    } else {
      AsyncStorage.setItem("defaultSeller", JSON.stringify(selectedCategory));
      this.addItem(item);
    }
  };

  hideIsClearItems = () => {
    this.setState({ isClearItems: false });
  };

  onProceed = item => {
    const { selectedCategory } = this.props;
    this.setState({ isClearItems: false });
    this.clearWishList();
    AsyncStorage.setItem("defaultSeller", JSON.stringify(selectedCategory));
    this.addItem(item);
  };
  clearWishList = async () => {
    try {
      await clearWishList();
    } catch (e) {
      showSnackbar({ text: e.message });
    }
  };
  onViewDetails = item => {
    alert("View Details");
  };
  render() {
    const { item, wishList } = this.props;
    const { showBtn, isClearItems } = this.state;

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
          <View style={{ flex: 1, marginLeft: 10, paddingRight: 10 }}>
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
            {item.title ? (
              <Text
                weight="Medium"
                style={{
                  marginLeft: 5,
                  fontSize: 14,
                  color: colors.pinkishOrange,
                  flex: 1,
                  marginRight: 10,
                  flexWrap: "wrap"
                }}
              >
                {item.title}
              </Text>
            ) : (
              <Text
                weight="Medium"
                style={{
                  marginLeft: 5,
                  color: colors.pinkishOrange,
                  fontSize: 14,
                  flex: 1,
                  marginRight: 10,
                  flexWrap: "wrap"
                }}
              >
                Buy 1 {item.sku_title} and Get {item.offer_discount} Free
              </Text>
            )}
            <Text
              style={{
                marginLeft: 5,
                fontSize: 12,
                flex: 1
              }}
            >
              ({item.measurement_value}
              {""} {item.acronym})
            </Text>

            <Text
              style={{
                marginTop: 5,
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
              *Offer valid till stocks last
            </Text>
            {/* <TouchableOpacity onPress={() => this.onViewDetails(item)}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.pinkishOrange,
                  marginTop: 7,
                  marginLeft: 5,
                  textDecorationLine: "underline",
                  textDecorationColor: colors.pinkishOrange
                }}
              >
                View Details
              </Text>
            </TouchableOpacity> */}
            {showBtn ? (
              <Button
                textStyle={{ fontSize: 14 }}
                style={{ height: 35, width: 75, marginTop: 10 }}
                onPress={() => this.addItemToShoppingList(item)}
                text="Add"
                color="secondary"
              />
            ) : (
              <Text
                style={{
                  fontSize: 10,
                  color: "#33c600",
                  marginTop: 8,
                  marginLeft: 6
                }}
              >
                Added to Your Shopping List
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
              height: 200,
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
