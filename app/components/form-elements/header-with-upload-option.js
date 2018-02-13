import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import { Text } from "../../elements";
import { colors } from "../../theme";
import { openBillsPopUp } from "../../navigation";
import UploadBillOptions from "../../components/upload-bill-options";

const AttachmentIcon = () => (
  <Icon name="attachment" size={17} color={colors.pinkishOrange} />
);

class HeaderWithUploadOption extends React.Component {
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
      title,
      navigator,
      itemId,
      copies = [],
      productId,
      jobId,
      type,
      style = {},
      docType,
      hideUploadOption = false,
      textBeforeUpload = "Upload Doc",
      textBeforeUpload2 = "",
      textBeforeUpload2Color = colors.secondaryText,
      textAfterUpload = "Doc Uploaded Successfully"
    } = this.props;
    if (!copies) {
      copies = [];
    }
    const { isDocUploaded } = this.state;
    return (
      <View style={styles.header}>
        <Text weight="Medium" style={styles.headerText}>
          {title}
        </Text>
        {!hideUploadOption && (
          <View>
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
                    this.uploadBillOptions.show(jobId, type, itemId);
                  }}
                  style={styles.addText}
                >
                  + Add
                </Text>
              </View>
            )}
            {copies.length == 0 && (
              <TouchableOpacity
                onPress={this.onUploadDocPress}
                style={styles.uploadBillBtn}
              >
                {!isDocUploaded && (
                  <View style={styles.uploadBillBtnTexts}>
                    <Text
                      weight="Medium"
                      style={[
                        styles.uploadBillBtnText,
                        { color: colors.secondaryText }
                      ]}
                    >
                      {textBeforeUpload}
                    </Text>
                    <Text
                      weight="Medium"
                      style={[
                        styles.uploadBillBtnText,
                        { color: textBeforeUpload2Color }
                      ]}
                    >
                      {textBeforeUpload2}
                    </Text>
                  </View>
                )}
                {isDocUploaded && (
                  <Text
                    weight="Medium"
                    style={[
                      styles.uploadBillBtnText,
                      { color: colors.secondaryText }
                    ]}
                  >
                    {textAfterUpload}
                  </Text>
                )}
                <AttachmentIcon />
              </TouchableOpacity>
            )}
            <UploadBillOptions
              ref={ref => (this.uploadBillOptions = ref)}
              navigator={navigator}
              uploadCallback={uploadResult => {
                this.onUpload(uploadResult);
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginBottom: 20
  },
  headerText: {
    fontSize: 18,
    flex: 1
  },
  copiesContainer: {
    flexDirection: "row",
    paddingTop: 5
  },
  copiesCount: {
    fontSize: 12,
    color: colors.mainBlue,
    textDecorationLine: "underline",
    marginRight: 30
  },
  addText: {
    color: colors.pinkishOrange
  },
  uploadBillBtn: {
    flexDirection: "row",
    alignItems: "center"
  },
  uploadBillBtnTexts: {
    flexDirection: "row",
    alignItems: "center"
  },
  uploadBillBtnText: {
    fontSize: 10
  }
});

export default HeaderWithUploadOption;