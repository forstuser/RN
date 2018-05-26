import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../theme";

const AppTextInput = props => {
  const { leftIconName, onPress } = props;

  let leftIcon = null;
  if (leftIconName) {
    leftIcon = <Icon name={leftIconName} size={24} color={"#939393"} />;
  }

  return (
    <View style={styles.container}>
      {leftIcon ? (
        <View style={styles.leftIconContainer}>{leftIcon}</View>
      ) : (
        <View />
      )}
      <TextInput
        {...props}
        underlineColorAndroid="transparent"
        placeholderTextColor={"#939393"}
        style={styles.input}
      />
      {typeof onPress == "function" ? (
        <TouchableOpacity style={styles.overlayTouchable} onPress={onPress} />
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#c2c2c2",
    marginBottom: 15
  },
  leftIconContainer: {
    paddingRight: 5,
    paddingBottom: 0,
    width: 30,
    // backgroundColor: 'green',
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    flex: 1,
    height: 40
  },
  overlayTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  }
});

export default AppTextInput;
