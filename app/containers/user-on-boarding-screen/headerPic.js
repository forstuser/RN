import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TextInput,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import {
  requestCameraPermission,
  requestStoragePermission
} from "../../android-permissions";
import I18n from "../../i18n";
import { API_BASE_URL, uploadProfilePic } from "../../api";
import { Text, Button, ScreenContainer, Image } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import { colors } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";
import { BlurView } from "react-native-blur";
const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");
const editIcon = require("../../images/ic_edit_white.png");

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      profilePic: null,
      blurViewRef: null
    };
  }

  componentDidMount() {
    console.log("PROFILE PIC");
    console.log("XYZ", this.props);
    const profile = this.props.profile;
    let profilePic = (
      <Image
        ref={img => {
          this.backgroundImage = img;
        }}
        style={styles.image}
        source={noPicPlaceholderIcon}
      />
    );
    if (profile.image_name) {
      console.log("PROFILE PIC1");
      profilePic = (
        <Image
          ref={img => {
            this.backgroundImage = img;
          }}
          style={styles.image}
          source={{
            uri: API_BASE_URL + profile.imageUrl,
            headers: { Authorization: this.props.authToken }
          }}
        />
      );
    }
    this.setState({
      profilePic
    });
  }

  imageLoaded = () => {
    // this.setState({ blurViewRef: findNodeHandle(this.backgroundImage) });
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
    const { onUploadImage = () => null } = this.props;

    showSnackbar({
      text: I18n.t("profile_screen_please_wait"),
      autoDismissTimerSec: 1000
    });
    try {
      this.setState({ isLoading: true });
      await uploadProfilePic(file, () => {});
      this.setState({
        profilePic: <Image style={styles.image} source={{ uri: file.uri }} />
      });

      onUploadImage();

      showSnackbar({
        text: I18n.t("profile_screen_details_updated"),
        autoDismissTimerSec: 3
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading, profilePic } = this.state;
    // console.log("XYZT:", this.props.profile);
    // const { profile } = this.props;
    // let profilePic = (
    //   <Image
    //     ref={img => {
    //       this.backgroundImage = img;
    //     }}
    //     style={styles.image}
    //     source={noPicPlaceholderIcon}
    //   />
    // );
    // if (profile.image_name) {
    //   console.log("PROFILE PIC1");
    //   profilePic = (
    //     <Image
    //       ref={img => {
    //         this.backgroundImage = img;
    //       }}
    //       style={styles.image}
    //       source={{
    //         uri: API_BASE_URL + profile.imageUrl,
    //         headers: { Authorization: this.props.authToken }
    //       }}
    //     />
    //   );
    //   console.log("URI", uri);
    //   console.log("Headers", headers);
    // }
    // this.setState({
    //   profilePic
    // });

    return (
      <View collapsable={false} style={styles.header}>
        <View collapsable={false} style={styles.backgroundImg}>
          {profilePic}
        </View>
        <View
          style={styles.overlay}
          // viewRef={this.state.blurViewRef}
          blurType="light"
          blurAmount={5}
        />

        <View collapsable={false} style={styles.profilePicWrapper}>
          <View collapsable={false} style={styles.profilePicCircleWrapper}>
            {profilePic}
          </View>
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
          title={I18n.t("profile_screen_details_upload_pic")}
          cancelButtonIndex={2}
          options={[
            "Take picture using camera",
            "Upload image from gallery",
            "Cancel"
          ]}
        />
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    height: 200,
    alignItems: "center",
    overflow: "hidden"
  },
  backgroundImg: {
    position: "absolute",
    width: "100%",
    height: 150
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    position: "absolute",
    width: "100%",
    top: 0,
    height: 150
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
  profilePicCircleWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%"
    // backgroundColor: "gray"
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
