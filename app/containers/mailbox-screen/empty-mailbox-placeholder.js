import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../../elements/text";
import { colors } from "../../theme";

const noMailIcon = require("../../images/no_mailbox.png");

const EmptyMailboxPlaceholder = () => (
  <View style={styles.container}>
    <Image style={styles.image} source={noMailIcon} />
    <Text weight="Bold" style={styles.title}>
      No Action Here
    </Text>
    <Text style={styles.text}>
      We will start sending imporatant messages as soon as the action starts
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  image: {
    width: 140,
    height: 140
  },
  title: {
    fontSize: 18,
    color: colors.mainText
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    padding: 16,
    color: colors.lighterText
  }
});

export default EmptyMailboxPlaceholder;
