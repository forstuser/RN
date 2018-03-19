import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "../elements";
import { colors } from "../theme";
import { MAIN_CATEGORY_IDS } from "../constants";
import I18n from "../i18n";
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
            {I18n.t("component_items_no_internet")}
          </Text>
          <Text style={styles.text}>{I18n.t("component_items_try_again")}</Text>
        </View>
      )}

      {error.statusCode !== 0 && (
        <View>
          <Text weight="Bold" style={styles.title}>
            {I18n.t("component_items_something_went_wrong")}
          </Text>
          <Text style={styles.text}>
            {I18n.t("component_items_unable_to_conect")}
          </Text>
        </View>
      )}
      <Button
        onPress={onRetryPress}
        text={I18n.t("component_items_retry")}
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
