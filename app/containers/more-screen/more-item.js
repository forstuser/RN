import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { Text, Button, ScreenContainer } from "../../elements";

const MoreItem = ({ imageSource, name, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.data}>
    <Image style={styles.logo} source={imageSource} />
    <Text style={styles.name} weight="Medium">
      {name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  data: {
    height: 60,
    padding: 30,
    flexDirection: "row",
    borderColor: "#ececec",
    borderBottomWidth: 1,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 12
  },
  name: {
    fontSize: 14,
    color: "#4a4a4a"
  }
});
export default MoreItem;
