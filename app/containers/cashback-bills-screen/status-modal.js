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
    const { openCashbackGuidelinesScreen } = this.props;
    const { isVisible, item } = this.state;

    let title = "Approved";
    let description = item.status_message;
    if (item.is_pending) {
      title = "Pending Approval";
    } else if (item.is_underprogress || item.is_partial) {
      title = "In Progress";
    } else if (item.is_rejected) {
      title = "Rejected";
    } else if (item.is_discarded) {
      title = "Discarded";
    }

    return (
      <Modal
        isVisible={isVisible}
        title={title}
        onClosePress={this.hide}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
        style={{ height: 350, backgroundColor: "#fff" }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: 15
          }}
        >
          <Text style={{ marginTop: 5, textAlign: "left" }}>{description}</Text>
          <Text
            onPress={openCashbackGuidelinesScreen}
            style={{
              marginTop: 30,
              fontSize: 14,
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
