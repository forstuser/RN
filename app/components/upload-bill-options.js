import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";

import ActionSheet from "react-native-actionsheet";

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

  handleOptionPress = index => {
    let openPickerOnStart = null;
    switch (index) {
      case 0:
        openPickerOnStart = "camera";
        break;
      case 1:
        openPickerOnStart = "images";
        break;
      case 2:
        openPickerOnStart = "documents";
        break;
    }

    if (openPickerOnStart) {
      this.props.navigator.push({
        screen: SCREENS.UPLOAD_DOCUMENT_SCREEN,
        passProps: {
          jobId: this.state.jobId,
          type: this.state.type,
          itemId: this.state.itemId,
          productId: this.state.productId,
          openPickerOnStart,
          uploadCallback: this.props.uploadCallback
        }
      });
    }
  };

  render() {
    const { actionSheetTitle = I18n.t("upload_document_screen_upload_options_title") } = this.props;
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
