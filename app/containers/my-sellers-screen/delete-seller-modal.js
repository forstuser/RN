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

class DeleteSellerModal extends React.Component {
  state = {
    isVisible: false,
    sellerId: null
  };

  show = sellerId => {
    this.setState({ isVisible: true, sellerId });
  };

  hide = () => {
    this.setState({
      isVisible: false
    });
  };

  deleteSellerHandler = async sellerId => {
    this.hide();
    //console.log("Deleted Seller");
    try {
      const deleteReponse = await deleteSeller(sellerId);
    } catch (error) {
      console.log("error: ", error);
    }
    this.props.getMySellers();
  };

  render() {
    //console.log("Seller ID________", this.state.sellerId);
    const { isVisible, sellerId } = this.state;

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
            width: 280,
            height: 175,
            alignSelf: "center",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            weight="Regular"
            style={{ fontSize: 15, marginBottom: 20, textAlign: "center" }}
          >
            Are you sure you want to delete this seller?
          </Text>
          <View
            style={{
              width: "100%",
              maxWidth: 220,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Button
              text="No"
              style={{ width: 100, height: 40 }}
              textStyle={{ fontSize: 12 }}
              color="secondary"
              type="outline"
              onPress={this.hide}
            />
            <Button
              text="Yes"
              style={{ width: 100, height: 40 }}
              color="secondary"
              textStyle={{ fontSize: 12 }}
              onPress={() => this.deleteSellerHandler(sellerId)}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

export default DeleteSellerModal;
