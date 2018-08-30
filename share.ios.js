import React from "react";
import { AppRegistry, View, Text } from "react-native";
import ShareExtension from "react-native-share-extension";

const Share = async () => {
  const { type, value } = await ShareExtension.data();
  return (
    <View>
      <Text>Share</Text>
    </View>
  );
};

AppRegistry.registerComponent("BinBillShareExtension", () => Share);
