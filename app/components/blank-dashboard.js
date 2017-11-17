import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";

const image = require("../images/dashboard_main.png");

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: "center"
  },
  imageStyle: {
    marginTop: 10,
    width: 295,
    height: 295
  },
  headlineTextStyle: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 15
  },
  textStyle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: colors.secondaryText
  },
  buttonStyle: {
    width: 200,
    marginTop: 20,
    marginBottom: 10
  },
  knowMoreTextStyle: {
    color: colors.mainBlue,
    textAlign: "center"
  }
});

const BlankDashboard = () => (
  <View style={styles.containerStyle}>
    <Image style={styles.imageStyle} source={image} />
    <Text weight="Bold" style={styles.headlineTextStyle}>
      {I18n.t("blank_dashboard_headline")}
    </Text>
    <Text style={styles.textStyle}>{I18n.t("blank_dashboard_text")}</Text>
    <Button
      color="secondary"
      style={styles.buttonStyle}
      text={I18n.t("blank_dashboard_btn_text")}
    />
    <Text weight="Light" style={styles.knowMoreTextStyle}>
      {I18n.t("blank_dashboard_know_more_text")}
    </Text>
  </View>
);

export default BlankDashboard;
