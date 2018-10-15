import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Picker
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { showSnackbar } from "../../utils/snackbar";

import { inviteSellerByName } from "../../api";

import Modal from "../../components/modal";
import LoadingOverlay from "../../components/loading-overlay";
import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default class InviteSellerModal extends React.Component {
  state = {
    isVisible: false,
    isLoading: false,
    shopName: "",
    shopPhoneNumber: "",
    city: "Gurgaon",
    locality: "",
    isInviteSent: false
  };

  show = text => {
    this.setState({ isVisible: true, name: text, isInviteSent: false });
  };

  closeModal = () => {
    this.setState({
      isVisible: false
    });
  };

  invite = async () => {
    const {
      shopName,
      shopPhoneNumber,
      city,
      locality,
      isInviteSent
    } = this.state;

    if (isInviteSent) {
      return this.closeModal();
    }

    let s1 = locality;
    let s2 = city;
    let address = s1.concat(s2);

    try {
      this.setState({ isLoading: true });
      await inviteSellerByName({ shopName, shopPhoneNumber, address });
      this.setState({ isInviteSent: true });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      isVisible,
      isLoading,
      shopName,
      shopPhoneNumber,
      city,
      locality,
      isInviteSent
    } = this.state;

    return (
      <Modal
        isVisible={isVisible}
        title="Invite Seller"
        style={{
          height: isInviteSent ? 200 : 380,
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
              <View>
                <TextInput
                  placeholder="Shop Name"
                  value={shopName}
                  onChangeText={shopName => this.setState({ shopName })}
                  underlineColorAndroid="transparent"
                  style={{
                    borderColor: "#dadada",
                    borderWidth: 1,
                    height: 40,
                    borderRadius: 5,
                    //paddingHorizontal: 5,
                    marginBottom: 10,
                    padding: 10
                  }}
                />
                <TextInput
                  placeholder="Shop Phone number"
                  value={shopPhoneNumber}
                  onChangeText={shopPhoneNumber =>
                    this.setState({ shopPhoneNumber })
                  }
                  underlineColorAndroid="transparent"
                  style={{
                    borderColor: "#dadada",
                    borderWidth: 1,
                    height: 40,
                    borderRadius: 5,
                    //paddingHorizontal: 5,
                    marginBottom: 10,
                    padding: 10
                  }}
                />
                <View
                  style={{
                    borderColor: "#dadada",
                    borderWidth: 1,
                    height: 40,
                    borderRadius: 5,
                    //paddingHorizontal: 5,
                    marginBottom: 10,
                    padding: 10
                  }}
                >
                  <Picker
                    mode="dropdown"
                    selectedValue={city}
                    style={{
                      height: 20
                    }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ city: itemValue })
                    }
                  >
                    <Picker.Item label="Gurgaon" value="Gurgaon" />
                    <Picker.Item label="Delhi" value="Delhi" />
                    <Picker.Item label="Noida" value="Noida" />
                    <Picker.Item label="Greater Noida" value="Greater Noida" />
                    <Picker.Item label="Faridabad" value="Faridabad" />
                    <Picker.Item label="Ghaziabad" value="Ghaziabad" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
                <TextInput
                  placeholder="Locality"
                  value={locality}
                  onChangeText={locality => this.setState({ locality })}
                  underlineColorAndroid="transparent"
                  style={{
                    borderColor: "#dadada",
                    borderWidth: 1,
                    height: 40,
                    borderRadius: 5,
                    //paddingHorizontal: 5,
                    marginBottom: 10,
                    padding: 10
                  }}
                />
              </View>
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
