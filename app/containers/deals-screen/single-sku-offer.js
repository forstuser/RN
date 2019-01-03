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

export default class SkuItemOffer extends React.Component {
  state = {
    showBtn: true,
    isClearItems: false
  };

  componentWillMount() {
    // const { wishList, item } = this.props;
    // if (
    //   wishList.filter(
    //     wishlist =>
    //       wishlist.id == item.sku_id && wishlist.seller_id == item.seller_id
    //   ).length > 0
    // ) {
    //   this.setState({ showBtn: false });
    // }
  }

  addItem = async item => {
    try {
      const res = await addSkuFromOffersToWishlist(
        item.sku_id,
        item.seller_id,
        item.sku_measurement_id
      );
    } catch (error) {
      console.log(error);
    } finally {
      this.props.getWishList();
      this.setState({ showBtn: false });
    }
  };

  addItemToShoppingList = async item => {
    console.log("xxxxxxxxxxxxx", item);
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
  moreOffers = item => {
    alert("more offers");
  };
  render() {
    const {
      item,
      measurementTypes,
      wishList = [],
      isSearchDone,
      skuItemIdsCurrentlyModifying = [],
      addSkuItemToList = () => null,
      changeSkuItemQuantityInList = (skuMeasurementId, quantity) => null,
      selectActiveSkuMeasurementId = (item, skuMeasurementId) => null,
      style = {}
    } = this.props;

    const {
      isCashbackDetailsModalVisible,
      isPriceDetailsModalVisible,
      isClearItems
    } = this.state;
    console.log("wishlist", wishList);
    console.log("item", item);
    const itemsInWishList = wishList.filter(
      listItem => listItem.id == item.sku_id
    );
    console.log("items in wish list", itemsInWishList);
    // const skuMeasurementsInWishList = itemsInWishList
    //   .filter(itemInWishList => (itemInWishList.sku_measurement ? true : false))
    //   .map(itemInWishList => itemInWishList.sku_measurement);
    // const skuMeasurementIdsInWishList = skuMeasurementsInWishList.map(
    //   item => item.id
    // );

    activeSkuMeasurementFromWishList = skuMeasurementsInWishList.find(
      skuMeasurementInWishList =>
        skuMeasurementInWishList.id == item.activeSkuMeasurementId
    );

    const activeItemInWishList = itemsInWishList.find(
      itemInWishList =>
        itemInWishList.sku_measurement.id == item.activeSkuMeasurementId
    );

    const quantity = activeItemInWishList ? activeItemInWishList.quantity : 0;

    const skuId = activeSkuMeasurementFromWishList
      ? activeSkuMeasurementFromWishList.id
      : null;

    const addActiveSkuToList = () => {
      Analytics.logEvent(Analytics.EVENTS.ADD_SKU_SHOPPING_LIST);
      const selectedItem = { ...item };
      console.log("1", selectedItem);
      selectedItem.sku_measurement = selectedItem.sku_measurement;
      console.log("2", selectedItem);
      selectedItem.quantity = 1;
      delete selectedItem.sku_measurements;
      delete selectedItem.activeSkuMeasurementId;
      addSkuItemToList(selectedItem);
    };
    let mrp = "";
    // let cashback = 0;
    let measurementIdImage = null;
    // if (item.sku_measurements) {
    //   const skuMeasurement =
    //     item.sku_measurements[item.sku_measurements.length - 1];
    //   if (skuMeasurement) {
    //     cashback = (skuMeasurement.mrp * skuMeasurement.cashback_percent) / 100;
    //   }
    // }
    // if (cashback > 10) {
    //   cashback = 10;
    // }
    let isLoading = false;

    if (item.sku_measurements) {
      measurementIdImage = item.sku_measurements[0].id;
    }
    if (item.sku_measurements && item.activeSkuMeasurementId) {
      const skuMeasurement = item.sku_measurements.find(
        skuMeasurement => skuMeasurement.id == item.activeSkuMeasurementId
      );
      measurementIdImage = skuMeasurement.id;
      mrp = skuMeasurement.mrp;
      if (mrp > 0) {
        mrp = mrp.toFixed(2);
      }
      // if (skuMeasurement && skuMeasurement.cashback_percent) {
      //   cashback = (skuMeasurement.mrp * skuMeasurement.cashback_percent) / 100;
      // }
      // if (cashback > 10) {
      //   cashback = 10;
      // }

      if (skuItemIdsCurrentlyModifying.includes(item.activeSkuMeasurementId)) {
        isLoading = true;
        console.log("isLoading: ", isLoading);
      } else {
        isLoading = false;
      }
    }
    let price = 0;
    let cashback = 0;
    price = parseFloat(
      parseFloat(item.mrp) *
        parseFloat(1 - parseFloat(item.offer_discount) / 100)
    ).toFixed(2);
    cashback = parseFloat(
      parseFloat(price) * parseFloat(item.cashback_percent / 100)
    ).toFixed(2);

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
          <View>
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
                  `/skus/${item.id}/measurements/${measurementIdImage}/images`
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "column"
              // flex: 1
            }}
          >
            <Text
              weight="Medium"
              style={{
                marginLeft: 5,
                fontSize: 12,
                flex: 1,
                marginRight: 10
                // flexWrap: "wrap"
              }}
            >
              {item.sku_title}
            </Text>
            <Text
              style={{
                marginLeft: 5,
                fontSize: 10
                // flex: 1
              }}
            >
              ({item.measurement_value}
              {""} {item.acronym})
            </Text>
            <Text
              style={{
                marginLeft: 5,
                fontSize: 14,
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
                fontSize: 11,
                flex: 1,
                marginRight: 10,
                textDecorationLine: "line-through",
                textDecorationColor: "#000",
                color: colors.secondaryText,
                marginTop: 5
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
            {cashback && cashback > 0 ? (
              <TouchableOpacity
                onPress={this.showCashbackDetailsModal}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text
                  weight="Medium"
                  style={{
                    fontSize: 10,
                    color: colors.mainBlue,
                    marginRight: 3,
                    marginLeft: 5,
                    marginTop: 5
                  }}
                >
                  Cashback Up To ₹ {cashback}
                </Text>
                <Icon name="md-information-circle" sixe={10} />
              </TouchableOpacity>
            ) : (
              <View />
            )}
            <TouchableOpacity onPress={() => this.moreOffers(item)}>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.pinkishOrange,
                  marginTop: 5,
                  marginLeft: 5,
                  fontStyle: "italic",
                  textDecorationLine: "underline",
                  textDecorationColor: colors.pinkishOrange
                }}
              >
                2 More Offers
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: cashback || item.activeSkuMeasurementId ? 10 : 0
              }}
            >
              {item ? (
                <View>
                  {activeSkuMeasurementFromWishList && quantity ? (
                    <QuantityPlusMinus
                      quantity={quantity}
                      onMinusPress={() => {
                        changeSkuItemQuantityInList(
                          item.activeSkuMeasurementId,
                          quantity - 1
                        );
                      }}
                      onPlusPress={() => {
                        changeSkuItemQuantityInList(
                          item.activeSkuMeasurementId,
                          quantity + 1
                        );
                      }}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={addActiveSkuToList}
                      style={{
                        height: 20,
                        backgroundColor: colors.pinkishOrange,
                        borderRadius: 10,
                        minWidth: 50,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Text style={{ color: "#fff", marginTop: -3 }}>Add</Text>
                    </TouchableOpacity>
                  )}
                  {isLoading && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        left: 0,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <ActivityIndicator size="small" />
                    </View>
                  )}
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>

          {itemsInWishList.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 15
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#33c600",
                  marginTop: 2
                }}
              />
              <Text
                weight="Medium"
                style={{
                  fontSize: 10,
                  color: "#33c600",
                  marginLeft: 3
                }}
              >
                In list
              </Text>
            </View>
          ) : (
            <View />
          )}
          {/* <ScrollView
            horizontal={true}
            style={{ marginVertical: 10 }}
            showsHorizontalScrollIndicator={false}
          >
            {item.sku_measurements &&
              item.sku_measurements.map(skuMeasurement => {
                const isSkuInWishList = wishList.some(
                  listItem =>
                    listItem.sku_measurement &&
                    listItem.sku_measurement.id == skuMeasurement.id
                );
                return (
                  <TouchableOpacity
                    onPress={() =>
                      selectActiveSkuMeasurementId(item, skuMeasurement.id)
                    }
                    style={[
                      {
                        height: 20,
                        backgroundColor: "#fff",
                        borderColor: colors.pinkishOrange,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 7,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 5,
                        flexDirection: "row"
                      },
                      skuMeasurement.id == item.activeSkuMeasurementId
                        ? { backgroundColor: colors.pinkishOrange }
                        : {}
                    ]}
                  >
                    {isSkuInWishList ? (
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: colors.success,
                          marginTop: 0,
                          marginRight: 2
                        }}
                      />
                    ) : null}
                    <Text
                      weight="Medium"
                      style={[
                        { color: colors.secondaryText, fontSize: 12 },
                        skuMeasurement.id == item.activeSkuMeasurementId
                          ? { color: "#fff" }
                          : {}
                      ]}
                    >
                      {skuMeasurement.pack_numbers === 0
                        ? skuMeasurement.measurement_value +
                          measurementTypes[skuMeasurement.measurement_type]
                            .acronym
                        : skuMeasurement.measurement_value +
                          measurementTypes[skuMeasurement.measurement_type]
                            .acronym +
                          " x " +
                          skuMeasurement.pack_numbers}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView> */}
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
