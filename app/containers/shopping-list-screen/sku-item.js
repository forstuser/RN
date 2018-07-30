import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default ({
  item,
  measurementTypes,
  wishList = [],
  toggleItemInList = () => null,
  changeItemQuantity = (item, quantity) => null
}) => {
  const itemInWishList = wishList.find(listItem => listItem.id == item.id);

  console.log("itemInWishList: ", itemInWishList);

  const skuId =
    itemInWishList && itemInWishList.sku_measurement
      ? itemInWishList.sku_measurement.id
      : null;

  const onSkuMeasurementPress = skuMeasurement => {
    const selectedItem = { ...item };
    delete selectedItem.sku_measurements;
    selectedItem.sku_measurement = skuMeasurement;
    selectedItem.quantity = 1;
    toggleItemInList(selectedItem);
  };

  const increaseQuantity = () => {
    changeItemQuantity(itemInWishList, itemInWishList.quantity + 1);
  };

  const decreaseQuantity = () => {
    changeItemQuantity(itemInWishList, itemInWishList.quantity - 1);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        borderRadius: 5,
        margin: 10,
        marginBottom: 0,
        ...defaultStyles.card
      }}
    >
      <View>
        <Text weight="Medium" style={{ fontSize: 10 }}>
          {item.title}
        </Text>
      </View>
      <ScrollView horizontal={true} style={{ marginVertical: 10 }}>
        {item.sku_measurements.map(skuMeasurement => (
          <TouchableOpacity
            onPress={() => onSkuMeasurementPress(skuMeasurement)}
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
              skuMeasurement.id == skuId
                ? { backgroundColor: colors.pinkishOrange }
                : {}
            ]}
          >
            <Text
              weight="Medium"
              style={[
                { color: colors.secondaryText, fontSize: 10 },
                skuMeasurement.id == skuId ? { color: "#fff" } : {}
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
        {itemInWishList ? (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={decreaseQuantity}
              style={styles.signContainer}
            >
              <Text style={{ marginTop: -4 }}>-</Text>
            </TouchableOpacity>
            <Text style={{ width: 30, textAlign: "center" }}>
              {itemInWishList.quantity}
            </Text>
            <TouchableOpacity
              onPress={increaseQuantity}
              style={styles.signContainer}
            >
              <Text style={{ marginTop: -4 }}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
        <Text weight="Medium" style={{ fontSize: 10, color: colors.mainBlue }}>
          ₹ 20 Cashback
        </Text>
      </View>
    </View>
  );
};

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
