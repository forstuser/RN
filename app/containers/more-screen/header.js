import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
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
import { Text, Button, ScreenContainer, Image } from "../../elements";
import { API_BASE_URL, uploadProfilePic } from "../../api";
import { colors } from "../../theme";
import { showSnackbar } from "../snackbar";
import LoadingOverlay from "../../components/loading-overlay";
const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");

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
      autoDismissTimerSec: 1000,
      isOnTabsScreen: true
    });
    try {
      await uploadProfilePic(file, () => {});
      this.setState({
        profilePic: <Image style={styles.image} source={{ uri: file.uri }} />
      });

      showSnackbar({
        text: I18n.t("profile_screen_details_updated"),
        autoDismissTimerSec: 3,
        isOnTabsScreen: true
      });
    } catch (e) {
      showSnackbar({
        text: e.message,
        isOnTabsScreen: true
      });
    }
  };

  render() {
    const { profile, authToken, isProfileVisible, name, mobile } = this.props;

    if (!profile) {
      return (
        <View style={styles.header}>
          <LoadingOverlay visible={true} />
        </View>
      );
    }

    let profilePic = (
      <Image
        ref={img => {
          this.backgroundImage = img;
        }}
        style={styles.profileImg}
        source={noPicPlaceholderIcon}
      />
    );

    if (profile && profile.image_name) {
      profilePic = (
        <Image
          ref={img => {
            this.backgroundImage = img;
          }}
          style={styles.profileImg}
          source={{
            uri: API_BASE_URL + profile.imageUrl,
            headers: { Authorization: authToken }
          }}
          cache="reload"
        />
      );
    }

    return (
      <View>
        {profile ? (
          <TouchableOpacity
            disabled={isProfileVisible}
            style={[
              styles.header,
              isProfileVisible ? styles.headerWithProfile : {}
            ]}
            onPress={this.props.onPress}
          >
            <View
              style={[
                styles.headerInner,
                isProfileVisible ? styles.headerInnerProfile : {}
              ]}
            >
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

              {!isProfileVisible && (
                <View style={styles.texts}>
                  <View style={styles.centerText}>
                    <Text style={styles.name} weight="Bold">
                      {name}
                    </Text>
                    <Text style={styles.mobile} weight="Medium">
                      {profile.mobile_no}
                    </Text>
                  </View>

                  <Image
                    style={{ width: 12, height: 12 }}
                    source={require("../../images/ic_processing_arrow.png")}
                  />
                </View>
              )}
            </View>
            <View
              style={[
                styles.profilePicWrapper,
                isProfileVisible ? styles.profilePicCenter : {}
              ]}
            >
              <View style={styles.profilePicCircleWrapper}>{profilePic}</View>
              {isProfileVisible && (
                <TouchableOpacity style={styles.profilePicEditBtn}>
                  <Icon name="md-create" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            {isProfileVisible && (
              <TouchableOpacity
                style={styles.profileCrossBtn}
                onPress={this.close}
              >
                <Icon name="md-close" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 180
  },
  headerWithProfile: {
    alignItems: "center"
  },
  headerInner: {
    height: 140,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        paddingTop: 20
      }
    })
  },
  headerInnerProfile: {
    justifyContent: "center"
  },
  backgroundImg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  profileImg: {
    width: "100%",
    height: "100%"
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  texts: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingRight: 20,
    marginLeft: 100
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
  profilePicWrapper: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -110
  },
  profilePicCenter: {
    marginTop: -60
  },
  profilePicCircleWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#eee"
  },
  profilePicEditBtn: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    backgroundColor: colors.pinkishOrange,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center"
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
  name: {
    fontSize: 18,
    color: "#ffffff"
  },
  mobile: {
    fontSize: 14,
    color: "#ffffff"
  },
  profileCrossBtn: {
    position: "absolute",
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    top: 20,
    right: 5
  }
});

export default Header;
