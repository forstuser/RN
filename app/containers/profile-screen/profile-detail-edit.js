import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity
} from "react-native";
import { showSnackbar } from "../snackbar";
import Modal from "react-native-modal";
import { API_BASE_URL, updateProfile } from "../../api";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { colors } from "../../theme";
import I18n from "../../i18n";
import { BlurView } from "react-native-blur";
const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");
const editIcon = require("../../images/ic_edit_white.png");
const verified = require("../../images/ic_profile_verified.png");
const unVerified = require("../../images/ic_profile_unverified.png");

class ProfileDetailEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: this.props.info
    };
  }

  componentDidMount() {}

  onSubmit = async () => {
    // this.props.updateState(info);
    Keyboard.dismiss();

    showSnackbar({
      text: I18n.t("changing_text_please_wait"),
      autoDismissTimerSec: 4
    });

    try {
      await updateProfile({
        [this.props.apiFieldName]: this.state.info
      });

      this.props.onUpdate(this.props.apiFieldName, this.state.info);
    } catch (e) {
      showSnackbar({
        text: e.message,
        autoDismissTimerSec: 4
      });
    }
  };

  showResendEmailVerifyAlert = () => {
    Alert.alert(
      I18n.t("profile_screen_details_email_verification"),
      I18n.t("profile_screen_details_sent_verification"),
      [
        {
          text: I18n.t("resend_button"),
          onPress: async () => {
            showSnackbar({
              text: I18n.t("profile_screen_details_please_wait"),
              autoDismissTimerSec: 1000
            });
            try {
              await updateProfile({
                email: this.state.info
              });
              // alert(this.state.info);
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

  render() {
    const { label, editable, verify } = this.props;
    const { info } = this.state;
    return (
      <View>
        <View style={styles.information}>
          <View style={{ width: 240 }}>
            <Text style={styles.fieldName}>{label}</Text>
            <TextInput
              style={styles.fieldValue}
              weight="Medium"
              value={info}
              editable={this.props.editable}
              underlineColorAndroid="transparent"
              keyboardType="default"
              onChangeText={text => this.setState({ info: text })}
            />
          </View>
          <View>
            {this.props.verify == false &&
              this.props.info && (
                <TouchableOpacity
                  onPress={this.showResendEmailVerifyAlert}
                  style={{ height: 40, marginTop: -25 }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View>
                      <Text style={styles.notVerified}>Not Verified</Text>
                    </View>
                    <View>
                      <Image style={styles.icons} source={unVerified} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
          </View>
          {this.props.verify == true &&
            this.props.info && (
              <TouchableOpacity style={{ height: 40, marginTop: -25 }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View>
                    <Text style={styles.verified}>Verified</Text>
                  </View>
                  <View>
                    <Image style={styles.icons} source={verified} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          {this.props.info != this.state.info && (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 23,
                position: "absolute",
                right: 10,
                top: 32
              }}
            >
              <TouchableOpacity onPress={() => this.onSubmit(info)}>
                <Text style={{ color: colors.tomato }} weight="bold">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#ececec",
    borderTopWidth: 1,
    padding: 20,
    paddingTop: 15,
    paddingBottom: 50,
    backgroundColor: "white"
  },

  field: {
    padding: 15,
    borderColor: "#ececec",
    borderBottomWidth: 1
  },

  verified: {
    color: "#4dbf1c",
    paddingTop: 18,
    fontSize: 12
  },

  notVerified: {
    color: "#f02d2d",
    paddingTop: 18,
    fontSize: 12
  },

  fieldValue: {
    color: "#3b3b3b",
    fontSize: 16,
    height: 38,
    marginTop: -5,
    marginLeft: -4
  },

  fieldName: {
    fontSize: 12,
    color: "#9c9c9c"
  },

  editIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.tomato
  },

  icons: {
    marginTop: 15
  }
});

export default ProfileDetailEdit;
