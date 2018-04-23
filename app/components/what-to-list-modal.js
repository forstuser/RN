import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "../elements";
import Modal from "react-native-modal";
import { colors } from "../theme";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL } from "../api";
import { SCREENS } from "../constants";
import CustomTextInput from "./form-elements/text-input";
const tick = require("../images/tick.png");

class WhatToListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({
      visible: false
    });
  };

  onSaveBtn = () => {};

  render() {
    const { navigator } = this.props;
    const { visible } = this.state;
    return (
      <Modal isVisible={visible}>
        <View style={styles.finishModal}>
          <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
            <Icon name="md-close" size={20} color={colors.mainText} />
          </TouchableOpacity>
          <CustomTextInput
            placeholder="Add Item"
            underlineColorAndroid="transparent"
            style={{ marginTop: 15 }}
            // value={Item}
            // onChangeText={sellerName => this.setState({ sellerName })}
          />
          <Button
            onPress={this.onSaveBtn}
            style={styles.finishBtn}
            text="SAVE"
            color="secondary"
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  finishModal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    alignSelf: "center"
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "transparent"
  },
  finishImage: {
    width: 200,
    height: 200
  },
  text: {
    textAlign: "left"
  },
  finishMsg: {
    color: colors.mainBlue,
    fontSize: 24,
    textAlign: "center",
    marginTop: 25,
    width: 200
  },
  finishBtn: {
    width: "100%"
    // marginTop: 20
  }
});

export default WhatToListModal;
