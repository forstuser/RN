import React from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "../../../elements";
import { colors } from "../../../theme";

export default ({ keyText, valueText, valueStyle }) => (
  <View style={styles.container}>
    <Text weight="Medium" style={styles.key}>
      {keyText}
    </Text>
    <Text weight="Medium" style={[styles.value, valueStyle]}>
      {valueText}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  key: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 5
  },
  value: {}
});
