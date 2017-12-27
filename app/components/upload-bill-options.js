import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";

import ActionSheet from "react-native-actionsheet";

import I18n from "../i18n";

import { Text, Button } from "../elements";
import { colors } from "../theme";

class UploadBillOptions extends React.Component {
  show = () => {
    this.uploadOptions.show();
  };

  handleOptionPress = index => {
    switch (index) {
      case 0:
        this.props.navigator.push({
          screen: "UploadDocumentScreen",
          passProps: {
            openPickerOnStart: "camera"
          }
        });
        break;
      case 1:
        this.props.navigator.push({
          screen: "UploadDocumentScreen",
          passProps: {
            openPickerOnStart: "images"
          }
        });
        break;
      case 2:
        this.props.navigator.push({
          screen: "UploadDocumentScreen",
          passProps: {
            openPickerOnStart: "documents"
          }
        });
        break;
    }
  };

  render() {
    return (
      <ActionSheet
        onPress={this.handleOptionPress}
        ref={o => (this.uploadOptions = o)}
        title={I18n.t("upload_document_screen_upload_options_title")}
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