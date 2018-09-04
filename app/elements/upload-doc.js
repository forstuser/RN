import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import I18n from "../i18n";
import { openBillsPopUp } from "../navigation";
import { Text } from "./";
import { colors, defaultStyles } from "../theme";
import UploadBillOptions from "../components/upload-bill-options";

const AttachmentIcon = () => (
  <Icon name="attachment" size={17} color={colors.pinkishOrange} />
);

class UploadDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDocUploaded: false
    };
  }
  onUploadDocPress = () => {
    const { jobId, type = 1, itemId, productId } = this.props;
    if (typeof this.props.beforeUpload == "function") {
      if (this.props.beforeUpload() == true) {
        this.uploadBillOptions.show(jobId, type, itemId, productId);
      }
    } else {
      this.uploadBillOptions.show(jobId, type, itemId, productId);
    }
  };
  onUpload = uploadResult => {
    if (typeof this.props.onUpload == "function") {
      this.props.onUpload(uploadResult);
    }
    this.setState({
      isDocUploaded: true
    });
  };

  render() {
    let {
      style = {},
      innerContainerStyle = {},
      navigation,
      itemId,
      copies = [],
      productId,
      jobId,
      type,
      hint,
      docType,
      placeholder,
      placeholder2,
      canUseCameraOnly = false,
      placeholderAfterUpload = I18n.t(
        "expense_forms_header_upload_doc_successfully"
      ),
      placeholder2Color = colors.secondaryText,
      actionSheetTitle
    } = this.props;
    const { isDocUploaded } = this.state;
    if (!copies) {
      copies = [];
    }
    console.log("this.props:: ", this.props);
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.innerContainer, innerContainerStyle]}>
          <View
            style={[
              styles.placeholderContainer,
              copies.length > 0 ? styles.filledInputPlaceholderContainer : {}
            ]}
          >
            <Text
              weight="Medium"
              style={[
                styles.placeholder,
                copies.length > 0 ? styles.filledInputPlaceholder : {}
              ]}
            >
              {placeholder}
            </Text>
            <Text
              weight="Medium"
              style={[styles.placeholder2, { color: placeholder2Color }]}
            >
              {placeholder2}
            </Text>
          </View>
          {copies.length > 0 ? (
            <View style={styles.textInput}>
              <Text
                weight="Medium"
                style={styles.copiesCount}
                onPress={() => {
                  openBillsPopUp({
                    copies: copies,
                    type: docType
                  });
                }}
              >
                {copies.length} Uploaded
              </Text>
              <Text
                weight="Bold"
                onPress={() => {
                  this.uploadBillOptions.show(jobId, type, itemId, productId);
                }}
                style={styles.addText}
              >
                {I18n.t("expense_forms_header_upload_add")}
              </Text>
            </View>
          ) : null}
          {copies.length == 0 ? (
            <View collapsable={false} style={styles.attachmentIconContainer}>
              <AttachmentIcon />
            </View>
          ) : null}

          <UploadBillOptions
            ref={ref => (this.uploadBillOptions = ref)}
            navigation={navigation}
            uploadCallback={this.onUpload}
            actionSheetTitle={actionSheetTitle}
            canUseCameraOnly={canUseCameraOnly}
          />
          {copies.length == 0 ? (
            <TouchableOpacity
              onPress={this.onUploadDocPress}
              style={styles.touchableOverlay}
            />
          ) : null}
        </View>

        {hint ? (
          <Text weight="Regular" style={styles.hint}>
            {hint}
          </Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15
  },
  innerContainer: {
    width: "100%",
    borderBottomColor: "#c2c2c2",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 45
  },
  copiesCount: {
    fontSize: 14,
    color: colors.mainBlue,
    flex: 1,
    textDecorationLine: "underline"
  },
  addText: {
    color: colors.pinkishOrange
  },
  placeholderContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 10,
    left: 0
    // paddingVertical: 10,
  },
  touchableOverlay: {
    position: "absolute",
    top: 0,
    bottom: 10,
    left: 0,
    right: 0
    // paddingVertical: 10,
  },
  filledInputPlaceholderContainer: {
    alignItems: "flex-start",
    top: 0,
    paddingVertical: 0
  },
  placeholder: {
    color: colors.secondaryText
  },
  filledInputPlaceholder: {
    fontSize: 10
  },
  placeholder2: {
    fontSize: 10,
    marginLeft: 2
  },
  attachmentIconContainer: {
    position: "absolute",
    right: 6,
    bottom: 10
  },
  textInput: {
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "flex-end",
    paddingBottom: 10,
    height: 45,
    width: "100%"
  },
  hint: {
    color: colors.mainBlue,
    fontSize: 10,
    marginLeft: 2,
    bottom: 4
  }
});

export default UploadDoc;
