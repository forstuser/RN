import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import ActionSheet from "react-native-actionsheet";
import I18n from "../../i18n";
import { Text, Button } from "../../elements";
import { colors } from "../../theme";
import ImagePicker from "react-native-image-crop-picker";
import LoadingOverlay from "../../components/loading-overlay";
import {
  requestCameraPermission,
  requestStoragePermission
} from "../../android-permissions";
import CustomTextInput from "../../components/form-elements/text-input";
import { addWearables, uploadWearableImage, API_BASE_URL } from "../../api";
import { showSnackbar } from "../../containers/snackbar";
import Icon from "react-native-vector-icons/Ionicons";

class ClothesImageUploader extends React.Component {
  state = {
    isModalVisible: false,
    file: null,
    clothesName: "",
    uploadingProgressText: "0%",
    isLoading: false
  };

  showActionSheet = () => {
    this.uploadOptions.show();
    this.setState({
      clothesName: "",
      file: null
    });
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
      compressImageMaxWidth: 1500,
      compressImageMaxHeight: 1500,
      compressImageQuality: 0.75,
      cropping: false
    })
      .then(file => {
        this.setState({
          file: {
            filename: "camera-image.jpeg",
            uri: file.path,
            mimeType: file.mime
          },
          isModalVisible: true
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
        console.log("uplaod file", file);
        this.setState({
          file: {
            filename: file.filename || "gallery-image.jpeg",
            uri: file.path,
            mimeType: file.mime
          },
          isModalVisible: true
        });
      })
      .catch(e => {});
  };
  addImageToList = async () => {
    this.setState({
      isLoading: true
    });
    try {
      const res1 = await addWearables({
        name: this.state.clothesName,
        date: this.props.date
      });
      console.log(res1.wearable.id);
      const res2 = await uploadWearableImage(
        res1.wearable.id,
        this.state.file,
        percentCompleted => {
          this.setState({
            uploadingProgressText: percentCompleted + "%"
          });
        }
      );

      const uploadedImageObject = {
        ...res2.wearableResult,
        imageUrl:
          API_BASE_URL +
          "/wearable/" +
          res1.wearable.id +
          "/images/" +
          res2.wearableResult.image_code
      };
      this.props.addImageDetails(uploadedImageObject); // send to parent
      this.setState({ isModalVisible: false });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  closeDialog = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { file, isModalVisible, clothesName, isLoading } = this.state;
    // if (!isModalVisible) return null;

    return (
      <View collapsable={false} >
        <ActionSheet
          onPress={this.handleOptionPress}
          ref={o => (this.uploadOptions = o)}
          cancelButtonIndex={2}
          options={[
            I18n.t("upload_document_screen_upload_options_camera"),
            I18n.t("upload_document_screen_upload_options_gallery"),
            I18n.t("upload_document_screen_upload_options_cancel")
          ]}
        />
        {isModalVisible ? (
          <View collapsable={false} >
            <Modal
              style={styles.container}
              useNativeDriver={true}
              isVisible={true}
              onBackButtonPress={() => this.setState({ isModalVisible: false })}
            >
              <View collapsable={false}  style={{ flex: 1, width: "100%" }}>
                {file ? (
                  <Image
                    style={styles.uploadImage}
                    source={{ uri: file.uri }}
                    resizeMode="contain"
                  />
                ) : (
                  <View collapsable={false}  />
                )}
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={this.closeDialog}
                >
                  <Icon name="md-close" size={30} color={colors.mainText} />
                </TouchableOpacity>
              </View>
              <View collapsable={false}  style={{ width: "90%" }}>
                <CustomTextInput
                  placeholder={"Add Name"}
                  onChangeText={clothesName => this.setState({ clothesName })}
                />
              </View>
              <Button
                onPress={this.addImageToList}
                text={"ADD TO MY LIST"}
                color="secondary"
                borderRadius={0}
                style={styles.addItemBtn}
              />
              <LoadingOverlay visible={isLoading} />
            </Modal>
          </View>
        ) : (
          <View collapsable={false}  />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    margin: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  uploadImage: {
    width: "100%",
    height: "100%"
  },
  addItemBtn: {
    width: "100%"
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 5
  }
});
export default ClothesImageUploader;
