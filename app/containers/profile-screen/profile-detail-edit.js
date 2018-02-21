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
    this.state = {};
  }

  render() {
    return (
      <View style={styles.information}>
        <View style={{ width: 300 }}>
          <Text style={styles.fieldName}>
            {I18n.t("profile_screen_label_name")}
          </Text>
          <Text style={styles.fieldValue} weight="Medium">
            SK
          </Text>
        </View>
        <View style={{ width: 40, paddingTop: 18, borderRadius: 20 }}>
          <Image style={styles.editIcon} source={editIcon} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    marginTop: 80,
    borderColor: "#ececec",
    padding: 15,
    borderTopWidth: 1,
    flex: 1,
    flexDirection: "row"
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
  editIcon: {
    width: 18,
    height: 18,
    backgroundColor: colors.tomato,
    borderRadius: 20
  }
});
export default ProfileDetailEdit;
