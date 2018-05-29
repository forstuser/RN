import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import I18n from "../../i18n";
import { openBillsPopUp } from "../../navigation";
import { Text } from "../../elements";
import { colors, defaultStyles } from "../../theme";
import UploadBillOptions from "../../components/upload-bill-options";

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
      navigation,
      itemId,
      copies = [],
      productId,
      jobId,
      type,
      style = {},
      docType,
      placeholder,
      placeholder2,
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
      <View collapsable={false} style={styles.container}>
        {copies.length > 0 ? (
          <View collapsable={false} style={styles.copiesContainer}>
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
                console.log("jobId, type, itemId ", jobId, type, itemId);
                this.uploadBillOptions.show(jobId, type, itemId, productId);
              }}
              style={styles.addText}
            >
              {I18n.t("expense_forms_header_upload_add")}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={this.onUploadDocPress}
            style={styles.noCopiesContainer}
          >
            {!isDocUploaded ? (
              <View collapsable={false} style={styles.placeholderContainer}>
                <Text weight="Medium" style={styles.placeholder}>
                  {placeholder}
                </Text>
                <Text
                  weight="Medium"
                  style={[styles.placeholder2, { color: placeholder2Color }]}
                >
                  {placeholder2}
                </Text>
              </View>
            ) : (
              <View collapsable={false} style={styles.placeholderContainer}>
                <Text weight="Medium" style={{ color: colors.mainText }}>
                  {placeholderAfterUpload}
                </Text>
              </View>
            )}

            <View collapsable={false} style={styles.attachmentIconContainer}>
              <AttachmentIcon />
            </View>
          </TouchableOpacity>
        )}
        <UploadBillOptions
          ref={ref => (this.uploadBillOptions = ref)}
          navigation={navigation}
          uploadCallback={this.onUpload}
          actionSheetTitle={actionSheetTitle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 45,
    paddingLeft: 5,
    paddingRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    ...defaultStyles.card
  },
  copiesContainer: {
    flexDirection: "row",
    paddingVertical: 10
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
  noCopiesContainer: {
    flexDirection: "row",
    paddingVertical: 10
  },
  placeholderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  placeholder: {
    color: colors.secondaryText
  },
  placeholder2: {
    fontSize: 10,
    marginLeft: 2
  },
  attachmentIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 12
  },
  textInput: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "transparent"
  }
});

export default UploadDoc;
