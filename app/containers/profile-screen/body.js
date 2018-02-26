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
  }

  render() {
    return (
      <View>
        <ProfileDetailEdit label={I18n.t("profile_screen_label_name")} />
        <ProfileDetailEdit label={I18n.t("profile_screen_label_phone")} />
        <ProfileDetailEdit label={I18n.t("profile_screen_label_email")} />
        <ProfileDetailEdit label={I18n.t("profile_screen_label_location")} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Body;
