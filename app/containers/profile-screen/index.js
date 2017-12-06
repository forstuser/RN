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

import { API_BASE_URL, getProfileUpdate } from "../../api";
import { Text, Button, ScreenContainer, AsyncImage } from "../../elements";
import { colors } from "../../theme";

const noPicPlaceholderIcon = require("../../images/ic_more_no_profile_pic.png");
const editIcon = require("../../images/ic_edit_white.png");

import Header from "./header";

class ProfileScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      isNameVisible: false,
      isEmailVisible: false,
      isLocationVisible: false,
      name: this.props.profile.name,
      phone: this.props.profile.mobile_no,
      email: this.props.profile.email,
      location: this.props.profile.location,
      nameTemp: null,
      emailTemp: null,
      locationTemp: null
    };
  }

  onSubmitname = async () => {
    try {
      await getProfileUpdate({
        name: this.state.nameTemp
      });
      this.setState({
        isNameVisible: false,
        name: this.state.nameTemp
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onSubmitemail = async () => {
    try {
      await getProfileUpdate({
        email: this.state.emailTemp
      });
      this.setState({
        isEmailVisible: false,
        email: this.state.emailTemp
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onSubmitlocation = async () => {
    try {
      await getProfileUpdate({
        location: this.state.locationTemp
      });
      this.setState({
        isLocationVisible: false,
        location: this.state.locationTemp
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  backToMoreScreen = () => {
    this.props.navigator.pop();
  };

  showModal = () => {
    this.setState({
      isNameVisible: true,
      nameTemp: this.state.name
    });
  };

  showMail = () => {
    this.setState({
      isEmailVisible: true,
      emailTemp: this.state.email
    });
  };

  showLocation = () => {
    this.setState({
      isLocationVisible: true,
      locationTemp: this.state.location
    });
  };

  closeModal = () => {
    this.setState({
      isNameVisible: false,
      isEmailVisible: false,
      isLocationVisible: false
    });
  };

  render() {
    const profile = this.props.profile;
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
          <TouchableOpacity style={styles.field} onPress={this.showModal}>
            <Text style={styles.fieldName}>Name</Text>
            <Text style={styles.fieldValue} weight="Medium">
              {this.state.name}
            </Text>
          </TouchableOpacity>
          <View style={styles.field}>
            <Text style={styles.fieldName}>Phone Number</Text>
            <Text style={styles.fieldValue} weight="Medium">
              {this.state.phone}
            </Text>
          </View>
          <TouchableOpacity style={styles.field} onPress={this.showMail}>
            <Text style={styles.fieldName}>Email</Text>
            <Text style={styles.fieldValue} weight="Medium">
              {this.state.email}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.field} onPress={this.showLocation}>
            <Text style={styles.fieldName}>Address</Text>
            <Text style={styles.fieldValue} weight="Medium">
              {this.state.location}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal isVisible={this.state.isNameVisible}>
          <View>
            <View
              style={{ height: 200, backgroundColor: "white", padding: 20 }}
            >
              <TouchableOpacity
                onPress={this.closeModal}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end"
                }}
              >
                <Image
                  style={{
                    height: 12,
                    width: 12
                  }}
                  source={require("../../images/ic_close.png")}
                />
              </TouchableOpacity>
              <Text style={styles.name}>Your Name</Text>
              <TextInput
                value={this.state.nameTemp}
                onChangeText={text => this.setState({ nameTemp: text })}
                style={{ fontSize: 16, color: "#3b3b3b", marginBottom: 30 }}
              />
              <Button
                text="SAVE & UPDATE"
                color="secondary"
                onPress={this.onSubmitname}
              />
            </View>
          </View>
        </Modal>

        <Modal isVisible={this.state.isEmailVisible}>
          <View>
            <View
              style={{ height: 200, backgroundColor: "white", padding: 20 }}
            >
              <TouchableOpacity
                onPress={this.closeModal}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end"
                }}
              >
                <Image
                  style={{
                    height: 12,
                    width: 12
                  }}
                  source={require("../../images/ic_close.png")}
                />
              </TouchableOpacity>
              <Text style={styles.name}>Your Email</Text>
              <TextInput
                value={this.state.emailTemp}
                onChangeText={text => this.setState({ emailTemp: text })}
                style={{ fontSize: 16, color: "#3b3b3b", marginBottom: 30 }}
              />
              <Button
                text="SAVE & UPDATE"
                color="secondary"
                onPress={this.onSubmitemail}
              />
            </View>
          </View>
        </Modal>

        <Modal isVisible={this.state.isLocationVisible}>
          <View>
            <View
              style={{ height: 200, backgroundColor: "white", padding: 20 }}
            >
              <TouchableOpacity
                onPress={this.closeModal}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end"
                }}
              >
                <Image
                  style={{
                    height: 12,
                    width: 12
                  }}
                  source={require("../../images/ic_close.png")}
                />
              </TouchableOpacity>
              <Text style={styles.name}>Your Location</Text>
              <TextInput
                value={this.state.locationTemp}
                onChangeText={text => this.setState({ locationTemp: text })}
                style={{ fontSize: 16, color: "#3b3b3b", marginBottom: 30 }}
              />
              <Button
                text="SAVE & UPDATE"
                color="secondary"
                onPress={this.onSubmitlocation}
              />
            </View>
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
  }
});

export default ProfileScreen;
