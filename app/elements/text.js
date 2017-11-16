import React from "react";
import { StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";
import { colors } from "../theme";

const styles = StyleSheet.create({
  baseStyle: {
    color: colors.mainText
  }
});

const AppText = ({ children, weight = "Regular", style }) => (
  <Text
    style={[styles.baseStyle, { fontFamily: `Quicksand-${weight}` }, style]}
  >
    {children}
  </Text>
);

AppText.propTypes = {
  weight: PropTypes.oneOf(["Regular", "Light", "Medium", "Bold"]),
  children: PropTypes.node,
  style: Text.propTypes.style
};

export default AppText;
