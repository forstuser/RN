import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import { openBillsPopUp } from "../../navigation";
import { Text } from "../../elements";
import { colors } from "../../theme";
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

  onUpload = uploadResult => {
    if (typeof this.props.onUpload == "function") {
      this.props.onUpload(uploadResult);
    }
    this.setState({
      isDocUploaded: true
    });
  };

  render() {
    const {
      navigator,
      itemId,
      copies = [],
      productId,
      jobId,
      type,
      style = {},
      docType,
      placeholder,
      placeholder2,
      placeholderAfterUpload = "Doc Uploaded Successfully",
      placeholder2Color = colors.secondaryText
    } = this.props;
    const { isDocUploaded } = this.state;

    return (
      <View style={styles.container}>
        {copies.length > 0 && (
          <View style={styles.copiesContainer}>
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
              + Add
            </Text>
          </View>
        )}
        {copies.length == 0 && (
          <TouchableOpacity
            style={styles.noCopiesContainer}
            onPress={() => {
              console.log("jobId, type, itemId ", jobId, type, itemId);
              this.uploadBillOptions.show(jobId, type, itemId);
            }}
          >
            {!isDocUploaded && (
              <View style={styles.placeholderContainer}>
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
            )}
            {isDocUploaded && (
              <View style={styles.placeholderContainer}>
                <Text weight="Medium" style={{ color: colors.mainText }}>
                  {placeholderAfterUpload}
                </Text>
              </View>
            )}

            <View style={styles.attachmentIconContainer}>
              <AttachmentIcon />
            </View>
          </TouchableOpacity>
        )}
        <UploadBillOptions
          ref={ref => (this.uploadBillOptions = ref)}
          navigator={navigator}
          uploadCallback={this.onUpload}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    paddingTop: 20,
    height: 60,
    marginBottom: 15
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
    fontSize: 10
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
