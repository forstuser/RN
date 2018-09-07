import React from "react";
import { View } from "react-native";

import { Text, Button } from "../../elements";
import Modal from "../../components/modal";

export default class UploadBillModal extends React.Component {
  render() {
    return (
      <Modal
        title="Upload Bill"
        style={{
          height: 150
        }}
      >
        <View style={{}}>
          <Text>Upload invoice to claim cashback</Text>
        </View>
      </Modal>
    );
  }
}
