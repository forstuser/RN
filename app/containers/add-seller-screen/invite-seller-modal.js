import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { showSnackbar } from "../../utils/snackbar";

import { inviteSeller } from "../../api";

import Modal from "../../components/modal";
import LoadingOverlay from "../../components/loading-overlay";
import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default class InviteSellerModal extends React.Component {
  state = {
    isVisible: false,
    isLoading: false,
    phoneNumber: "",
    isInviteSent: false
  };

  show = text => {
    this.setState({ isVisible: true, phoneNumber: text, isInviteSent: false });
  };

  closeModal = () => {
    this.setState({
      isVisible: false
    });
  };

  invite = async () => {
    const { phoneNumber, isInviteSent } = this.state;
    if (isInviteSent) {
      return this.closeModal();
    }
    if (phoneNumber.length != 10) {
      return showSnackbar({ text: "Please enter 10 digit mobile number" });
    }
    try {
      this.setState({ isLoading: true });
      await inviteSeller({ phoneNumber });
      this.setState({ isInviteSent: true });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isVisible, isLoading, phoneNumber, isInviteSent } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        title="Invite Seller"
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
          <View>
            {isInviteSent ? (
              <Text weight="Medium" style={{ textAlign: "center" }}>
                Invitation sent successfully!
              </Text>
            ) : (
              <TextInput
                value={phoneNumber}
                onChangeText={phoneNumber => this.setState({ phoneNumber })}
                underlineColorAndroid="transparent"
                style={{
                  borderColor: "#dadada",
                  borderWidth: 1,
                  height: 40,
                  borderRadius: 5,
                  paddingHorizontal: 5,
                  marginBottom: 10
                }}
              />
            )}
          </View>

          <Button
            text={isInviteSent ? "Okay" : "Invite"}
            onPress={this.invite}
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