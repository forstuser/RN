import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../theme";

const AppTextInput = props => {
  const { leftIconName } = props;

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
    width: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    flex: 1,
    height: 30
  }
});

export default AppTextInput;
