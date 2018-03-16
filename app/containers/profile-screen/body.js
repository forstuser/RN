import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Alert,
  Linking
} from "react-native";
import { connect } from "react-redux";
import { API_BASE_URL, updateProfile } from "../../api";

import { SCREENS } from "../../constants";
import { Text, Button, ScreenContainer } from "../../elements";
import ProfileDetailEdit from "./profile-detail-edit";
import call from "react-native-phone-call";

import I18n from "../../i18n";
const editIcon = require("../../images/ic_edit_white.png");

class Body extends Component {
  constructor(props) {
    super(props);
    // alert(JSON.stringify(props));
    this.state = {
      name: this.props.profile.name,
      phone: this.props.profile.mobile_no,
      email: this.props.profile.email,
      isEmailVerified: this.props.profile.email_verified,
      location: this.props.profile.location,
      textInputEnable: false
    };
  }

  render() {
    return (
      <View style={{ marginTop: 80 }}>
        <ProfileDetailEdit
          label={I18n.t("profile_screen_label_name")}
          info={this.state.name}
        />
        <ProfileDetailEdit
          label={I18n.t("profile_screen_label_phone")}
          info={this.state.phone}
        />
        <ProfileDetailEdit
          label={I18n.t("profile_screen_label_email")}
          info={this.state.email}
        />
        <ProfileDetailEdit
          label={I18n.t("profile_screen_label_address")}
          info={this.state.location}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Body;
