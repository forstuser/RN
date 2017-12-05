import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../../elements/text";
import { colors } from "../../theme";

const noDocsIcon = require("../../images/ic_no_docs.png");

const EmptyPendingDocsPlaceholder = () => (
  <View style={styles.container}>
    <Image style={styles.image} source={noDocsIcon} />
    <Text weight="Bold" style={styles.title}>
      No Docs Under Processing
    </Text>
    <Text style={styles.text}>
      All the docs has been processed or you havn't uploaded any doc yet.
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

export default EmptyPendingDocsPlaceholder;
