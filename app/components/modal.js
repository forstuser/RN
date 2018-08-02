import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import { Text } from "../elements";
import { colors } from "../theme";

export default props => {
  const { title, onClosePress = () => null, children, style={}, ...modalProps,  } = props;
  return (
    <Modal {...modalProps} useNativeDriver={true} avoidKeyboard={Platform.OS=='ios'}>
      <View style={style}>
        <View
          style={{
            backgroundColor: colors.pinkishOrange,
            flexDirection: "row",
            padding: 10,
            alignItems: "center"
          }}
        >
          <Text
            style={{
              flex: 1,
              color: "#fff",
              size: 11
            }}
          >
            {title}
          </Text>
          <TouchableOpacity onPress={onClosePress}>
            <Icon name="md-close" color="#fff" size={20} />
          </TouchableOpacity>
        </View>
        <View style={{
              flex: 1,
            }}>
            {children}
        </View>
      </View>
    </Modal>
  );
};
