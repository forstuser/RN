import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "../elements";
import { colors } from "../theme";
import { MAIN_CATEGORY_IDS } from "../constants";

const apiErrorIcon = require("../images/api_other_error.png");
const netErrorIcon = require("../images/no_internet.png");

const ErrorOverlay = ({ error, onRetryPress }) => {
  if (!error) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={error.statusCode === 0 ? netErrorIcon : apiErrorIcon}
      />
      {error.statusCode === 0 && (
        <View>
          <Text weight="Bold" style={styles.title}>
            No Internet Connection
          </Text>
          <Text style={styles.text}>
            Please check if your phone is connected to the internet and try
            again
          </Text>
        </View>
      )}

      {error.statusCode !== 0 && (
        <View>
          <Text weight="Bold" style={styles.title}>
            Something Went Wrong
          </Text>
          <Text style={styles.text}>
            Unable to connect to BinBill to get your information. Please try
            again in sometime.
          </Text>
        </View>
      )}
      <Button
        onPress={onRetryPress}
        text="RETRY"
        color="secondary"
        style={{ width: 200 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backgroundColor: "#fff"
  },
  image: {
    width: 140,
    height: 140
  },
  title: {
    fontSize: 18,
    color: colors.mainText,
    textAlign: "center"
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    padding: 16,
    color: colors.lighterText
  }
});

export default ErrorOverlay;
