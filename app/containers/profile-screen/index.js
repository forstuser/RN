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
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../snackbar";
import I18n from "../../i18n";
import ProfileDetailEdit from "./profile-detail-edit";
import Body from "./body";

import { actions as loggedInUserActions } from "../../modules/logged-in-user";
const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");
const editIcon = require("../../images/ic_edit_white.png");
const crossIcon = require("../../images/ic_close.png");

import Header from "./header";

class ProfileScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    // alert(JSON.stringify(props));
    this.state = {
      isNameModalVisible: false,
      isEmailModalVisible: false,
      isLocationModalVisible: false,
      name: this.props.profile.name,
      phone: this.props.profile.mobile_no,
      email: this.props.profile.email,
      isEmailVerified: this.props.profile.email_verified,
      location: this.props.profile.location,
      nameTemp: null,
      emailTemp: null,
      locationTemp: null,
      latitude: null,
      longitude: null
    };
  }

  componentDidMount() {
    // navigator.geolocation.getCurrentPosition(
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
    this.props.navigator.pop();
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
    const { profile, authToken } = this.props;
    const {
      isNameModalVisible,
      isEmailModalVisible,
      isLocationModalVisible,
      name,
      phone,
      email,
      isEmailVerified,
      location,
      nameTemp,
      emailTemp,
      locationTemp
    } = this.state;

    let showEmailVerifyText = false;
    if (email) {
      showEmailVerifyText = true;
    }
    return (
      <ScreenContainer style={styles.container}>
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

        <Body profile={profile} />
        {/* <View style={styles.information}>
        <Header profile={profile} authToken={authToken} />
        <View style={styles.information}>
          <TouchableOpacity
            style={styles.field}
            onPress={this.showNameEditModal}
          >
            <Text style={styles.fieldName}>
              {I18n.t("profile_screen_label_name")}
            </Text>
            <Text style={styles.fieldValue} weight="Medium">
              {name}
            </Text>
          </TouchableOpacity>
          <View style={styles.field}>
            <Text style={styles.fieldName}>
              {I18n.t("profile_screen_label_phone")}
            </Text>
            <Text style={styles.fieldValue} weight="Medium">
              {phone}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.field}
              onPress={this.showEmailEditModal}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={[styles.fieldName, { flex: 1 }]}>
                  {I18n.t("profile_screen_label_email")}
                </Text>
              </View>
              <Text style={styles.fieldValue} weight="Medium">
                {email}
              </Text>
            </TouchableOpacity>

            {showEmailVerifyText &&
              isEmailVerified && (
                <View style={styles.emailVerifiedContainer}>
                  <Text
                    weight="Medium"
                    style={{ fontSize: 12, color: "green" }}
                  >
                    {I18n.t("profile_screen_email_verified")}
                  </Text>
                </View>
              )}
            {showEmailVerifyText &&
              !isEmailVerified && (
                <TouchableOpacity
                  onPress={this.showResendEmailVerifyAlert}
                  style={styles.emailVerifiedContainer}
                >
                  <Text weight="Medium" style={{ fontSize: 12, color: "red" }}>
                    {I18n.t("profile_screen_email_not_verified")}
                  </Text>
                </TouchableOpacity>
              )}
          </View>
          <TouchableOpacity
            style={styles.field}
            onPress={this.showLocationEditModal}
          >
            <Text style={styles.fieldName}>
              {I18n.t("profile_screen_label_address")}
            </Text>
            <Text style={styles.fieldValue} weight="Medium">
              {location}
            </Text>
          </TouchableOpacity>
        </View> */}

        <Modal
          avoidKeyboard={true}
          onBackdropPress={this.closeModal}
          useNativeDriver={true}
          isVisible={isNameModalVisible}
        >
          <View keyboardVerticalOffset={20} style={styles.modal}>
            <TouchableOpacity
              onPress={this.closeModal}
              style={styles.modalCloseBtn}
            >
              <Image style={styles.modalCrossIcon} source={crossIcon} />
            </TouchableOpacity>
            <Text style={styles.name}>
              {I18n.t("profile_screen_label_name")}
            </Text>
            <TextInput
              underlineColorAndroid="transparent"
              onSubmitEditing={this.onSubmitName}
              ref={ref => (this.nameInput = ref)}
              value={nameTemp}
              onChangeText={text => this.setState({ nameTemp: text })}
              style={styles.modalTextInput}
            />
            <Button
              text={I18n.t("profile_screen_save_btn")}
              color="secondary"
              onPress={this.onSubmitName}
            />
          </View>
        </Modal>

        <Modal
          avoidKeyboard={true}
          onBackdropPress={this.closeModal}
          useNativeDriver={true}
          isVisible={isEmailModalVisible}
        >
          <View keyboardVerticalOffset={20} style={styles.modal}>
            <TouchableOpacity
              onPress={this.closeModal}
              style={styles.modalCloseBtn}
            >
              <Image style={styles.modalCrossIcon} source={crossIcon} />
            </TouchableOpacity>
            <Text style={styles.name}>
              {I18n.t("profile_screen_label_email")}
            </Text>
            <TextInput
              underlineColorAndroid="transparent"
              onSubmitEditing={this.onSubmitEmail}
              keyboardType="email-address"
              ref={ref => (this.emailInput = ref)}
              value={emailTemp}
              onChangeText={text => this.setState({ emailTemp: text })}
              style={styles.modalTextInput}
            />
            <Button
              text={I18n.t("profile_screen_save_btn")}
              color="secondary"
              onPress={this.onSubmitEmail}
            />
          </View>
        </Modal>

        <Modal
          avoidKeyboard={true}
          onBackdropPress={this.closeModal}
          useNativeDriver={true}
          isVisible={isLocationModalVisible}
        >
          <View keyboardVerticalOffset={20} style={styles.modal}>
            <TouchableOpacity
              onPress={this.closeModal}
              style={styles.modalCloseBtn}
            >
              <Image style={styles.modalCrossIcon} source={crossIcon} />
            </TouchableOpacity>
            <Text style={styles.name}>
              {I18n.t("profile_screen_label_address")}
            </Text>
            <TextInput
              underlineColorAndroid="transparent"
              multiline={true}
              autogrow={true}
              maxHeight={100}
              ref={ref => (this.locationInput = ref)}
              value={locationTemp}
              onChangeText={text => this.setState({ locationTemp: text })}
              style={styles.modalTextInput}
            />
            <Button
              text={I18n.t("profile_screen_save_btn")}
              color="secondary"
              onPress={this.onSubmitLocation}
            />
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.codepushToggleBtn}
          onLongPress={() => {
            Alert.alert("Beta update settings changed!");
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
    height: 24
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
