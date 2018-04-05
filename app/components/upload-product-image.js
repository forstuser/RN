import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from "react-native-actionsheet";

import {
  requestCameraPermission,
  requestStoragePermission
} from "../android-permissions";
import { uploadProductImage } from "../api";

import I18n from "../i18n";
import { showSnackbar } from "../containers/snackbar";

import { Text, Button } from "../elements";
import { colors } from "../theme";
import { SCREENS } from "../constants";
import Analytics from "../analytics";
import LoadingOverlay from "../components/loading-overlay";

class UploadProductImage extends React.Component {
  state = {
    isUploadingImage: false,
    uploadingProgressText: "0%"
  };

  showOptions = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_PRODUCT_IMAGE);
    this.uploadOptions.show();
  };

  handleOptionPress = index => {
    let openPickerOnStart = null;
    switch (index) {
      case 0:
        this.takeCameraImage();
        break;
      case 1:
        this.pickGalleryImage();
        break;
    }
  };

  takeCameraImage = async () => {
    if ((await requestCameraPermission()) == false) return;
    ImagePicker.openCamera({
      width: 800,
      height: 500,
      cropping: true,
      compressImageQuality: 0.75
    })
      .then(file => {
        this.uploadFile({
          filename: "camera-image.jpeg",
          uri: file.path,
          mimeType: file.mime
        });
      })
      .catch(e => {});
  };

  pickGalleryImage = async () => {
    if ((await requestStoragePermission()) == false) return;
    ImagePicker.openPicker({
      width: 800,
      height: 500,
      cropping: true,
      compressImageQuality: 0.75
    })
      .then(file => {
        this.uploadFile({
          filename: file.filename,
          uri: file.path,
          mimeType: file.mime
        });
      })
      .catch(e => {});
  };

  uploadFile = async file => {
    const { productId, onImageUpload } = this.props;
    this.setState({
      isUploadingImage: true
    });
    try {
      await uploadProductImage(productId, file, percentCompleted => {
        this.setState({
          uploadingProgressText: percentCompleted + "%"
        });
      });
      this.setState(
        {
          isUploadingImage: false
        },
        () => {
          setTimeout(() => {
            if (typeof onImageUpload == "function") {
              onImageUpload();
            }
          }, 200);
        }
      );
    } catch (e) {
      this.setState(
        {
          isUploadingImage: false
        },
        () => {
          setTimeout(() => {
            showSnackbar({
              text: e.message
            });
          }, 200);
        }
      );
    }
    this.setState({
      isUploadingImage: false
    });
  };

  render() {
    const { isUploadingImage } = this.state;
    return (
      <View>
        <Modal visible={isUploadingImage} transparent={true}>
          <LoadingOverlay visible={true} text={I18n.t("uploading")} />
        </Modal>
        <ActionSheet
          onPress={this.handleOptionPress}
          ref={o => (this.uploadOptions = o)}
          title={I18n.t("upload_product_image")}
          cancelButtonIndex={2}
          options={[
            I18n.t("upload_document_screen_upload_options_camera"),
            I18n.t("upload_document_screen_upload_options_gallery"),
            I18n.t("upload_document_screen_upload_options_cancel")
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
});
export default UploadProductImage;
