import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

import QuantityPlusMinus from "../../components/quantity-plus-minus";

export default class SkuItem extends React.Component {
  state = {
    isCashbackDetailsModalVisible: false
  };

  showCashbackDetailsModal = () => {
    this.setState({ isCashbackDetailsModalVisible: true });
  };

  hideCashbackDetailsModal = () => {
    this.setState({ isCashbackDetailsModalVisible: false });
  };

  render() {
    const {
      item,
      measurementTypes,
      wishList = [],
      addSkuItemToList = () => null,
      changeSkuItemQuantityInList = (skuMeasurementId, quantity) => null,
      selectActiveSkuMeasurementId = (item, skuMeasurementId) => null,
      style = {}
    } = this.props;

    const { isCashbackDetailsModalVisible } = this.state;

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
      const selectedItem = { ...item };
      selectedItem.sku_measurement = selectedItem.sku_measurements.find(
        skuMeasurement => skuMeasurement.id == item.activeSkuMeasurementId
      );
      selectedItem.quantity = 1;
      delete selectedItem.sku_measurements;
      delete selectedItem.activeSkuMeasurementId;
      addSkuItemToList(selectedItem);
    };

    let cashback = 0;
    if (item.sku_measurements && item.activeSkuMeasurementId) {
      const skuMeasurement = item.sku_measurements.find(
        skuMeasurement => skuMeasurement.id == item.activeSkuMeasurementId
      );
      if (skuMeasurement && skuMeasurement.cashback_percent) {
        cashback = (item.mrp * skuMeasurement.cashback_percent) / 100;
      }
    }

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
        <View style={{ flexDirection: "row" }}>
          <Text weight="Medium" style={{ fontSize: 10, flex: 1 }}>
            {item.title}
          </Text>
          {itemsInWishList.length > 0 ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.success,
                  marginTop: 2
                }}
              />
              <Text
                style={{
                  fontSize: 10,
                  color: colors.success,
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
        <ScrollView
          horizontal={true}
          style={{ marginVertical: 10 }}
          showsHorizontalScrollIndicator={false}
        >
          {item.sku_measurements &&
            item.sku_measurements.map(skuMeasurement => (
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
                    minWidth: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 5
                  },
                  skuMeasurement.id == item.activeSkuMeasurementId
                    ? { backgroundColor: colors.pinkishOrange }
                    : {}
                ]}
              >
                <Text
                  weight="Medium"
                  style={[
                    { color: colors.secondaryText, fontSize: 10 },
                    skuMeasurement.id == item.activeSkuMeasurementId
                      ? { color: "#fff" }
                      : {}
                  ]}
                >
                  {skuMeasurement.measurement_value +
                    measurementTypes[skuMeasurement.measurement_type].acronym}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
        <Text style={{ fontSize: 10 }}>Price: ₹{item.mrp}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: cashback || item.activeSkuMeasurementId ? 10 : 0
          }}
        >
          {item.activeSkuMeasurementId ? (
            activeSkuMeasurementFromWishList && quantity ? (
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
            )
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
                Cashback Upto ₹ {cashback}
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
            <Text>Details will come here</Text>
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
