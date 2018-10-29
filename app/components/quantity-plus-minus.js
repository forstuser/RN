import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";

import { Text } from "../elements";
import { colors } from "../theme";

export default ({ quantity, onMinusPress, onPlusPress, show }) => (
  <View style={{ flexDirection: "row" }}>
    {!show ? (
      <TouchableOpacity onPress={onMinusPress} style={styles.signContainer}>
        <Text style={{ marginTop: Platform.OS == "ios" ? -4 : -2 }}>-</Text>
      </TouchableOpacity>
    ) : null}
    <Text
      style={{
        width: 30,
        textAlign: "center",
        marginTop: -3
      }}
    >
      {quantity}
    </Text>
    {!show ? (
      <TouchableOpacity onPress={onPlusPress} style={styles.signContainer}>
        <Text style={{ marginTop: -2 }}>+</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  signContainer: {
    borderColor: colors.pinkishOrange,
    borderWidth: 1,
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  }
});
