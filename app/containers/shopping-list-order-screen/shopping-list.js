import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Image, Button } from "../../elements";
import { colors } from "../../theme";

export default class ShoppingList extends React.Component {
  render() {
    const { list } = this.props;

    return (
      <View style={{ padding: 16 }}>
        <FlatList
          data={list}
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
                        {/* {item.sku_measurement
                          ? ` (${item.sku_measurement.measurement_value +
                              measurementTypes[
                                item.sku_measurement.measurement_type
                              ].acronym})`
                          : ``} */}
                      </Text>
                    </Text>
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
                          You get back ₹ {cashback}
                        </Text>
                      ) : (
                        <View />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}
