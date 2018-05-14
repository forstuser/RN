import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../theme";

const buttonColors = {
  primary: [colors.aquaBlue, colors.mainBlue],
  secondary: [colors.tomato, colors.pinkishOrange]
};

const AppButton = ({
  onPress,
  text,
  color = "primary",
  type = "normal",
  state = "normal",
  style,
  textStyle,
  borderRadius = 50,
  gradientStyle,
  outlineBtnStyle
}) => (
  <View
    collapsable={false}
    style={[
      styles.container,
      style,
      { opacity: state === "disabled" ? 0.7 : 1 }
    ]}
  >
    {type === "normal" && (
      <LinearGradient
        start={{ x: 0.0, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        colors={buttonColors[color]}
        style={[styles.gradientStyle, gradientStyle, { borderRadius }]}
      >
        <TouchableOpacity
          style={styles.touchStyle}
          disabled={state !== "normal"}
          onPress={onPress}
        >
          <Text style={[styles.textStyle, textStyle]}>{text}</Text>
        </TouchableOpacity>
      </LinearGradient>
    )}
    {type === "outline" && (
      <View
        collapsable={false}
        style={[
          styles.gradientStyle,
          styles.outlineStyle,
          {
            borderRadius,
            borderColor: buttonColors[color][1]
          },
          outlineBtnStyle
        ]}
      >
        <TouchableOpacity
          style={styles.touchStyle}
          disabled={state !== "normal"}
          onPress={onPress}
        >
          <Text
            style={[
              styles.textStyle,
              {
                color: buttonColors[color][1]
              },
              textStyle
            ]}
          >
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

AppButton.propTypes = {
  onPress: PropTypes.func,
  color: PropTypes.oneOf(["primary", "secondary"]),
  type: PropTypes.oneOf(["normal", "outline"]),
  state: PropTypes.oneOf(["normal", "disabled"]),
  text: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array
  ])
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    height: 50
  },
  gradientStyle: {
    height: "100%"
  },
  outlineStyle: {
    borderWidth: 1
  },
  touchStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  textStyle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    backgroundColor: "transparent",
    color: "#ffffff"
  }
});
