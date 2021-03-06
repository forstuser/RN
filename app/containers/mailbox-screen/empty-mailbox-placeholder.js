import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../../elements/text";
import { colors } from "../../theme";

import I18n from "../../i18n";

const noMailIcon = require("../../images/no_mailbox.png");

const EmptyMailboxPlaceholder = () => (
  <View style={styles.container}>
    <Image style={styles.image} source={noMailIcon} />
    <Text weight="Bold" style={styles.title}>
      {I18n.t("mailbox_screen_no_result_title")}
    </Text>
    <Text style={styles.text}>{I18n.t("mailbox_screen_no_result_desc")}</Text>
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
