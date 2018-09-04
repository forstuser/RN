import React from "react";
import { View, TouchableOpacity } from "react-native";

import { Text } from "../../elements";
import Modal from "../../components/modal";
import { colors } from "../../theme";

export default class StatusModal extends React.Component {
  state = {
    isVisible: false,
    item: {}
  };

  show = item => {
    this.setState({ isVisible: true, item });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible, item } = this.state;

    let title = "Approved";
    let description =
      "Cashback Calculated on your Bill is Rs. 845. Your Cashback is on the way. ";

    if (item.is_pending) {
      title = "Pending Approval";
      description =
        "Your Bill has been submitted successfully and is under process.";
    } else if (item.is_underprogress) {
      title = "Under Progress";
      statusText =
        "Looks like you have submitted a bill, our team is calculating cash back for the same";
    } else if (item.is_rejected) {
      title = "Rejected";
      description = "Your Bill has been rejected for some reason.";
    }

    return (
      <Modal
        isVisible={isVisible}
        title={title}
        onClosePress={this.hide}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
        style={{ height: 190, backgroundColor: "#fff" }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: 15
          }}
        >
          <Text style={{ textAlign: "center" }}>{description}</Text>
          <Text
            style={{
              marginTop: 36,
              fontSize: 9,
              textAlign: "center",
              color: colors.mainBlue,
              textDecorationLine: "underline"
            }}
          >
            Terms & Conditions
          </Text>
        </View>
      </Modal>
    );
  }
}
