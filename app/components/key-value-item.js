import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import { Text, Button } from "../elements";
import { colors } from "../theme";

const KeyValueItem = ({
  keyText = "",
  valueText = "",
  KeyComponent,
  ValueComponent
}) => {
  return (
    <View style={styles.container}>
      {keyText.length > 0 && (
        <View style={styles.key}>
          <Text style={styles.keyText}>{keyText}</Text>
        </View>
      )}
      {KeyComponent && <KeyComponent />}
      {String(valueText).length > 0 && (
        <View style={styles.value}>
          <Text weight="Medium" style={styles.valueText}>
            {valueText}
          </Text>
        </View>
      )}
      {ValueComponent && <ValueComponent />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  key: {},
  keyText: {
    fontSize: 14,
    color: colors.secondaryText
  },
  value: {
    flex: 1,
    justifyContent: "flex-end"
  },
  valueText: {
    textAlign: "right",
    fontSize: 14
  }
});
export default KeyValueItem;
