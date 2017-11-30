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

import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";

class ProfileScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      isNameVisible: false
    };
  }

  backToMoreScreen = () => {
    this.props.navigator.pop();
  };

  showModal = () => {
    this.setState({
      isNameVisible: true
    });
  };
  closeNameModal = () => {
    this.setState({
      isNameVisible: false
    });
  };
  render() {
    return (
      <ScreenContainer style={styles.contain}>
        <View style={styles.container}>
          <Image
            style={styles.backgroundImg}
            source={require("../images/dashboard_main.png")}
          />
          <View style={styles.overlay} />

          <View style={styles.imgCenter}>
            <TouchableOpacity
              style={styles.opacityArrow}
              onPress={this.backToMoreScreen}
            >
              <Image
                style={styles.arrow}
                source={require("../images/ic_back_arrow_white.png")}
              />
            </TouchableOpacity>
            <Image
              style={styles.images}
              source={require("../images/dashboard_main.png")}
            />
            <Image
              style={styles.editImg}
              source={require("../images/edit_pic.png")}
            />
          </View>
        </View>
        <View style={styles.information}>
          <View style={styles.field}>
            <Text style={styles.fieldName}>Name</Text>
            <Text
              style={styles.fieldValue}
              weight="Medium"
              onPress={this.showModal}
            >
              Shobhit Karnatak
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldName}>Phone Number</Text>
            <Text style={styles.fieldValue} weight="Medium">
              8826262175
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldName}>Email</Text>
            <Text style={styles.fieldValue} weight="Medium">
              abc@gmail.com
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldName}>Address</Text>
            <Text style={styles.fieldValue} weight="Medium">
              Gurgaon, Haryana
            </Text>
          </View>
        </View>
        <Modal isVisible={this.state.isNameVisible}>
          <View>
            <View
              style={{ height: 200, backgroundColor: "white", padding: 20 }}
            >
              <TouchableOpacity
                onPress={this.closeNameModal}
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
                  source={require("../images/ic_close.png")}
                />
              </TouchableOpacity>
              <Text style={styles.name}>Your Name</Text>
              <TextInput
                style={{ fontSize: 16, color: "#3b3b3b", marginBottom: 30 }}
              />
              <Button text="SAVE & UPDATE" color="secondary" />
            </View>
          </View>
        </Modal>
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  contain: {
    padding: 0
  },
  opacityArrow: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 24,
    height: 24
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
  arrow: {
    position: "absolute",
    width: 24,
    height: 24
  },
  container: {
    height: 150
  },
  backgroundImg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: 0
  },
  images: {
    width: 120,
    height: 120
  },
  imgCenter: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  editImg: {
    position: "absolute",
    top: 80,
    right: 102,
    height: 56,
    width: 56
  },
  information: {}
});

export default ProfileScreen;
