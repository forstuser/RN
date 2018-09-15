import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import I18n from "../i18n";
import { Text, Button } from "../elements";
import { colors } from "../theme";

const KeyValueItem = ({
  keyText = "",
  valueText = "",
  keyTextStyle = {},
  valueTextStyle = {},
  KeyComponent,
  ValueComponent
}) => {
  return (
    <View collapsable={false} style={styles.container}>
      {keyText.length > 0 ? (
        <View collapsable={false} style={styles.key}>
          <Text style={[styles.keyText, keyTextStyle]}>{keyText}</Text>
        </View>
      ) : (
        <View collapsable={false} />
      )}
      {KeyComponent ? <KeyComponent /> : <View collapsable={false} />}
      {String(valueText).length > 0 ? (
        <View collapsable={false} style={styles.value}>
          <Text weight="Medium" style={[styles.valueText, valueTextStyle]}>
            {valueText}
          </Text>
        </View>
      ) : (
        <View collapsable={false} />
      )}
      {ValueComponent ? <ValueComponent /> : <View collapsable={false} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
