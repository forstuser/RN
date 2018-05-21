import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";

import {
  requestCameraPermission,
  requestStoragePermission
} from "../android-permissions";

import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";

import I18n from "../i18n";

import { Text, Button } from "../elements";
import { colors } from "../theme";
import { SCREENS } from "../constants";

class UploadBillOptions extends React.Component {
  state = {
    jobId: null,
    type: null,
    itemId: null,
    productid: null
  };

  show = (jobId, type, itemId, productId) => {
    this.setState(
      {
        jobId,
        type,
        itemId,
        productId
      },
      () => {
        this.uploadOptions.show();
      }
    );
  };

  handleOptionPress = async index => {
    let file = null;
    switch (index) {
      case 0:
        if ((await requestCameraPermission()) == false) return;
        const file = await ImagePicker.openCamera({
          compressImageMaxWidth: 1500,
          compressImageMaxHeight: 1500,
          compressImageQuality: 0.75,
          cropping: false
        });
        //in some devices, next screen doesn't open after taking photo
        setTimeout(() => {
          this.openUploadScreen({
            filename: "camera-image-1.jpg",
            uri: file.path,
            mimeType: file.mime
          });
        }, 100);

        break;
      case 1:
        if ((await requestStoragePermission()) == false) return;
        file = await ImagePicker.openPicker({
          compressImageMaxWidth: 1500,
          compressImageMaxHeight: 1500,
          compressImageQuality: 0.75,
          cropping: false
        });

        this.openUploadScreen({
          filename: file.filename,
          uri: file.path,
          mimeType: file.mime
        });

        break;
      case 2:
        DocumentPicker.show(
          {
            filetype: [DocumentPickerUtil.pdf(), DocumentPickerUtil.plainText()]
          },
          (error, file) => {
            if (file) {
              this.openUploadScreen({
                filename: file.fileName,
                uri: file.uri,
                mimeType: file.type || file.fileName.split(".").pop()
              });
            }
          }
        );
        break;
    }
  };

  openUploadScreen = file => {
    this.props.navigation.navigate(SCREENS.UPLOAD_DOCUMENT_SCREEN, {
      jobId: this.state.jobId,
      type: this.state.type,
      itemId: this.state.itemId,
      productId: this.state.productId,
      file: file,
      uploadCallback: this.props.uploadCallback
    });
  };

  render() {
    const {
      actionSheetTitle = I18n.t("upload_document_screen_upload_options_title")
    } = this.props;
    return (
      <ActionSheet
        onPress={this.handleOptionPress}
        ref={o => (this.uploadOptions = o)}
        title={actionSheetTitle}
        cancelButtonIndex={3}
        options={[
          I18n.t("upload_document_screen_upload_options_camera"),
          I18n.t("upload_document_screen_upload_options_gallery"),
          I18n.t("upload_document_screen_upload_options_document"),
          I18n.t("upload_document_screen_upload_options_cancel")
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
});
export default UploadBillOptions;
