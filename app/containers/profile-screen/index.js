import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import { API_BASE_URL, updateProfile } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";
import I18n from "../../i18n";
import ProfileDetailEdit from "./profile-detail-edit";
import Body from "./body";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { actions as loggedInUserActions } from "../../modules/logged-in-user";
const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");
const editIcon = require("../../images/ic_edit_white.png");
const crossIcon = require("../../images/ic_close.png");

import Header from "./header";

class ProfileScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    // alert(JSON.stringify(props));
    this.state = {
      //   isNameModalVisible: false,
      //   isEmailModalVisible: false,
      //   isLocationModalVisible: false,
      //   name: this.props.profile.name,
      //   phone: this.props.profile.mobile_no,
      email: this.props.navigation.state.params.profile.email
      //   isEmailVerified: this.props.profile.email_verified,
      //   location: this.props.profile.location,
      //   nameTemp: null,
      //   emailTemp: null,
      //   locationTemp: null,
      //   latitude: null,
      //   longitude: null
    };
  }

  componentDidMount() {
    // navigation.geolocation.getCurrentPosition(
    //   position => {
    //     this.setState({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude
    //     });
    //   },
    //   error => {},
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    // );
  }

  onSubmitName = async () => {
    this.setState({
      isNameModalVisible: false
    });
    showSnackbar({
      text: I18n.t("profile_screen_details_changing_name"),
      autoDismissTimerSec: 1000
    });
    try {
      await updateProfile({
        name: this.state.nameTemp
      });
      this.setState({
        name: this.state.nameTemp
      });
      showSnackbar({
        text: I18n.t("profile_screen_change_msg_name"),
        autoDismissTimerSec: 3
      });
    } catch (e) {
      showSnackbar({
        text: e.message,
        autoDismissTimerSec: 5
      });
    }
  };

  onSubmitEmail = async () => {
    this.setState({
      isEmailModalVisible: false
    });
    showSnackbar({
      text: I18n.t("profile_screen_details_changing_email"),
      autoDismissTimerSec: 1000
    });
    try {
      await updateProfile({
        email: this.state.emailTemp
      });

      if (this.state.email != this.state.emailTemp) {
        this.setState({
          isEmailVerified: false
        });
      }
      this.setState({
        email: this.state.emailTemp
      });
      showSnackbar({
        text: I18n.t("profile_screen_change_msg_email"),
        autoDismissTimerSec: 3
      });
    } catch (e) {
      showSnackbar({
        text: e.message,
        autoDismissTimerSec: 5
      });
    }
  };

  showResendEmailVerifyAlert = () => {
    Alert.alert(
      I18n.t("profile_screen_details_email_verification"),
      I18n.t("profile_screen_details_sent_verification"),
      [
        {
          text: "Resend",
          onPress: async () => {
            showSnackbar({
              text: I18n.t("profile_screen_details_please_wait"),
              autoDismissTimerSec: 1000
            });
            try {
              await updateProfile({
                email: this.state.email
              });
              showSnackbar({
                text: I18n.t("profile_screen_change_msg_resend_email"),
                autoDismissTimerSec: 3
              });
            } catch (e) {
              showSnackbar({
                text: e.message,
                autoDismissTimerSec: 5
              });
            }
          }
        },
        {
          text: I18n.t("profile_screen_details_dismiss"),
          onPress: () => {},
          style: "cancel"
        }
      ]
    );
  };

  onSubmitLocation = async () => {
    this.setState({
      isLocationModalVisible: false
    });
    showSnackbar({
      text: I18n.t("profile_screen_details_changing_address"),
      autoDismissTimerSec: 1000
    });

    try {
      await updateProfile({
        location: this.state.locationTemp,
        latitude: this.state.latitude,
        longitude: this.state.longitude
      });
      this.setState({
        location: this.state.locationTemp
      });
      showSnackbar({
        text: I18n.t("profile_screen_change_msg_address"),
        autoDismissTimerSec: 3
      });
    } catch (e) {
      showSnackbar({
        text: e.message,
        autoDismissTimerSec: 5
      });
    }
  };

  backToMoreScreen = () => {
    this.props.navigation.goBack();
  };

  showNameEditModal = () => {
    this.setState(
      {
        isNameModalVisible: true,
        nameTemp: this.state.name
      },
      () => {
        this.nameInput.focus();
      }
    );
  };

  showEmailEditModal = () => {
    this.setState(
      {
        isEmailModalVisible: true,
        emailTemp: this.state.email
      },
      () => {
        this.emailInput.focus();
      }
    );
  };

  showLocationEditModal = () => {
    this.setState(
      {
        isLocationModalVisible: true,
        locationTemp: this.state.location
      },
      () => {
        this.locationInput.focus();
      }
    );
  };

  closeModal = () => {
    this.setState({
      isNameModalVisible: false,
      isEmailModalVisible: false,
      isLocationModalVisible: false
    });
  };

  render() {
    const { profile, authToken } = this.props.navigation.state.params;
    const {
      //   isNameModalVisible,
      //   isEmailModalVisible,
      //   isLocationModalVisible,
      //   name,
      //   phone,
      email
      //   isEmailVerified,
      //   location,
      //   nameTemp,
      //   emailTemp,
      //   locationTemp
    } = this.state;

    let showEmailVerifyText = false;
    if (email) {
      showEmailVerifyText = true;
    }
    return (
      <ScreenContainer style={styles.container}>
        <KeyboardAwareScrollView>
          <TouchableOpacity
            style={styles.opacityArrow}
            onPress={this.backToMoreScreen}
          >
            <Image
              style={styles.arrow}
              source={require("../../images/ic_back_arrow_white.png")}
            />
          </TouchableOpacity>
          <Header profile={profile} />

          <Body profile={profile} navigation={this.props.navigation}/>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          style={styles.codepushToggleBtn}
          onLongPress={() => {
            this.props.setLoggedInUserCodepushDeploymentStaging(
              !this.props.codepushDeploymentStaging
            );
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: colors.secondaryText,
              textAlign: "center"
            }}
          >
            {this.props.codepushDeploymentStaging
              ? "Subscribed to Beta Updates (Long Press to change)"
              : ""}
          </Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  opacityArrow: {
    position: "absolute",
    left: 20,
    width: 40,
    height: 40,
    zIndex: 2,
    ...Platform.select({
      ios: {
        top: 36
      },
      android: {
        top: 16
      }
    })
  },
  arrow: {
    position: "absolute",
    width: 24,
    height: 24,
    shadowColor: "black",
    shadowOffset: { width: 10, height: 0 },
    shadowRadius: 5
  },
  information: {
    marginTop: 80,
    borderColor: "#ececec",
    borderTopWidth: 1
  },
  field: {
    padding: 15,
    borderColor: "#ececec",
    borderBottomWidth: 1
  },
  fieldValue: {
    color: "#3b3b3b",
    fontSize: 16
  },
  fieldName: {
    fontSize: 12,
    color: "#9c9c9c"
  },
  name: {
    fontSize: 12,
    color: "#9c9c9c"
  },
  emailVerifiedContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10
  },
  modal: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 6,
    height: 150,
    marginBottom: 13
  },
  modalCloseBtn: {
    position: "absolute",
    top: 12,
    right: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  modalCrossIcon: {
    width: 12,
    height: 12
  },
  modalTextInput: {
    backgroundColor: "#fff",
    borderColor: "#ececec",
    borderWidth: 1,
    marginVertical: 4,
    padding: 8,
    borderRadius: 5
  },
  codepushToggleBtn: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: 20
  }
});

const mapStateToProps = state => {
  return {
    authToken: state.loggedInUser.authToken,
    codepushDeploymentStaging: state.loggedInUser.codepushDeploymentStaging
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUserCodepushDeploymentStaging: newValue => {
      dispatch(
        loggedInUserActions.setLoggedInUserCodepushDeploymentStaging(newValue)
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
