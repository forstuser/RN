import React from "react";
import { StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import LoadingOverlay from "./loading-overlay";
import { Text, ScreenContainer } from "../elements";
import { colors } from "../theme";

class Step extends React.Component {
  render() {
    const {
      hideHeader = false,
      onBackPress,
      onSkipPress,
      title,
      subtitle,
      skippable = false,
      children,
      showLoader = false
    } = this.props;
    return (
      <View style={styles.container}>
        {!hideHeader ? (
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={onBackPress}>
              <Icon name="md-arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.titlesContainer}>
              <Text weight="Bold" numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              {subtitle ? (
                <Text numberOfLines={2} style={styles.subtitle}>
                  {subtitle}
                </Text>
              ) : (
                <View />
              )}
            </View>
            {skippable ? (
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => onSkipPress()}
              >
                <Text weight="Bold" style={styles.skipText}>
                  SKIP
                </Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
        ) : (
          <View />
        )}
        <View style={styles.body}>{children}</View>
        <LoadingOverlay visible={showLoader} />
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
    height: 76
  },
  backBtn: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2
  },
  titlesContainer: {
    flex: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 16
  },
  subtitle: {
    fontSize: 12
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
