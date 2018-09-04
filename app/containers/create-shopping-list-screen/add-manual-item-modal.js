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
    items: []
  };

  show = text => {
    this.setState({ isVisible: true, items: [text] });
  };

  closeModal = () => {
    this.setState({
      isVisible: false
    });
  };

  save = () => {
    const { addManualItemsToList = () => null } = this.props;
    addManualItemsToList(
      this.state.items.map(item => ({ title: item, quantity: 1 }))
    );
    this.closeModal();
  };

  addInput = () => {
    this.setState({ items: [...this.state.items, ""] });
  };

  changeItem = (index, text) => {
    const items = [...this.state.items];
    items[index] = text;
    this.setState({ items });
  };

  render() {
    const { isVisible, isLoading, items } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        title="Add Products Manually"
        style={{
          height: items.length * 95,
          minHeight: 300,
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
          {items.map((item, index) => (
            <View
              key={index}
              style={{
                borderColor: "#dadada",
                borderWidth: 1,
                height: 40,
                borderRadius: 5,
                paddingHorizontal: 5,
                marginBottom: 10
              }}
            >
              <TextInput
                value={item}
                onChangeText={text => this.changeItem(index, text)}
                underlineColorAndroid="transparent"
                style={{}}
              />
            </View>
          ))}

          {items.every(item => item.length > 0) && items.length < 4 ? (
            <TouchableOpacity
              onPress={this.addInput}
              style={{ flexDirection: "row" }}
            >
              <Icon
                name="md-add-circle"
                size={16}
                color={colors.pinkishOrange}
              />
              <Text weight="Medium" style={{ fontSize: 10, marginLeft: 4 }}>
                Add Another
              </Text>
            </TouchableOpacity>
          ) : null}

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
