import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../theme";

const buttonColors = {
  primary: [colors.aquaBlue, colors.mainBlue],
  secondary: [colors.pinkishOrange, colors.tomato]
};

const AppButton = ({
  onPress,
  text,
  color = "primary",
  type = "normal",
  state = "normal",
  style = {}
}) => (
  <View style={[style, { opacity: state === "disabled" ? 0.7 : 1 }]}>
    {type === "normal" && (
      <LinearGradient
        start={{ x: 0.0, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        colors={buttonColors[color]}
        style={styles.containerStyle}
      >
        <TouchableOpacity
          style={styles.touchStyle}
          disabled={state !== "normal"}
          onPress={onPress}
        >
          <Text style={styles.textStyle}>{text}</Text>
        </TouchableOpacity>
      </LinearGradient>
    )}
    {type === "outline" && (
      <View
        style={[
          styles.containerStyle,
          styles.outlineStyle,
          {
            borderColor: buttonColors[color][0]
          }
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
                color: buttonColors[color][0]
              }
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
  text: PropTypes.string
};

export default AppButton;

const styles = StyleSheet.create({
  containerStyle: {
    height: 50,
    borderRadius: 44
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
