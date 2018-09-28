import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Platform
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import ScrollableTabView from "react-native-scrollable-tab-view";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";

import { connect } from "react-redux";

import {
  requestCameraPermission,
  requestStoragePermission
} from "../../android-permissions";

import { Text, Button, ScreenContainer } from "../../elements";
import { colors } from "../../theme";

import { showSnackbar } from "../../utils/snackbar";
import { uploadDocuments } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";

import { SCREENS } from "../../constants";

const fileIcon = require("../../images/ic_file.png");
const newPicIcon = require("../../images/ic_upload_new_pic.png");

import FileItem from "./file-item";
import I18n from "../../i18n";

const ehomeImage = require("../../images/ehome_circle_with_category_icons.png");

import { openAppScreen } from "../../navigation";

import { actions as uiActions } from "../../modules/ui";

import Tour from "../../components/app-tour";

class UploadDocumentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const { onOptionsPress, getImageRef = () => {} } = params;

    return {
      title: I18n.t("upload_document_screen_title"),
      headerRight: (
        <TouchableOpacity onPress={onOptionsPress} style={{ marginRight: 15 }}>
          <Image
            ref={ref => getImageRef(ref)}
            style={{ width: 24, height: 24 }}
            source={newPicIcon}
          />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploadPercentCompleted: 0,
      isUploadingOverlayVisible: false,
      isSuccessModalVisible: false,
      uploadResult: null
    };
  }

  componentDidMount() {
    const canUseCameraOnly = this.props.navigation.getParam(
      "canUseCameraOnly",
      false
    );
    const file = this.props.navigation.getParam("file", null);
    if (file) {
      this.pushFileToState(file);
    }

    this.props.navigation.setParams({
      onOptionsPress: () => {
        if (canUseCameraOnly) {
          this.handleOptionPress(0);
        } else {
          this.uploadOptions.show();
        }
      },
      getImageRef: ref => {
        this.plusIconRef = ref;
      }
    });
  }

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

  pushFileToState = file => {
    this.setState(
      {
        files: [...this.state.files, file]
      },
      () => {
        if (!this.props.hasUploadDocTourShown && this.uploadDocTour) {
          setTimeout(() => this.uploadDocTour.startTour(), 1000);
          this.props.setUiHasUploadDocTourShown(true);
        }
      }
    );
  };

  takeCameraImage = async () => {
    if ((await requestCameraPermission()) == false) return;
    ImagePicker.openCamera({
      compressImageMaxWidth: 1500,
      compressImageMaxHeight: 1500,
      compressImageQuality: 0.75,
      cropping: false
    })
      .then(file => {
        this.pushFileToState({
          filename: "camera-image-" + this.state.files.length + 1,
          uri: file.path,
          mimeType: file.mime
        });
      })
      .catch(e => {});
  };

  pickGalleryImage = async () => {
    if ((await requestStoragePermission()) == false) return;
    ImagePicker.openPicker({
      compressImageMaxWidth: 1500,
      compressImageMaxHeight: 1500,
      compressImageQuality: 0.75,
      cropping: false
    })
      .then(file => {
        this.pushFileToState({
          filename: file.filename,
          uri: file.path,
          mimeType: file.mime
        });
      })
      .catch(e => {});
  };

  pickDocument = async () => {
    if ((await requestStoragePermission()) == false) return;
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.pdf(), DocumentPickerUtil.plainText()]
      },
      (error, file) => {
        if (file) {
          this.pushFileToState({
            filename: file.fileName,
            uri: file.uri,
            mimeType: file.type || file.fileName.split(".").pop()
          });
        }
      }
    );
  };

  uploadDocuments = async () => {
    this.setState({
      isUploadingOverlayVisible: true,
      uploadPercentCompleted: 0
    });

    try {
      const res = await uploadDocuments({
        productId: this.props.navigation.getParam("productId", undefined),
        jobId: this.props.navigation.getParam("jobId", undefined),
        type: this.props.navigation.getParam("type", undefined),
        itemId: this.props.navigation.getParam("itemId", undefined),
        files: this.state.files,
        onUploadProgress: percentCompleted => {
          this.setState({
            uploadPercentCompleted: percentCompleted
          });
        }
      });

      this.setState(() => ({
        isUploadingOverlayVisible: false
      }));

      this.setState(
        {
          uploadResult: res
          // isSuccessModalVisible: true
        },
        () => {
          this.onSuccessOkClick();
        }
      );
    } catch (e) {
      this.setState({
        isUploadingOverlayVisible: false
      });
      return showSnackbar({
        text: e.message
      });
    }
  };

  onSuccessOkClick = () => {
    const { uploadCallback } = this.props.navigation.state.params;
    if (typeof uploadCallback == "function") {
      uploadCallback(this.state.uploadResult);
    }
    this.props.navigation.goBack();
  };

  removeFile = index => {
    let files = [...this.state.files];
    files.splice(index, 1);
    this.setState({
      files
    });
  };

  showUploadOptions = () => {
    const canUseCameraOnly = this.props.navigation.getParam(
      "canUseCameraOnly",
      false
    );
    if (canUseCameraOnly) {
      this.handleOptionPress(0);
    } else {
      this.uploadOptions.show();
    }
  };

  render() {
    const canUseCameraOnly = this.props.navigation.getParam(
      "canUseCameraOnly",
      false
    );
    const {
      files,
      isSuccessModalVisible,
      uploadPercentCompleted,
      isUploadingOverlayVisible
    } = this.state;
    // if (!isUploadingOverlayVisible) return null;
    // if (!isSuccessModalVisible) return null;

    return (
      <ScreenContainer style={styles.container}>
        {files.length == 0 && (
          <View collapsable={false} style={styles.noFilesView}>
            <Image style={styles.noFilesIcon} source={fileIcon} />
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              {I18n.t("upload_document_screen_no_document_msg")}
            </Text>
            <Button
              style={styles.selectDocBtn}
              onPress={() => this.showUploadOptions()}
              text={
                canUseCameraOnly
                  ? "Take Picture"
                  : I18n.t("upload_document_screen_select_document_btn")
              }
            />
          </View>
        )}
        {files.length > 0 && (
          <View collapsable={false} style={styles.filesContainer}>
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
          </View>
        )}
        {files.length > 0 && (
          <Button
            onPress={this.uploadDocuments}
            style={styles.uploadBtn}
            text={"Upload Bill"}
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
        {isUploadingOverlayVisible ? (
          <View collapsable={false}>
            <Modal transparent visible={true}>
              <View collapsable={false} style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.mainBlue} />
                <Text weight="Bold">{`${uploadPercentCompleted}% uploaded...`}</Text>
              </View>
            </Modal>
          </View>
        ) : (
          <View collapsable={false} />
        )}
        {isSuccessModalVisible ? (
          <View collapsable={false}>
            <Modal visible={true}>
              <View collapsable={false} style={styles.successModal}>
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
                <Button
                  onPress={this.onSuccessOkClick}
                  style={styles.successOkWrapper}
                  text={I18n.t("upload_document_screen_success_ok")}
                  color="secondary"
                />
              </View>
            </Modal>
          </View>
        ) : (
          <View collapsable={false} />
        )}
        <View
          collapsable={false}
          style={styles.dummyViewForFile}
          ref={ref => (this.dummyViewForFile = ref)}
        />

        <Tour
          ref={ref => (this.uploadDocTour = ref)}
          enabled={true}
          steps={[
            { ref: this.dummyViewForFile, text: I18n.t("zoom_image_tip") },
            { ref: this.plusIconRef, text: I18n.t("add_bill_btn_tip") }
          ]}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000"
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
  filesContainer: {
    position: "absolute",
    top: 16,
    left: 32,
    right: 32,
    bottom: 40,
    zIndex: 1
  },
  dummyViewForFile: {
    position: "absolute",
    top: 150,
    left: 70,
    right: 70,
    height: 0,
    zIndex: 0
  },
  uploadBtn: {
    position: "absolute",
    right: 32,
    left: 32,
    bottom: 16,
    zIndex: 2
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
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 1000
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
    width: 100
  },
  successOk: {
    fontSize: 16,
    textAlign: "center",
    color: colors.pinkishOrange
  }
});

const mapStateToProps = state => {
  return {
    hasUploadDocTourShown: state.ui.hasUploadDocTourShown
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUiHasUploadDocTourShown: newValue => {
      dispatch(uiActions.setUiHasUploadDocTourShown(newValue));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadDocumentScreen);
