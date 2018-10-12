import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "../../components/modal";
import { Text, Button } from "../../elements";
import { API_BASE_URL, getMySellers } from "../../api";

import { defaultStyles, colors } from "../../theme";

class WishListLimitModal extends Component {
  state = {
    isVisible: false,
    limit: null
  };

  show = () => {
    this.setState({ isVisible: true });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible, limit } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        title="Quantity Limit"
        style={{
          height: 175,
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
            You cannot add more than 20 items
          </Text>
          <View style={{ marginTop: 20 }}>
            <Button
              onPress={this.hide}
              style={{ width: 100, height: 40 }}
              text="Ok"
              color="secondary"
            />
          </View>
        </View>
      </Modal>
    );
  }
}

export default WishListLimitModal;
