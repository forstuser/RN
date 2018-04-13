import React from "react";
import { StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, ScreenContainer } from "../../../elements";
import { colors } from "../../../theme";

class Step extends React.Component {
  render() {
    const { onBackPress, title, skippable = false, children } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
            <Icon name="md-arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text weight="Bold" numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {skippable && (
            <TouchableOpacity style={styles.skipBtn}>
              <Text weight="Bold" style={styles.skipText}>
                SKIP
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.body}>{children}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: {}
    })
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterText,
    flexDirection: "row",
    alignItems: "center",
    height: 56
  },
  backBtn: {
    width: 56,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2
  },
  title: {
    fontSize: 16,
    flex: 1
  },
  skipBtn: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  },
  skipText: {
    color: colors.pinkishOrange
  },
  body: {
    flex: 1
  }
});

export default Step;
