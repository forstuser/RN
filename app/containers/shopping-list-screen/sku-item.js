import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default ({ item, measurementTypes }) => {
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
          <View
            style={{
              height: 20,
              backgroundColor: colors.pinkishOrange,
              borderRadius: 10,
              minWidth: 50,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 5
            }}
          >
            <Text weight="Medium" style={{ color: "#fff", fontSize: 10 }}>
              {skuMeasurement.measurement_value +
                measurementTypes[skuMeasurement.measurement_type].acronym}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Text style={{ fontSize: 10 }}>Price: ₹{item.mrp}</Text>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <View style={{ flex: 1 }} />
        <Text weight="Medium" style={{ fontSize: 10, color: colors.mainBlue }}>
          ₹ 20 Cashback
        </Text>
      </View>
    </View>
  );
};
