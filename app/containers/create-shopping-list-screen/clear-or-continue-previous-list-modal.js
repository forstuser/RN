import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { showSnackbar } from "../../utils/snackbar";

import { getBarcodeSkuItem } from "../../api";

import Modal from "../../components/modal";
import LoadingOverlay from "../../components/loading-overlay";
import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default class ClearOrContinuePreviousListModal extends React.Component {
  state = {
    isVisible: false
  };

  show = () => {
    this.setState({ isVisible: true });
  };

  closeModal = () => {
    this.setState({
      isVisible: false
    });
  };

  closeModalAndClearList = () => {
    this.props.clearWishList();
    this.setState({
      isVisible: false
    });
  };

  render() {
    const { isVisible } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        title="Clear Shopping List"
        style={{
          height: 200,
          ...defaultStyles.card
        }}
        onClosePress={this.closeModal}
      >
        <View
          style={{
            flex: 1,
            padding: 20,
            alignItems: "center"
          }}
        >
          <Text
            style={{
              textAlign: "center"
            }}
          >
            You already have a shopping list. Do you want to clear it and create
            new list or edit the existing list?
          </Text>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Button
              onPress={this.closeModalAndClearList}
              style={{ width: 100, marginRight: 20, height: 40 }}
              text="Clear List"
              color="secondary"
            />
            <Button
              onPress={this.closeModal}
              style={{ width: 100, height: 40 }}
              text="Edit List"
              color="secondary"
              type="outline"
            />
          </View>
        </View>
      </Modal>
    );
  }
}
