import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal
} from "react-native";

import ActionSheet from "react-native-actionsheet";
import LinearGradient from "react-native-linear-gradient";
import I18n from "../i18n";

import { Text, Button } from "../elements";
import { colors } from "../theme";

class AddExpenseOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    };
  }

  show = () => {
    this.setState({
      isModalVisible: true
    });
  };

  showUploadOptions = () => {
    this.uploadOptions.show();
  };

  hide = () => {
    this.setState({
      isModalVisible: false
    });
  };

  handleOptionPress = index => {
    switch (index) {
      case 0:
        this.hide();
        this.props.navigator.push({
          screen: "UploadDocumentScreen",
          passProps: {
            openPickerOnStart: "camera"
          }
        });
        break;
      case 1:
        this.hide();
        this.props.navigator.push({
          screen: "UploadDocumentScreen",
          passProps: {
            openPickerOnStart: "images"
          }
        });
        break;
      case 2:
        this.hide();
        this.props.navigator.push({
          screen: "UploadDocumentScreen",
          passProps: {
            openPickerOnStart: "documents"
          }
        });
        break;
    }
  };

  openAddProductScreen = () => {
    this.hide();
    this.props.navigator.push({
      screen: "AddProductScreen"
    });
  };

  render() {
    const { isModalVisible } = this.state;
    return (
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.container}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1 }}
            colors={["#ff622e", "#ff822e"]}
            style={styles.option}
          >
            <Text weight="Bold" style={styles.optionTitle}>
              {I18n.t("add_expenses_options_upload_title")}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.uploadOptions.show();
              }}
              style={styles.optionBtn}
            >
              <Text weight="Bold" style={{ color: colors.pinkishOrange }}>
                {I18n.t("add_expenses_options_upload_btn")}
              </Text>
            </TouchableOpacity>
            <Text weight="Bold" style={styles.optionBottomText}>
              {I18n.t("add_expenses_options_upload_bottom_text")}
            </Text>
          </LinearGradient>
          <View style={styles.orContainer}>
            <Text style={styles.or} weight="Bold">
              OR
            </Text>
          </View>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 1 }}
            colors={["#00c6ff", "#007bce"]}
            style={styles.option}
          >
            <Text weight="Bold" style={styles.optionTitle}>
              {I18n.t("add_expenses_options_manual_title")}
            </Text>
            <TouchableOpacity
              onPress={this.openAddProductScreen}
              style={styles.optionBtn}
            >
              <Text weight="Bold" style={{ color: colors.mainBlue }}>
                {I18n.t("add_expenses_options_manual_btn")}
              </Text>
            </TouchableOpacity>
            <Text weight="Bold" style={styles.optionBottomText}>
              {I18n.t("add_expenses_options_manual_bottom_text")}
            </Text>
          </LinearGradient>
          <Button
            onPress={this.hide}
            style={styles.closeBtn}
            text={I18n.t("add_expenses_options_cancel_btn")}
            type="outline"
            color="secondary"
          />
        </View>
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
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  option: {
    flex: 1,
    width: "100%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  optionTitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    width: 230
  },
  optionBtn: {
    backgroundColor: "#fff",
    width: 170,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16
  },
  optionBottomText: {
    color: "#fff",
    marginTop: 15
  },
  orContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -27,
    marginBottom: -27,
    zIndex: 2
  },
  or: {
    fontSize: 20
  },
  closeBtn: {
    marginTop: 10,
    width: "100%"
  }
});
export default AddExpenseOptions;
