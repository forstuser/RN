import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../../elements/text";
import { colors } from "../../theme";

const nearbyIcon = require("../../images/ic_nearby.png");

const EmptyServicesListPlaceholder = () => (
  <View style={styles.container}>
    <Image style={styles.image} source={nearbyIcon} />
    <Text weight="Bold" style={styles.title}>
      No Nearby Services
    </Text>
    <Text style={styles.text}>
      Currently there are no services near you. Please comeback later for the
      nearby services
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

export default EmptyServicesListPlaceholder;
