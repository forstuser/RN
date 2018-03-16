import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  Image,
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

class ProfileDetailEdit extends Component {
  constructor(props) {
    super(props);
    alert(JSON.stringify(props));
    this.state = {
      info: this.props.info
      // label: this.props.label
    };
  }

  onSubmit = async () => {
    showSnackbar({
      text: "changing.. please wait..",
      autoDismissTimerSec: 1000
    });

    try {
      await updateProfile({
        name: this.state.info
      });

      this.setState({
        info: this.state.info
      });
    } catch (e) {
      showSnackbar({
        text: e.message,
        autoDismissTimerSec: 5
      });
    }
  };

  render() {
    const { label } = this.props;
    const { info } = this.state;
    return (
      <View>
        <View style={styles.information}>
          <View style={{ width: 290 }}>
            <Text style={styles.fieldName}>{label}</Text>
            <TextInput
              style={styles.fieldValue}
              weight="Medium"
              value={info}
              editable={true}
              underlineColorAndroid="transparent"
              keyboardType="default"
              onChangeText={text => this.setState({ info: text })}
            />
          </View>
          {this.props.info != this.state.info && (
            <View
              style={{
                width: 40,
                height: 40,
                paddingTop: 18,
                borderRadius: 23
              }}
            >
              <TouchableOpacity onPress={this.onSubmit}>
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
  }
});

export default ProfileDetailEdit;
