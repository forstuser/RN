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
    const { canUseCameraOnly = false } = this.props;
    this.setState(
      {
        jobId,
        type,
        itemId,
        productId
      },
      () => {
        if (canUseCameraOnly) {
          this.handleOptionPress(0);
        } else {
          this.uploadOptions.show();
        }
      }
    );
  };

  handleOptionPress = async index => {
    let file = null;
    switch (index) {
      case 0:
        const cameraPermission = await requestCameraPermission();
        console.log("cameraPermission-1");
        if (!cameraPermission) return;
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
          width: 1500,
          height: 1500,
          compressImageQuality: 0.75
        });

        this.openUploadScreen({
          filename: file.filename,
          uri: file.path,
          mimeType: file.mime
        });

        break;
      case 2:
        if ((await requestStoragePermission()) == false) return;
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
    const { onPicTaken } = this.props;
    if (typeof onPicTaken == "function") {
      onPicTaken();
    }

    this.props.navigation.navigate(SCREENS.UPLOAD_DOCUMENT_SCREEN, {
      jobId: this.state.jobId,
      type: this.state.type,
      itemId: this.state.itemId,
      productId: this.state.productId,
      file: file,
      uploadCallback: this.props.uploadCallback,
      canUseCameraOnly: this.props.canUseCameraOnly || false
    });
  };

  render() {
    const {
      actionSheetTitle = I18n.t("upload_document_screen_upload_options_title"),
      canUseCameraOnly = false
    } = this.props;

    const options = [I18n.t("upload_document_screen_upload_options_camera")];
    if (!canUseCameraOnly) {
      options.push(I18n.t("upload_document_screen_upload_options_gallery"));
      options.push(I18n.t("upload_document_screen_upload_options_document"));
    }
    options.push(I18n.t("upload_document_screen_upload_options_cancel"));

    return (
      <ActionSheet
        onPress={this.handleOptionPress}
        ref={o => (this.uploadOptions = o)}
        title={actionSheetTitle}
        cancelButtonIndex={!canUseCameraOnly ? 3 : 1}
        options={options}
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
