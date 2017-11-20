import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../elements/text";

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  imageStyle: {
    width: 300,
    height: 300
  },
  textStyle: {
    fontSize: 16,
    textAlign: "center",
    padding: 24
  }
});

const IntroSlide = ({ image, text }) => (
  <View style={styles.containerStyle}>
    <Image style={styles.imageStyle} source={image} />
    <Text weight="Medium" style={styles.textStyle}>
      {text}
    </Text>
  </View>
);

export default IntroSlide;
