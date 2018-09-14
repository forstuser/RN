import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import { Text, Button } from "../../elements";
import { colors } from "../../theme";

import QuantityPlusMinus from "../../components/quantity-plus-minus";

export default class SelectedItemsList extends React.Component {
  render() {
    const {
      measurementTypes,
      selectedItems,
      changeIndexQuantity,
      skuItemIdsCurrentlyModifying
    } = this.props;

    return (
      <FlatList
        contentContainerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: "#eee"
        }}
        data={selectedItems}
        extraData={skuItemIdsCurrentlyModifying}
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

          let isLoading = false;
          if (
            item.sku_measurement &&
            skuItemIdsCurrentlyModifying.includes(item.sku_measurement.id)
          ) {
            isLoading = true;
            console.log("isLoading: ", isLoading);
          } else {
            isLoading = false;
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
                        color: colors.secondaryText,
                        marginRight: 20
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
                    <Icon name="ios-trash-outline" size={30} color="#999999" />
                  </TouchableOpacity>
                </View>
              </View>
              {isLoading && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 80,
                    backgroundColor: "rgba(255,255,255,0.5)",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ActivityIndicator size="small" />
                </View>
              )}
            </View>
          );
        }}
      />
    );
  }
}
