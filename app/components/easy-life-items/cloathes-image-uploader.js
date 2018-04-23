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

class CloathesImageUploader extends React.Component {
  state = {
    isModalVisible: false,
    file: null,
    cloathesName: ""
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
          file: file,
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
        this.setState({
          file: file,
          isModalVisible: true
        });
      })
      .catch(e => {});
  };

  addImageToList = () => {
    const uploadedImageObject = {
      id: Math.floor(Math.random() * 90 + 10),
      name: this.state.cloathesName,
      url: this.state.file.path
    };
    this.props.addImageDetails(uploadedImageObject);
    this.setState({ isModalVisible: false });
  };
  render() {
    const { file, isModalVisible, cloathesName } = this.state;
    return (
      <View>
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
        <Modal
          style={styles.container}
          useNativeDriver={true}
          isVisible={isModalVisible}
          onBackButtonPress={() => this.setState({ isModalVisible: false })}
        >
          <View style={{ flex: 1, width: "100%" }}>
            {file && (
              <Image
                style={styles.uploadImage}
                source={{ uri: file.path }}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={{ width: "90%" }}>
            <CustomTextInput
              placeholder={"Add Name"}
              onChangeText={cloathesName => this.setState({ cloathesName })}
            />
          </View>
          <Button
            onPress={this.addImageToList}
            text={"ADD TO MY LIST"}
            color="secondary"
            borderRadius={0}
            style={styles.addItemBtn}
          />
        </Modal>
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
  }
});
export default CloathesImageUploader;
