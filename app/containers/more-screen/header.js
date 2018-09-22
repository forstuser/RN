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
import { showSnackbar } from "../../utils/snackbar";
import LoadingOverlay from "../../components/loading-overlay";
const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");
import { SCREENS, LOCATIONS } from "../../constants";

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
  onWalletPress = () => {
    this.props.navigation.navigate(SCREENS.BB_CASH_WALLET_SCREEN);
  };
  render() {
    const { profile, authToken, isProfileVisible, name, mobile } = this.props;
    const location = profile ? profile.location : LOCATIONS.OTHER;

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
            style={[styles.header]}
            onPress={this.props.onPress}
          >
            <View style={styles.profilePicCircleWrapper}>{profilePic}</View>
            <View style={styles.texts}>
              <View style={styles.centerText}>
                <Text style={styles.name} weight="Medium">
                  {name}
                </Text>
                <Text style={styles.mobile}>{profile.mobile_no}</Text>
              </View>

              {location != LOCATIONS.OTHER && (
                <TouchableOpacity
                  style={{ alignItems: "center", left: 5 }}
                  onPress={() => this.onWalletPress()}
                >
                  <Image
                    style={{ width: 25, height: 25 }}
                    source={require("../../images/wallet.png")}
                  />
                  <Text weight="Medium" style={{ fontSize: 10, color: "#fff" }}>
                    {profile.wallet_value} Pts.
                  </Text>
                </TouchableOpacity>
              )}
            </View>
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
    height: 120,
    backgroundColor: colors.mainBlue,
    // borderTopWidth: 1,
    // borderTopColor: "rgba(255, 255, 255, 0.3)",
    flexDirection: "row",
    alignItems: "center"
  },
  profileImg: {
    width: "100%",
    height: "100%"
  },
  overlay: {
    backgroundColor: colors.mainBlue,
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
    paddingRight: 20
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
  profilePicCircleWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#eee",
    marginLeft: 15
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
  }
});

export default Header;
