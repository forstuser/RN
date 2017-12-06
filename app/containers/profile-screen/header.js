import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";

import { API_BASE_URL, uploadProfilePic } from "../../api";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../snackbar";

const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");
const editIcon = require("../../images/ic_edit_white.png");

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePic: null
    };
  }

  componentDidMount() {
    const profile = this.props.profile;
    let profilePic = (
      <Image
        style={{ width: "100%", height: "100%" }}
        source={noPicPlaceholderIcon}
      />
    );
    if (profile.image_name) {
      profilePic = (
        <AsyncImage
          style={{ width: "100%", height: "100%" }}
          uri={API_BASE_URL + profile.imageUrl}
        />
      );
    }
    this.setState({
      profilePic
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
    }
  };

  takeCameraImage = () => {
    ImagePicker.openCamera({
      width: 900,
      height: 900,
      cropping: true
    })
      .then(file => {
        this.uploadImage({
          filename: "profile-pic",
          uri: file.path,
          mimeType: file.mime
        });
      })
      .catch(e => {});
  };

  pickGalleryImage = () => {
    ImagePicker.openPicker({
      width: 900,
      height: 900,
      cropping: true
    })
      .then(file => {
        this.uploadImage({
          filename: file.filename,
          uri: file.path,
          mimeType: file.mime
        });
      })
      .catch(e => {});
  };

  uploadImage = async file => {
    return showSnackbar({
      text: "uploading, please wait..",
      autoDismissTimerSec: 1000
    });
    try {
      await uploadProfilePic(file, () => {});
      this.setState({
        profilePic: (
          <Image style={{ width: "100%", height: "100%" }} source={file.uri} />
        )
      });

      showSnackbar({
        text: "Profile pic changed!!",
        autoDismissTimerSec: 3
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  render() {
    const profilePic = this.state.profilePic;
    return (
      <View style={styles.header}>
        <View style={styles.backgroundImg}>{profilePic}</View>
        <View style={styles.overlay} />

        <View style={styles.profilePicWrapper}>
          {profilePic}
          <TouchableOpacity
            onPress={() => this.uploadOptions.show()}
            style={styles.editImg}
          >
            <Image style={styles.editIcon} source={editIcon} />
          </TouchableOpacity>
        </View>
        <ActionSheet
          onPress={this.handleOptionPress}
          ref={o => (this.uploadOptions = o)}
          title="Upload Profile Pic"
          cancelButtonIndex={2}
          options={[
            "Take picture using camera",
            "Upload image from gallery",
            "Cancel"
          ]}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    height: 150,
    alignItems: "center"
  },
  backgroundImg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: 0
  },
  profilePicWrapper: {
    marginTop: 80,
    width: 120,
    height: 120,
    backgroundColor: "#d8d8d8",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  editImg: {
    position: "absolute",
    top: 80,
    right: 0,
    height: 36,
    width: 36,
    overflow: "hidden",
    backgroundColor: colors.tomato,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20
  },
  editIcon: {
    height: 16,
    width: 16
  }
});

export default ProfileScreen;
