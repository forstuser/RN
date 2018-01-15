import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import DatePicker from "react-native-datepicker";
import moment from "moment";

import { Text } from "../../../elements";
import { colors } from "../../../theme";
import UploadBillOptions from "../../../components/upload-bill-options";

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
      jobId,
      type,
      style = {},
      placeholder,
      placeholder2,
      placeholderAfterUpload = "Doc Uploaded Successfully",
      placeholder2Color = colors.secondaryText
    } = this.props;
    const { isDocUploaded } = this.state;
    return (
      <TouchableOpacity
        onPress={() => this.uploadBillOptions.show(jobId, type)}
        style={styles.container}
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

        <AttachmentIcon />
        <UploadBillOptions
          ref={ref => (this.uploadBillOptions = ref)}
          navigator={this.props.navigator}
          uploadCallback={this.onUpload}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 40,
    marginBottom: 32,
    flexDirection: "row"
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
