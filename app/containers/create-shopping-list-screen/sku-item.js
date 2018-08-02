import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default class SkuItem extends React.Component {
  render() {
    const {
      item,
      measurementTypes,
      wishList = [],
      addSkuItemToList = () => null,
      changeSkuItemQuantityInWishList = (skuMeasurementId, quantity) => null,
      selectActiveSkuMeasurementId = (item, skuMeasurementId) => null,
      style = {}
    } = this.props;

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

    return (
      <View
        style={[
          {
            flex: 1,
            padding: 10,
            borderRadius: 5,
            margin: 10,
            marginBottom: 0,
            ...defaultStyles.card
          },
          style
        ]}
      >
        <View>
          <Text weight="Medium" style={{ fontSize: 10 }}>
            {item.title}
          </Text>
        </View>
        <ScrollView horizontal={true} style={{ marginVertical: 10 }}>
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
            marginTop: 10,
            justifyContent: "space-between",
            alignItems: "center",
            height: 20
          }}
        >
          {item.activeSkuMeasurementId ? (
            activeSkuMeasurementFromWishList && quantity ? (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    changeSkuItemQuantityInWishList(
                      item.activeSkuMeasurementId,
                      quantity - 1
                    );
                  }}
                  style={styles.signContainer}
                >
                  <Text style={{ marginTop: -4 }}>-</Text>
                </TouchableOpacity>
                <Text style={{ width: 30, textAlign: "center" }}>
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    changeSkuItemQuantityInWishList(
                      item.activeSkuMeasurementId,
                      quantity + 1
                    );
                  }}
                  style={styles.signContainer}
                >
                  <Text style={{ marginTop: -4 }}>+</Text>
                </TouchableOpacity>
              </View>
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
                <Text style={{ color: "#fff" }}>Add</Text>
              </TouchableOpacity>
            )
          ) : (
            <View />
          )}
          <Text
            weight="Medium"
            style={{ fontSize: 10, color: colors.mainBlue }}
          >
            ₹ 20 Cashback
          </Text>
        </View>
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
