import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";
import call from "react-native-phone-call";
import { connect } from "react-redux";

import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";

import { loginToApplozic, openChatWithSeller } from "../../applozic";

import { API_BASE_URL, getMySellers, deleteSeller } from "../../api";

import { Text, Image, Button } from "../../elements";
import DrawerScreenContainer from "../../components/drawer-screen-container";
import Modal from "react-native-modal";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { defaultStyles, colors } from "../../theme";
import { SCREENS, SELLER_TYPE_IDS } from "../../constants";
import { showSnackbar } from "../../utils/snackbar";
import Analytics from "../../analytics";

class ProfilePicModal extends React.Component {
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
        useNativeDriver={true}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
      >
        <View
          style={{
            backgroundColor: "#fff",
            width: 330,
            height: 175,
            alignSelf: "center",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            weight="Medium"
            style={{
              padding: 10,
              fontSize: 15,
              marginBottom: 20,
              textAlign: "center"
            }}
          >
            Your profile image helps your seller respond better and faster to
            your orders.
          </Text>
          <View
            style={{
              width: "100%",
              maxWidth: 270,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Button
              text="Proceed Anyway"
              style={{ width: 125, height: 40 }}
              textStyle={{ fontSize: 12 }}
              color="secondary"
              type="outline"
              onPress={this.props.onProceedAnyway}
            />
            <Button
              text="Upload Image"
              style={{ width: 125, height: 40 }}
              color="secondary"
              textStyle={{ fontSize: 12 }}
              onPress={this.hide}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

export default ProfilePicModal;
