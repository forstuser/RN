import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Image, Button } from "../../elements";
import { colors } from "../../theme";

export default ({ item, index, declineItem }) => {
  let cashback = 0;
  if (item.sku_measurement && item.sku_measurement.cashback_percent) {
    cashback =
      ((item.sku_measurement.mrp * item.sku_measurement.cashback_percent) /
        100) *
      item.quantity;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 10,
        marginHorizontal: 10
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
                    item.sku_measurement.measurement_acronym})`
                : ``}
            </Text>
          </Text>
          {item.selling_price ? (
            <Text
              style={{
                color: colors.secondaryText
              }}
            >
              Rs. {item.selling_price}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            marginTop: 5
          }}
        >
          <View style={{}}>
            {cashback ? (
              <Text
                weight="Medium"
                style={{
                  fontSize: 10,
                  color: colors.mainBlue
                }}
              >
                You get back ₹ {cashback}
              </Text>
            ) : (
              <View />
            )}
          </View>
          {!item.item_availability ? (
            <View
              style={{
                height: 20,
                borderRadius: 10,
                borderColor: colors.danger,
                borderWidth: 1,
                width: 105,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10
              }}
            >
              <Text
                weight="Medium"
                style={{ fontSize: 9, marginTop: -2, color: colors.danger }}
              >
                Item Not Available
              </Text>
            </View>
          ) : null}

          {item.updated_measurement ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10
              }}
            >
              <View
                style={{
                  height: 20,
                  borderRadius: 10,
                  borderColor: colors.danger,
                  borderWidth: 1,
                  width: 170,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5
                }}
              >
                <Text
                  weight="Medium"
                  style={{ fontSize: 9, marginTop: -2, color: colors.danger }}
                >
                  Available Quantity{" "}
                  {item.updated_measurement
                    ? ` (${item.updated_measurement.measurement_value +
                        item.updated_measurement.measurement_acronym})`
                    : ``}
                </Text>
              </View>
              <Button
                onPress={declineItem}
                text="Decline"
                color="secondary"
                style={{ height: 23, width: 70 }}
                textStyle={{ fontSize: 10 }}
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};
