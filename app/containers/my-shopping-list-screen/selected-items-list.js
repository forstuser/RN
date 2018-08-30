import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import { Text, Button } from "../../elements";
import { colors } from "../../theme";

import QuantityPlusMinus from "../../components/quantity-plus-minus";

export default class SelectedItemsList extends React.Component {
  render() {
    const { measurementTypes, selectedItems, changeIndexQuantity } = this.props;

    return (
      <FlatList
        contentContainerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: "#eee"
        }}
        data={selectedItems.reverse()}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: "#eee" }} />
        )}
        keyExtractor={(item, index) => item.id + "" + index}
        renderItem={({ item, index }) => {
          let cashback = 0;
          if (item.sku_measurement && item.sku_measurement.cashback_percent) {
            cashback =
              ((item.sku_measurement.mrp *
                item.sku_measurement.cashback_percent) /
                100) *
              item.quantity;
          }

          return (
            <View
              style={{
                flexDirection: "row",
                padding: 10
              }}
            >
              <View style={{ marginRight: 5 }}>
                <TouchableOpacity
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.success
                  }}
                >
                  <Icon name="md-checkmark" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text
                    weight="Medium"
                    style={{ fontSize: 10, flex: 1, marginRight: 20 }}
                    numberOfLines={2}
                  >
                    {item.title}
                    <Text
                      style={{
                        color: colors.secondaryText
                      }}
                    >
                      {item.sku_measurement
                        ? ` (${item.sku_measurement.measurement_value +
                            measurementTypes[
                              item.sku_measurement.measurement_type
                            ].acronym})`
                        : ``}
                    </Text>
                  </Text>
                  <QuantityPlusMinus
                    quantity={item.quantity}
                    onMinusPress={() => {
                      changeIndexQuantity(index, item.quantity - 1);
                    }}
                    onPlusPress={() => {
                      changeIndexQuantity(index, item.quantity + 1);
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5
                  }}
                >
                  <View style={{ flex: 1 }}>
                    {cashback ? (
                      <Text
                        weight="Medium"
                        style={{
                          fontSize: 10,
                          color: colors.mainBlue
                        }}
                      >
                        Cashback Upto ₹ {cashback}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      changeIndexQuantity(index, 0);
                    }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon name="ios-trash-outline" size={25} color="#999999" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    );
  }
}
