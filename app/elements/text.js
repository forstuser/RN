import React from "react";
import { StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";
import { colors } from "../theme";

const styles = StyleSheet.create({
  baseStyle: {
    color: colors.mainText,
    backgroundColor: "transparent"
  }
});

const AppText = props => {
  const { children, weight = "Regular", ...textProps } = props;
  return (
    <Text
      {...textProps}
      style={[
        styles.baseStyle,
        { fontFamily: `Roboto-${weight}` },
        textProps.style
      ]}
    >
      {children}
    </Text>
  );
};

AppText.propTypes = {
  weight: PropTypes.oneOf(["Regular", "Light", "Medium", "Bold"]),
  children: PropTypes.node,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array
  ])
};

export default AppText;
