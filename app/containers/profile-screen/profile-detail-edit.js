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
    const { profile } = this.props;
    alert(JSON.stringify(profile));
    const ProfileDetailEdit = ({ label }) => (
      <ScreenContainer style={styles.container}>
        <View style={styles.information}>
          <View style={{ width: 300 }}>
            <Text style={styles.fieldName}>{label}</Text>
            <Text style={styles.fieldValue} weight="Medium">
              {/* {name} */}
            </Text>
          </View>
          <View style={{ width: 40, paddingTop: 18, borderRadius: 50 }}>
            <Image style={styles.editIcon} source={editIcon} />
          </View>
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    marginTop: 80
  },
  information: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#ececec",
    borderTopWidth: 1,
    // padding: 15,
    marginBottom: 0
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
    backgroundColor: colors.tomato
  }
});
export default ProfileDetailEdit;
