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
import { API_BASE_URL } from "../../api";

export default class SkuItem extends React.Component {
  state = {
    isCashbackDetailsModalVisible: false,
    isPriceDetailsModalVisible: false
  };

  showCashbackDetailsModal = () => {
    this.setState({ isCashbackDetailsModalVisible: true });
  };

  hideCashbackDetailsModal = () => {
    this.setState({ isCashbackDetailsModalVisible: false });
  };

  showPriceDetailsModal = () => {
    this.setState({ isPriceDetailsModalVisible: true });
  };

  hidePriceDetailsModal = () => {
    this.setState({ isPriceDetailsModalVisible: false });
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

    // console.log(
    //   "Image URLs_____________:",
    //   API_BASE_URL +
    //     `/skus/${item.id}/measurements/${measurementIdImage}/images
    // `
    // );
    //console.log("Item________________", item);
    const {
      isCashbackDetailsModalVisible,
      isPriceDetailsModalVisible
    } = this.state;

    const itemsInWishList = wishList.filter(listItem => listItem.id == item.id);
    const skuMeasurementsInWishList = itemsInWishList
      .filter(itemInWishList => (itemInWishList.sku_measurement ? true : false))
      .map(itemInWishList => itemInWishList.sku_measurement);
    const skuMeasurementIdsInWishList = skuMeasurementsInWishList.map(
      item => item.id
    );

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
      selectedItem.sku_measurement = selectedItem.sku_measurements.find(
        skuMeasurement => skuMeasurement.id == item.activeSkuMeasurementId
      );
      console.log("2", selectedItem);
      selectedItem.quantity = 1;
      delete selectedItem.sku_measurements;
      delete selectedItem.activeSkuMeasurementId;
      addSkuItemToList(selectedItem);
    };

    let mrp = "";
    let cashback = 0;
    let measurementIdImage = null;
    if (item.sku_measurements) {
      const skuMeasurement =
        item.sku_measurements[item.sku_measurements.length - 1];
      if (skuMeasurement) {
        cashback = (skuMeasurement.mrp * skuMeasurement.cashback_percent) / 100;
      }
    }
    if (cashback > 10) {
      cashback = 10;
    }
    let isLoading = false;

    if (item.sku_measurements) {
      //console.log("item.sku_measurements_____", item.sku_measurements);
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
      if (skuMeasurement && skuMeasurement.cashback_percent) {
        cashback = (skuMeasurement.mrp * skuMeasurement.cashback_percent) / 100;
      }
      if (cashback > 10) {
        cashback = 10;
      }

      if (skuItemIdsCurrentlyModifying.includes(item.activeSkuMeasurementId)) {
        isLoading = true;
        console.log("isLoading: ", isLoading);
      } else {
        isLoading = false;
      }
    }

    //console.log("measurementIdImage__________", measurementIdImage);
    // console.log(
    //   "Image URLs_____________:",
    //   API_BASE_URL +
    //     `/skus/${item.id}/measurements/${measurementIdImage}/images
    // `
    // );
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
          },
          style
        ]}
      >
        <View
          style={{
            flexDirection: "row"
          }}
        >
          <View
            style={
              {
                // width: 80,
                // height: 80,
                // backgroundColor: "grey",
                // alignSelf: "flex-start",
                // justifyContent: "flex-start",
                // alignContent: "flex-start"
              }
            }
          >
            <Image
              style={{
                // padding: 5,
                // backgroundColor: "grey",
                width: 80,
                height: 80,
                justifyContent: "flex-start",
                alignSelf: "flex-start",
                alignContent: "flex-start"
                // borderWidth: 1,
                // borderColor: "#e0e0e0"
              }}
              resizeMode="contain"
              source={{
                uri:
                  API_BASE_URL +
                  `/skus/${item.id}/measurements/${measurementIdImage}/images`
              }}
              //source={require("../../images/binbill_logo.png")}
            />
          </View>
          <Text
            weight="Medium"
            style={{
              marginLeft: 5,
              fontSize: 12,
              flex: 1,
              marginRight: 10
              //marginTop: 10
            }}
          >
            {item.title}
          </Text>

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
        </View>
        {isSearchDone && item.sub_category_name ? (
          <View
            style={{
              backgroundColor: "#e8e129",
              alignSelf: "flex-start",
              borderRadius: 3,
              marginTop: 10
              // position: "absolute",
              // top: 70,
              // left: 95
            }}
          >
            <Text
              weight="Medium"
              style={{
                fontSize: 9,
                paddingHorizontal: 4,
                fontStyle: "italic"
              }}
            >
              {item.sub_category_name}
            </Text>
          </View>
        ) : null}

        <ScrollView
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
        </ScrollView>
        {mrp ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 14, marginRight: 5 }}>Price: ₹{mrp}</Text>
            <Icon
              name="md-information-circle"
              sixe={10}
              onPress={this.showPriceDetailsModal}
            />
          </View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: cashback || item.activeSkuMeasurementId ? 10 : 0
          }}
        >
          {item.activeSkuMeasurementId ? (
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
          {cashback ? (
            <TouchableOpacity
              onPress={this.showCashbackDetailsModal}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text
                weight="Medium"
                style={{ fontSize: 10, color: colors.mainBlue, marginRight: 3 }}
              >
                Cashback Up To ₹ {cashback.toFixed(2)}
              </Text>
              <Icon name="md-information-circle" sixe={10} />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
        <Modal
          isVisible={isCashbackDetailsModalVisible}
          useNativeDriver
          onBackButtonPress={this.hideCashbackDetailsModal}
          onBackdropPress={this.hideCashbackDetailsModal}
        >
          <View
            style={{
              backgroundColor: "#fff",
              height: 100,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              padding: 10
            }}
          >
            <Text>
              Cashback applicable on this item on Bill submission & verification
              during Cashback Claim.
            </Text>
          </View>
        </Modal>
        <Modal
          isVisible={isPriceDetailsModalVisible}
          useNativeDriver
          onBackButtonPress={this.hidePriceDetailsModal}
          onBackdropPress={this.hidePriceDetailsModal}
        >
          <View
            style={{
              backgroundColor: "#fff",
              height: 100,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              padding: 10
            }}
          >
            <Text>
              Prices are indicative only and may vary from seller to seller.
              However rest assured selling price will always be less than or
              equal to MRP
            </Text>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  signContainer: {
    borderColor: colors.pinkishOrange,
    borderWidth: 1,
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  }
});
