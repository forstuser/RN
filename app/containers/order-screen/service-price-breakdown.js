import React from "react";
import { View } from "react-native";

import { Text } from "../../elements";

import Modal from "../../components/modal";

export default class ServicePriceBreakdownModal extends React.Component {
  state = {
    isVisible: false
  };

  show = () => {
    this.setState({ isVisible: true });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible } = this.state;
    return (
      <Modal
        isVisible={isVisible}
        title="Pricing"
        style={{ height: 200, backgroundColor: "#fff" }}
        onClosePress={this.hide}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>
            {`a. Fixed Charge (1 Hr : Rs. ${230})\n\nb. Variable Charge (${30} Min : ${100}INR) = ${100}x${1}=${100}\n\nc. Total (a+ b) = ${330}`}
          </Text>
        </View>
      </Modal>
    );
  }
}
