import React from "react";
import { StyleSheet, View } from "react-native";

import { Text, Image, Button } from "../../elements";

export default () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <Image
        style={{ width: 150, height: 150 }}
        source={require("../../images/blank_shopping_list.png")}
      />
      <Text
        weight="Medium"
        style={{ textAlign: "center", fontSize: 15, marginVertical: 30 }}
      >
        {`You do not have a Shopping List.\n Start adding items to create your Shopping List.`}
      </Text>
      <Button
        style={{ width: 250 }}
        text="Create Shopping List"
        color="secondary"
      />
    </View>
  );
};
