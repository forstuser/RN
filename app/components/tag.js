import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text } from "../elements";
import { colors } from "../theme";

export default ({ text, onPressClose }) => (
  <View
    style={{
      backgroundColor: colors.pinkishOrange,
      borderRadius: 13,
      padding: 5,
      flexDirection: "row",
      alignItems: "center",
      height: 25,
      marginHorizontal: 5
    }}
  >
    <Text
      style={{ color: "#fff", fontSize: 10, marginRight: 10, marginLeft: 5 }}
    >
      {text}
    </Text>
    <TouchableOpacity
      onPress={onPressClose}
      style={{
        backgroundColor: "#fff",
        width: 16,
        height: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        overflow: "hidden"
      }}
    >
      <Icon name="md-close" size={16} color={colors.pinkishOrange} />
    </TouchableOpacity>
  </View>
);
