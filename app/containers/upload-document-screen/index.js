import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Navigation } from "react-native-navigation";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import ScrollableTabView from "react-native-scrollable-tab-view";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import Modal from "react-native-modal";

import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { colors } from "../../theme";

import { showSnackbar } from "../snackbar";
import { uploadDocuments } from "../../api";

const fileIcon = require("../../images/ic_file.png");
const newPicIcon = require("../../images/ic_upload_new_pic.png");

import FileItem from "./file-item";

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
      isUploadStatusModalVisible: false
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Upload Docs"
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
    return showSnackbar({
      text:
        "This option is not yet supported because it needs Apple Developer Program"
    });
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.images()]
      },
      (error, res) => {
        console.log(res);
      }
    );
  };

  uploadDocuments = async () => {
    this.setState({
      isUploadStatusModalVisible: true,
      uploadPercentCompleted: 0
    });
    try {
      await uploadDocuments(this.state.files, percentCompleted => {
        this.setState({
          percentCompleted
        });
      });

      showSnackbar({
        text: "Docs uploded successfully",
        autoDismissTimerSec: 1000
      });

      this.props.navigator.pop({});
    } catch (e) {
      return showSnackbar({
        text: e.message
      });
    }
    this.setState({
      isUploadStatusModalVisible: false
    });
  };

  removeFile = index => {
    let newFiles = [...this.state.files];
    newFiles.splice(index, 1);
    this.setState({
      files: newFiles
    });
  };

  render() {
    const { files } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        {files.length == 0 && (
          <View style={styles.noFilesView}>
            <Image style={styles.noFilesIcon} source={fileIcon} />
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              No Document to upload
            </Text>
            <Button
              style={styles.selectDocBtn}
              onPress={() => this.uploadOptions.show()}
              text="Select Document"
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
            text="UPLOAD"
            color="secondary"
          />
        )}
        <ActionSheet
          onPress={this.handleOptionPress}
          ref={o => (this.uploadOptions = o)}
          title="Upload Doc"
          cancelButtonIndex={3}
          options={[
            "Take picture using camera",
            "Upload image from gallery",
            "Upload document",
            "Cancel"
          ]}
        />
        <Modal isVisible={this.state.isUploadStatusModalVisible}>
          <View style={styles.uploadStatusModal}>
            <ActivityIndicator size="large" color={colors.mainBlue} />
            <Text weight="Bold">{this.state.uploadPercentCompleted}%</Text>
            <Text weight="Bold" style={{ textAlign: "center" }}>
              Uploading... Please Wait..
            </Text>
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
  }
});

export default UploadDocumentScreen;
