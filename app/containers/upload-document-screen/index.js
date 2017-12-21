import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert
} from "react-native";
import { Navigation } from "react-native-navigation";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import ScrollableTabView from "react-native-scrollable-tab-view";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import RNModal from "react-native-modal";

import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { colors } from "../../theme";

import { showSnackbar } from "../snackbar";
import { uploadDocuments } from "../../api";

const fileIcon = require("../../images/ic_file.png");
const newPicIcon = require("../../images/ic_upload_new_pic.png");

import FileItem from "./file-item";
import I18n from "../../i18n";

const ehomeImage = require("../../images/ehome_circle_with_category_icons.png");

import { openAppScreen } from "../../navigation";

import LoadingOverlay from "../../components/loading-overlay";

const AddPicButton = () => (
  <TouchableOpacity
    onPress={() => Navigation.handleDeepLink({ link: "new-pic-upload" })}
  >
    <Image style={{ width: 24, height: 24 }} source={newPicIcon} />
  </TouchableOpacity>
);

Navigation.registerComponent("AddPicButton", () => AddPicButton);

Navigation;
class UploadDocumentScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  static navigatorButtons = {
    rightButtons: [
      {
        component: "AddPicButton"
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploadPercentCompleted: 0,
      isUploadingOverlayVisible: false,
      isSuccessModalVisible: false
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("upload_document_screen_title")
    });
    switch (this.props.openPickerOnStart) {
      case "camera":
        this.takeCameraImage();
        break;
      case "images":
        this.pickGalleryImage();
        break;
      case "documents":
        this.pickDocument();
        break;
    }
  }

  onNavigatorEvent = event => {
    if (event.type == "DeepLink") {
      //when you press the button, it will be called here
      if (event.link == "new-pic-upload") {
        this.uploadOptions.show();
      }
    }
  };

  handleOptionPress = index => {
    switch (index) {
      case 0:
        this.takeCameraImage();
        break;
      case 1:
        this.pickGalleryImage();
        break;
      case 2:
        this.pickDocument();
        break;
    }
  };

  takeCameraImage = () => {
    ImagePicker.openCamera({
      width: 900,
      height: 1200,
      cropping: true
    })
      .then(file => {
        console.log(file);
        this.setState({
          files: [
            ...this.state.files,
            {
              filename: "camera-image-" + this.state.files.length + 1,
              uri: file.path,
              mimeType: file.mime
            }
          ]
        });
      })
      .catch(e => {});
  };

  pickGalleryImage = () => {
    ImagePicker.openPicker({
      width: 900,
      height: 1200,
      cropping: true
    })
      .then(file => {
        console.log(file);
        this.setState({
          files: [
            ...this.state.files,
            {
              filename: file.filename,
              uri: file.path,
              mimeType: file.mime
            }
          ]
        });
      })
      .catch(e => {});
  };

  pickDocument = () => {
    DocumentPicker.show(
      {
        filetype: [
          DocumentPickerUtil.images(),
          DocumentPickerUtil.pdf(),
          DocumentPickerUtil.plainText()
        ]
      },
      (error, file) => {
        console.log(file);
        this.setState({
          files: [
            ...this.state.files,
            {
              filename: file.fileName,
              uri: file.uri,
              mimeType: file.type || file.fileName.split(".").pop()
            }
          ]
        });

        console.log(this.state.files);
      }
    );
  };

  uploadDocuments = async () => {
    this.setState({
      isUploadingOverlayVisible: true,
      uploadPercentCompleted: 0
    });
    try {
      await uploadDocuments(this.state.files, percentCompleted => {
        this.setState({
          uploadPercentCompleted: percentCompleted
        });
      });

      this.setState({ isSuccessModalVisible: true });
    } catch (e) {
      return showSnackbar({
        text: e.message
      });
    }
  };

  onSuccessOkClick = () => {
    openAppScreen({ startWithPendingDocsScreen: true });
  };

  removeFile = index => {
    let newFiles = [...this.state.files];
    newFiles.splice(index, 1);
    this.setState({
      files: newFiles
    });
  };

  render() {
    const {
      files,
      isSuccessModalVisible,
      uploadPercentCompleted,
      isUploadingOverlayVisible
    } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        {files.length == 0 && (
          <View style={styles.noFilesView}>
            <Image style={styles.noFilesIcon} source={fileIcon} />
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              {I18n.t("upload_document_screen_no_document_msg")}
            </Text>
            <Button
              style={styles.selectDocBtn}
              onPress={() => this.uploadOptions.show()}
              text={I18n.t("upload_document_screen_select_document_btn")}
            />
          </View>
        )}
        {files.length > 0 && (
          <ScrollableTabView
            tabBarUnderlineStyle={{
              backgroundColor: colors.mainBlue,
              height: 1,
              marginBottom: -1
            }}
            tabBarPosition="bottom"
          >
            {files.map((file, index) => (
              <FileItem
                removeFile={() => {
                  this.removeFile(index);
                }}
                key={index}
                file={file}
                index={index}
                total={files.length}
              />
            ))}
          </ScrollableTabView>
        )}
        {files.length > 0 && (
          <Button
            onPress={this.uploadDocuments}
            style={styles.uploadBtn}
            text={I18n.t("upload_document_screen_upload_btn")}
            color="secondary"
          />
        )}
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
        <LoadingOverlay
          visible={isUploadingOverlayVisible}
          text={`${uploadPercentCompleted}% uploaded...`}
        />
        <Modal visible={isSuccessModalVisible}>
          <View style={styles.successModal}>
            <Image
              style={styles.successImage}
              source={ehomeImage}
              resizeMode="contain"
            />
            <Text weight="Bold" style={styles.successTitle}>
              {I18n.t("upload_document_screen_success_title")}
            </Text>
            <Text style={styles.successMsg}>
              {I18n.t("upload_document_screen_success_msg")}
            </Text>
            <TouchableOpacity
              onPress={this.onSuccessOkClick}
              style={styles.successOkWrapper}
            >
              <Text weight="Bold" style={styles.successOk}>
                {I18n.t("upload_document_screen_success_ok")}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    paddingVertical: 32,
    paddingHorizontal: 35
  },
  noFilesView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  noFilesIcon: {
    width: 60,
    height: 60,
    marginBottom: 5
  },
  selectDocBtn: {
    marginTop: 20,
    width: 280
  },
  uploadBtn: {
    position: "absolute",
    right: 32,
    left: 32,
    bottom: 16
  },
  uploadStatusModal: {
    width: "100%",
    maxWidth: 250,
    height: 150,
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  successModal: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  successImage: {
    height: 305
  },
  successTitle: {
    fontSize: 24,
    textAlign: "center",
    color: colors.mainBlue,
    marginTop: 35
  },
  successMsg: {
    textAlign: "center",
    color: colors.secondaryText,
    marginTop: 10
  },
  successOkWrapper: {
    marginTop: 15,
    padding: 10
  },
  successOk: {
    fontSize: 16,
    textAlign: "center",
    color: colors.pinkishOrange
  }
});

export default UploadDocumentScreen;
