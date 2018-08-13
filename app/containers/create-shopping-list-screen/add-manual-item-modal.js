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
    itemTitle: ""
  };

  show = () => {
    this.setState({ isVisible: true });
  };

  closeModal = () => {
    this.setState({
      isVisible: false
    });
  };

  save = () => {
    const { addSkuItemToList } = this.props;
    const { itemTitle } = this.state;
    addSkuItemToList({ title: itemTitle, quantity: 1 });
    this.closeModal();
  };

  render() {
    const { isVisible, isLoading, itemTitle } = this.state;

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
            flex: 1,
            padding: 20,
            justifyContent: "center"
          }}
        >
          <TextInput
            value={itemTitle}
            onChangeText={itemTitle => this.setState({ itemTitle })}
            underlineColorAndroid="transparent"
            style={{
              borderColor: "#dadada",
              borderWidth: 1,
              height: 40,
              borderRadius: 5,
              paddingHorizontal: 5
            }}
          />
          <Button
            text="Save"
            onPress={this.save}
            style={{
              width: 150,
              alignSelf: "center",
              marginTop: 20,
              height: 40
            }}
            color="secondary"
          />
          <LoadingOverlay visible={isLoading} />
        </View>
      </Modal>
    );
  }
}
