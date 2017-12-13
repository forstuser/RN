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
import Modal from "react-native-modal";

import { API_BASE_URL, updateProfile } from "../../api";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../snackbar";
import I18n from "../../i18n";

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
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => {},
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  onSubmitName = async () => {
    this.setState({
      isNameModalVisible: false
    });
    showSnackbar({
      text: "changing name.. please wait..",
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
      text: "changing email.. please wait..",
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

  onSubmitLocation = async () => {
    this.setState({
      isLocationModalVisible: false
    });
    showSnackbar({
      text: "changing address.. please wait..",
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
    const profile = this.props.profile;
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
          <TouchableOpacity
            style={styles.field}
            onPress={this.showEmailEditModal}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.fieldName, { flex: 1 }]}>
                {I18n.t("profile_screen_label_email")}
              </Text>
              {showEmailVerifyText &&
                isEmailVerified && (
                  <Text
                    weight="Medium"
                    style={{ fontSize: 12, color: "green" }}
                  >
                    {I18n.t("profile_screen_email_verified")}
                  </Text>
                )}
              {showEmailVerifyText &&
                !isEmailVerified && (
                  <Text weight="Medium" style={{ fontSize: 12, color: "red" }}>
                    {I18n.t("profile_screen_email_not_verified")}
                  </Text>
                )}
            </View>
            <Text style={styles.fieldValue} weight="Medium">
              {email}
            </Text>
          </TouchableOpacity>
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
        </View>

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
    top: 36,
    left: 20,
    width: 40,
    height: 40,
    zIndex: 2
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
  modal: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 6
  },
  modalCloseBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  modalCrossIcon: {
    width: 16,
    height: 16
  },
  modalTextInput: {
    backgroundColor: "#fff",
    borderColor: "#ececec",
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5
  }
});

export default ProfileScreen;
