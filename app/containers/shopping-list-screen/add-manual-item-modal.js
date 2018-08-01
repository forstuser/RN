import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { showSnackbar } from "../../utils/snackbar";

import { getBarcodeSkuItem } from "../../api";

import Modal from "../../components/modal";
import LoadingOverlay from "../../components/loading-overlay";
import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default class AddManualItemModal extends React.Component {
  state = {
    isVisible: false,
    isLoading: false,
    items: null
  };

  show = () => {
    this.setState({ isVisible: true });
  };

  closeModal = () => {
    this.setState({
      isVisible: false
    });
  };

  render() {
    const { isVisible, isLoading, items } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        title="Add Product Manually"
        style={{
          height: 200,
          ...defaultStyles.card
        }}
        onClosePress={this.closeModal}
      >
        <View
          style={{
            flex: 1
          }}
        >
          <TextInput />
          <LoadingOverlay visible={isLoading} />
        </View>
      </Modal>
    );
  }
}
