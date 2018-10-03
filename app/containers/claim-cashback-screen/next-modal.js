import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { showSnackbar } from "../../utils/snackbar";

import { getBarcodeSkuItem } from "../../api";

import Modal from "../../components/modal";
import LoadingOverlay from "../../components/loading-overlay";
import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default class NextModal extends React.Component {
  state = {
    isVisible: false
  };

  show = () => {
    this.setState({ isVisible: true });
  };

  hide = () => {
    this.setState({
      isVisible: false
    });
  };

  render() {
    const { isVisible } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        title="Select Items"
        style={{
          height: 200,
          ...defaultStyles.card
        }}
        onClosePress={this.hide}
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
            As you have not selected any item, you will receive only Fixed
            cashback and not the item-wise Ccashback.
          </Text>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Button
              onPress={this.props.proceedToSellersScreen}
              style={{ width: 170, marginRight: 20, height: 40 }}
              text="Proceed Anyway"
              color="grey"
            />
            <Button
              onPress={this.hide}
              style={{ width: 100, height: 40 }}
              text="Go Back"
              color="secondary"
            />
          </View>
        </View>
      </Modal>
    );
  }
}
