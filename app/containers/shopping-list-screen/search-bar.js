import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default () => {
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "#fff"
      }}
    >
      <View
        style={{
          flexDirection: "row",
          borderRadius: 5,
          ...defaultStyles.card
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: 36
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            backgroundColor: colors.pinkishOrange,
            padding: 10
          }}
        >
          <Text
            weight="Medium"
            style={{ color: "#fff", fontSize: 10, marginRight: 5 }}
          >
            By Brands
          </Text>
          <Icon
            name="ios-arrow-down"
            color="#fff"
            size={15}
            style={{ marginTop: 2 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
