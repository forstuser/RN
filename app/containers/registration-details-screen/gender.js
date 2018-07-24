import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, Image } from "../../elements";
import { colors } from "../../theme";

const manImage = require("../../images/man.png");
const womanImage = require("../../images/woman.png");

const Gender = ({ gender, isSelected = false, onPress }) => (
  <View
    style={{
      alignItems: "center",
      margin: 20
    }}
  >
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 105,
        height: 105,
        borderRadius: 53,
        borderWidth: 2,
        backgroundColor: "#f7f7f7",
        borderColor: isSelected ? colors.mainBlue : "#cfcfcf",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
      }}
    >
      <Image
        style={{ width: 72, height: 92, marginTop: 20 }}
        source={gender == "Male" ? manImage : womanImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
    <Text weight="Bold">{gender}</Text>
  </View>
);

export default Gender;
