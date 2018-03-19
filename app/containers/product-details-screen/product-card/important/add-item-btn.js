import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Text, Button, ScreenContainer } from "../../../../elements";
import moment from "moment";
import KeyValueItem from "../../../../components/key-value-item";
import { colors } from "../../../../theme";

const AddItemBtn = ({ text, onPress, biggerSize = false }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: biggerSize ? 130 : 90,
        height: biggerSize ? 130 : 90,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        margin: 10,
        borderColor: "#e3e3e3",
        borderWidth: 1,
        borderStyle: "dashed"
      }}
    >
      <Icon name="circle-with-plus" size={30} color={colors.mainBlue} />
      <Text
        weight="Medium"
        style={{
          fontSize: 12,
          textAlign: "center",
          color: colors.secondaryText
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default AddItemBtn;
