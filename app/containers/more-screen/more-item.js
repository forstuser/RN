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

const MoreItem = ({ imageSource, text, onPress, btnText }) => (
  <TouchableOpacity onPress={onPress} style={styles.data}>
    <Image style={styles.logo} source={imageSource} resizeMode="contain" />
    <View style={styles.textContainer}>
      <Text style={styles.text} weight="Medium">
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
    marginRight: 12,
    tintColor: colors.mainBlue
  },
  textContainer: {
    height: 24,
    justifyContent: "center",
    flex: 1
  },
  text: {
    color: "#4a4a4a"
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.pinkishOrange,
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    fontSize: 12,
    color: colors.pinkishOrange
  }
});
export default MoreItem;
