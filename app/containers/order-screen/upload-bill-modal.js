import React from "react";
import { View, Image, TouchableOpacity, TextInput } from "react-native";

import { Text, Button, UploadDoc } from "../../elements";
import Modal from "../../components/modal";

import ChecklistModal from "../claim-cashback-screen/checklist-modal";
import { colors } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";

export default class UploadBillModal extends React.Component {
  state = {
    isVisible: false,
    copies: [],
    productId: null,
    jobId: null,
    isChecklistModalVisible: false,
    totalAmount: 0
  };

  show = ({ jobId, productId }) => {
    this.setState({ isVisible: true, jobId, productId });
  };

  showModal = () => {
    this.setState({ isVisible: true });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  hideChecklistModal = () => {
    this.setState({ isChecklistModalVisible: false });
  };

  render() {
    const { navigation, onUploadDone } = this.props;
    const {
      isVisible,
      copies,
      jobId,
      productId,
      isChecklistModalVisible,
      totalAmount
    } = this.state;
    return (
      <Modal
        isVisible={isVisible}
        title="Upload Bill"
        style={{
          height: 350,
          backgroundColor: "#fff"
        }}
        onClosePress={this.hide}
      >
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: "center", fontSize: 16, marginBottom: 20 }}>
            Upload your Bill to claim cashback
          </Text>

          <TouchableOpacity
            onPress={() => this.setState({ isChecklistModalVisible: true })}
            style={{ alignSelf: "center", alignItems: "center" }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#f1f1f1",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                style={{ width: 20, height: 26 }}
                source={require("../../images/checklist_icon.png")}
              />
            </View>
            <Text
              style={{ marginTop: 7, color: colors.mainBlue, fontSize: 10 }}
            >
              View Checklist
            </Text>
          </TouchableOpacity>
          <TextInput
            keyboardType="numeric"
            placeholder="Total Amount"
            value={totalAmount}
            onChangeText={totalAmount => this.setState({ totalAmount })}
            underlineColorAndroid="transparent"
            style={{
              borderColor: "#dadada",
              borderBottomWidth: 1,
              height: 40,
              marginBottom: 10
            }}
          />
          <UploadDoc
            ref={node => {
              this.uploadDoc = node;
            }}
            navigation={navigation}
            copies={copies}
            productId={productId}
            itemId={productId}
            jobId={jobId}
            type={1}
            canUseCameraOnly={true}
            onPicTaken={this.hide}
            placeholder="Upload Bill"
            //   placeholder2="*"
            //placeholder2Color={colors.mainBlue}
            onUpload={onUploadDone}
          />
          {/* <Button
            onPress={() => alert("Submit")}
            text="Submit"
            color="secondary"
            borderRadius={20}
            style={{
              height: 40,
              width: 100,
              alignSelf: "center",
              marginTop: 5
            }}
          /> */}
          <ChecklistModal
            isChecklistModalVisible={isChecklistModalVisible}
            hideChecklistModal={this.hideChecklistModal}
          />
        </View>
      </Modal>
    );
  }
}
