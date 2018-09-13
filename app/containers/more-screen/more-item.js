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
import { colors } from "../../theme";

const MoreItem = ({ imageSource, text, onPress, btnText, imageStyle = {} }) => (
  <TouchableOpacity onPress={onPress} style={styles.data}>
    <Image
      style={[styles.image, imageStyle]}
      source={imageSource}
      resizeMode="contain"
    />
    <View style={styles.textContainer}>
      <Text style={styles.text} weight="Bold">
        {text}
      </Text>
    </View>
    {btnText ? (
      <View style={styles.btn}>
        <Text style={styles.btnText} weight="Bold">
          {btnText}
        </Text>
      </View>
    ) : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  data: {
    height: 40,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: colors.mainBlue,
    tintColor: "#999"
  },
  textContainer: {
    height: 24,
    justifyContent: "center",
    flex: 1
  },
  text: {
    color: "#4a4a4a",
    fontSize: 14
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.pinkishOrange,
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    fontSize: 9,
    color: colors.pinkishOrange
  }
});
export default MoreItem;
