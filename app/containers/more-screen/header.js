import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  findNodeHandle
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import Icon from "react-native-vector-icons/Ionicons";
import Profile from "./profile";
import I18n from "../../i18n";
import {
  requestCameraPermission,
  requestStoragePermission
} from "../../android-permissions";
import ImagePicker from "react-native-image-crop-picker";
import { BlurView } from "react-native-blur";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { API_BASE_URL, uploadProfilePic } from "../../api";
import { colors } from "../../theme";
import { showSnackbar } from "../snackbar";
import LoadingOverlay from "../../components/loading-overlay";
const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");
const editIcon = require("../../images/ic_edit_white.png");

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blurViewRef: null,
      isProfileVisible: this.props.isProfileVisible
    };
  }

  imageLoaded = () => {
    // this.setState({ blurViewRef: findNodeHandle(this.backgroundImage) });
  };

  close = () => {
    this.props.visible(false);
  };

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

  takeCameraImage = async () => {
    if ((await requestCameraPermission()) == false) return;
    ImagePicker.openCamera({
      width: 900,
      height: 900,
      cropping: true
    })
      .then(file => {
        this.uploadImage({
          filename: "profile-pic.jpeg",
          uri: file.path,
          mimeType: file.mime
        });
      })
      .catch(e => {});
  };

  pickGalleryImage = async () => {
    if ((await requestStoragePermission()) == false) return;
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
    showSnackbar({
      text: I18n.t("profile_screen_please_wait"),
      autoDismissTimerSec: 1000
    });
    try {
      await uploadProfilePic(file, () => {});
      this.setState({
        profilePic: <Image style={styles.image} source={{ uri: file.uri }} />
      });

      showSnackbar({
        text: I18n.t("profile_screen_details_updated"),
        autoDismissTimerSec: 3
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  render() {
    const { profile, authToken, isProfileVisible } = this.props;

    let profilePic = (
      <Image
        ref={img => {
          this.backgroundImage = img;
        }}
        style={{ width: "100%", height: "100%" }}
        source={noPicPlaceholderIcon}
      />
    );

    if (profile && profile.image_name) {
      profilePic = (
        <Image
          ref={img => {
            this.backgroundImage = img;
          }}
          style={{ width: "100%", height: "100%" }}
          source={{
            uri: API_BASE_URL + profile.imageUrl,
            headers: { Authorization: authToken }
          }}
          cache="reload"
        />
      );
    }

    return (
      <View style={styles.container}>
        {profile && (
          <TouchableOpacity style={styles.header} onPress={this.props.onPress}>
            <View style={styles.backgroundImg}>{profilePic}</View>

            {Platform.OS == "ios" && (
              <BlurView
                style={styles.overlay}
                viewRef={this.state.blurViewRef}
                blurType="light"
                blurAmount={5}
              />
            )}
            {Platform.OS == "android" && <View style={styles.overlay} />}

            <View style={styles.headerInner}>
              {!isProfileVisible && (
                <View style={styles.profilePicWrapper}>
                  <View style={styles.profilePicCircleWrapper}>
                    {profilePic}
                  </View>
                </View>
              )}

              {isProfileVisible && (
                <View style={styles.profileWrapper}>
                  <View style={styles.profileCircleWrapper}>{profilePic}</View>
                  <TouchableOpacity
                    onPress={() => this.uploadOptions.show()}
                    style={styles.editImg}
                  >
                    <Image style={styles.editIcon} source={editIcon} />
                  </TouchableOpacity>
                </View>
              )}
              {isProfileVisible && (
                <ActionSheet
                  onPress={this.handleOptionPress}
                  ref={o => (this.uploadOptions = o)}
                  title={I18n.t("profile_screen_details_upload_pic")}
                  cancelButtonIndex={2}
                  options={[
                    "Take picture using camera",
                    "Upload image from gallery",
                    "Cancel"
                  ]}
                />
              )}

              {!isProfileVisible && (
                <View style={styles.centerText}>
                  <Text style={styles.name} weight="Bold">
                    {profile.name}
                  </Text>
                  <Text style={styles.mobile} weight="Medium">
                    {profile.mobile_no}
                  </Text>
                </View>
              )}
              {!isProfileVisible && (
                <Image
                  style={{ width: 12, height: 12 }}
                  source={require("../../images/ic_processing_arrow.png")}
                />
              )}
              {isProfileVisible && (
                <TouchableOpacity
                  style={styles.modalCloseIcon}
                  onPress={this.close}
                >
                  <Icon name="md-close" size={30} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    overflow: "hidden"
  },
  header: {
    width: "100%",
    height: 140
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  mainText: {
    width: 30,
    fontSize: 30
  },
  modalCloseIcon: {
    position: "absolute",
    right: 15,
    top: 10,
    width: 30
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    padding: 16,
    ...Platform.select({
      ios: {
        paddingTop: 36
      },
      android: {
        paddingTop: 16
      }
    })
  },
  profilePicWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "#d8d8d8",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  profilePicCircleWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden"
  },
  profileWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  profileCircleWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden"
  },
  centerText: {
    width: 180,
    flex: 1,
    marginLeft: 15
  },
  rightArrow: {
    alignItems: "center"
  },
  backgroundImg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  name: {
    fontSize: 18,
    color: "#ffffff"
  },
  mobile: {
    fontSize: 14,
    color: "#ffffff"
  },
  editIcon: {
    height: 16,
    width: 16
  },
  editImg: {
    position: "absolute",
    top: 80,
    right: 90,
    height: 30,
    width: 30,
    overflow: "hidden",
    backgroundColor: colors.tomato,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20
  }
});

export default Header;
