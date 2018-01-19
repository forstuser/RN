import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import { Text } from "../../elements";
import { colors } from "../../theme";
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
    const { jobId, type = 1 } = this.props;
    if (typeof this.props.beforeUpload == "function") {
      if (this.props.beforeUpload() == true) {
        this.uploadBillOptions.show(jobId, type);
      }
    } else {
      this.uploadBillOptions.show(jobId, type);
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
    const {
      navigator,
      jobId,
      type = 1,
      style = {},
      title,
      hideUploadOption = false,
      textBeforeUpload = "Upload Doc",
      textBeforeUpload2 = "",
      textBeforeUpload2Color = colors.secondaryText,
      textAfterUpload = "Doc Uploaded Successfully"
    } = this.props;
    const { isDocUploaded } = this.state;
    return (
      <View style={styles.header}>
        <Text weight="Medium" style={styles.headerText}>
          {title}
        </Text>
        {!hideUploadOption && (
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
            <UploadBillOptions
              ref={ref => (this.uploadBillOptions = ref)}
              navigator={navigator}
              uploadCallback={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState(this.onUpload);
              }}
            />
          </TouchableOpacity>
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
