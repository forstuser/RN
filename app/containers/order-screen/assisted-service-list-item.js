import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { API_BASE_URL } from "../../api";
import { Text, Image, Button } from "../../elements";
import { colors } from "../../theme";

export default ({ item, index }) => {
  return (
    <View
      style={{
        margin: 10,
        overflow: "hidden",
        flexDirection: "row",
        padding: 10
      }}
    >
      <Image
        style={{
          width: 48,
          height: 48
        }}
        source={{
          uri: API_BASE_URL + `/assisted/${item.service_type_id}/images`
        }}
        resizeMode="contain"
      />

      <View style={{ flex: 1, paddingHorizontal: 5, marginLeft: 10 }}>
        <Text weight="Medium" style={{ fontSize: 11 }}>
          {item.service_name}
        </Text>
      </View>
    </View>
  );
};
