import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { colors, defaultStyles } from "../theme";
import { Text, Button } from "../elements";
import Icon from "react-native-vector-icons/Ionicons";

const AddNewBtn = ({ text, onPress, style }) => (
  <Button text={text} onPress={onPress} color="secondary" />
  // <TouchableOpacity style={[styles.addNewBtn, style]} onPress={onPress}>
  //   <View collapsable={false} style={styles.container}>
  //     <Icon name="md-add" size={20} color={colors.pinkishOrange} />
  //     <Text weight="Medium" style={{ color: "#9b9b9b", marginLeft: 10 }}>
  //       {" "}
  //       {text}
  //     </Text>
  //   </View>
  // </TouchableOpacity>
);
const styles = StyleSheet.create({
  addNewBtn: {
    ...defaultStyles.card,
    borderRadius: 4
  },
  container: {
    flexDirection: "row",
    padding: 12,
    justifyContent: "center"
  }
});

export default AddNewBtn;
