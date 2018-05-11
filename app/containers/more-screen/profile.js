import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Alert,
  Linking,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import {
  API_BASE_URL,
  updateProfile,
  askOtpOnEmail,
  validateEmailOtp
} from "../../api";
import { SCREENS } from "../../constants";
import { Text, Button, ScreenContainer } from "../../elements";
import ProfileDetailEdit from "./profile-detail-edit";
import I18n from "../../i18n";
import CustomTextInput from "../../components/form-elements/text-input";
const editIcon = require("../../images/ic_edit_white.png");
import { colors } from "../../theme";
import LoadingOverlay from "../../components/loading-overlay";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { showSnackbar } from "../../containers/snackbar";

const verified = require("../../images/ic_profile_verified.png");
const unVerified = require("../../images/ic_profile_unverified.png");

class Profile extends Component {
  constructor(props) {
    super(props);
    // Alert.alert(JSON.stringify(props));
    this.state = {
      name: this.props.profile.name,
      phoneInput: this.props.profile.mobile_no,
      phone: this.props.profile.mobile_no,
      email: this.props.profile.email,
      emailInput: this.props.profile.email,
      emailOtpInput: "",
      showOtpInput: false,
      isEmailVerified: this.props.profile.email_verified,
      location: this.props.profile.location,
      textInputEnable: false,
      isPhoneModalVisible: false,
      isEmailModalVisible: false,
      isLoading: false
    };
  }

  updateState = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  hideEmailModal = () => {
    this.setState({
      isEmailModalVisible: false
    });
  };

  askForEmailOtp = async () => {
    const { email, emailInput, isEmailVerified } = this.state;
    if (!emailInput) {
      return showSnackbar({
        text: "Please enter email address",
        isOnTabsScreen: true
      });
    } else if (email == emailInput && isEmailVerified) {
      return showSnackbar({
        text: "Please enter new email address",
        isOnTabsScreen: true
      });
    }
    try {
      this.setState({
        isLoading: true
      });
      await askOtpOnEmail({ email: emailInput });
      newState = {
        isLoading: false,
        showOtpInput: true,
        emailOtpInput: ""
      };

      if (email != emailInput) {
        newState.email = emailInput;
        newState.isEmailVerified = false;
      }

      this.setState(newState);
    } catch (e) {
      showSnackbar({
        text: e.message,
        isOnTabsScreen: true
      });
      this.setState({
        isLoading: false
      });
    }
  };

  validateEmailOtp = async () => {
    const { emailOtpInput } = this.state;
    if (emailOtpInput.length != 4) {
      return showSnackbar({
        text: "Please enter 4 digit OTP sent to your email address."
      });
    }
    try {
      this.setState({
        isLoading: true
      });
      await validateEmailOtp({ otp: emailOtpInput });
      this.setState({
        isLoading: false,
        isEmailModalVisible: false,
        isEmailVerified: true
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const { profile, visible } = this.props;
    const {
      isEmailVerified,
      isEmailModalVisible,
      isPhoneModalVisible,
      email,
      emailInput,
      emailOtpInput,
      showOtpInput,
      isLoading
    } = this.state;
    // if (!isRemovePinModalVisible) return null;

    return (
      <View collapsable={false} >
        <KeyboardAwareScrollView>
          <ProfileDetailEdit
            label={I18n.t("profile_screen_label_name")}
            info={this.state.name}
            apiFieldName="name"
            editable={true}
            onUpdate={this.updateState}
          />
          {this.state.phone ? (
            <View collapsable={false}  style={[styles.field, styles.verifiedField]}>
              <View collapsable={false}  style={{ flexDirection: "row" }}>
                <Text style={styles.label}>
                  {I18n.t("profile_screen_label_phone")}
                </Text>
                <View collapsable={false} 
                  style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.verified}>Verified</Text>
                  <Image style={styles.verifyIcon} source={verified} />
                </View>
              </View>
              <Text weight="Medium" style={styles.value}>
                {this.state.phone}
              </Text>
            </View>
          ) : (
            <View collapsable={false}  />
          )}

          <TouchableWithoutFeedback
            onPress={() => {
              if (!isEmailVerified) {
                this.setState({
                  isEmailModalVisible: true,
                  showOtpInput: false
                });
              }
            }}
          >
            <View collapsable={false} 
              style={[
                styles.field,
                isEmailVerified ? styles.verifiedField : {}
              ]}
            >
              <View collapsable={false}  style={{ flexDirection: "row" }}>
                <Text style={styles.label}>
                  {I18n.t("profile_screen_label_email")}
                </Text>
                {email ? (
                  <View collapsable={false} 
                    style={{
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={
                        isEmailVerified ? styles.verified : styles.notVerified
                      }
                    >
                      {isEmailVerified ? `Verified` : `Not Verified`}
                    </Text>
                    <Image
                      style={styles.verifyIcon}
                      source={isEmailVerified ? verified : unVerified}
                    />
                  </View>
                ) : null}
              </View>
              <Text weight="Medium" style={styles.value}>
                {this.state.email}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <ProfileDetailEdit
            label={I18n.t("profile_screen_label_address")}
            info={this.state.location}
            apiFieldName="location"
            editable={true}
            onUpdate={this.updateState}
          />
          {isEmailModalVisible ? (
            <View collapsable={false} >
              <Modal
                isVisible={true}
                onBackButtonPress={this.hideEmailModal}
                avoidKeyboard={Platform.OS == "ios"}
                useNativeDriver={true}
              >
                <View collapsable={false}  style={styles.emailModal}>
                  <View collapsable={false}  style={styles.modalHeader}>
                    <Text weight="Bold" style={{ flex: 1 }}>
                      {showOtpInput ? `Enter OTP` : `Enter Email Address`}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeIcon}
                      onPress={this.hideEmailModal}
                    >
                      <Icon name="md-close" size={24} color={colors.mainText} />
                    </TouchableOpacity>
                  </View>
                  <View collapsable={false}  style={styles.modalBody}>
                    {!showOtpInput && (
                      <View collapsable={false} >
                        <CustomTextInput
                          placeholder="Enter Email Address"
                          keyboardType="email-address"
                          value={emailInput}
                          onChangeText={emailInput =>
                            this.setState({ emailInput })
                          }
                        />
                        <Button
                          onPress={this.askForEmailOtp}
                          style={{ marginTop: 10 }}
                          text="Verify Email"
                        />
                      </View>
                    )}
                    {showOtpInput && (
                      <View collapsable={false} >
                        <CustomTextInput
                          placeholder="OTP"
                          keyboardType="numeric"
                          value={emailOtpInput}
                          onChangeText={emailOtpInput =>
                            this.setState({ emailOtpInput })
                          }
                        />
                        <Button
                          onPress={this.validateEmailOtp}
                          style={{ marginTop: 10 }}
                          text="Submit"
                        />
                      </View>
                    )}
                    <LoadingOverlay visible={isLoading} />
                  </View>
                </View>
              </Modal>
            </View>
          ) : (
            <View collapsable={false}  />
          )}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  field: {
    padding: 17,
    borderColor: "#ececec",
    borderWidth: 1
  },
  verifiedField: {
    backgroundColor: "#f7f7f7",
    opacity: 0.7
  },
  value: {
    color: colors.mainText,
    fontSize: 16,
    marginTop: 3,
    marginLeft: 0
  },
  label: {
    fontSize: 12,
    color: "#9c9c9c",
    flex: 1
  },
  verified: {
    color: "#4dbf1c",
    fontSize: 12
  },
  notVerified: {
    color: "#f02d2d",
    fontSize: 12
  },
  verifyIcon: {
    marginLeft: 2
  },
  emailModal: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 0,
    alignSelf: "center"
  },
  modalHeader: {
    padding: 15,
    borderColor: "#ececec",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  modalBody: {
    padding: 20
  }
});

export default Profile;
