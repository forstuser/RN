import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Platform,
  Animated
} from "react-native";
import AppLink from "react-native-app-link";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { ScreenContainer, Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";

import { actions as uiActions } from "../../modules/ui";

const image = require("../../images/rate_us_star.png");

class RateUsScreen extends Component {
  state = {
    isModalVisible: false
  };

  constructor() {
    super();
    // this.springValue = new Animated.Value(0.3);
  }

  // componentDidMount() {
  //   this.springValue.setValue(0.3);
  //   Animated.spring(this.springValue, {
  //     toValue: 1,
  //     friction: 5,
  //     useNativeDriver: true
  //   }).start();
  // }

  show = () => {
    this.setState({
      isModalVisible: true
    });
  };

  openAppStore = async () => {
    setTimeout(async () => {
      try {
        await AppLink.openInStore("id1328873045", "com.bin.binbillcustomer");
        this.props.setRateUsDialogTimestamp(new Date(2100, 0).toISOString());
      } catch (e) {
        console.log(e);
      }
    }, 400);

    this.setState({
      isModalVisible: false
    });
  };

  hide = () => {
    this.props.setRateUsDialogTimestamp(new Date().toISOString());
    this.setState({
      isModalVisible: false
    });
  };

  render() {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        useNativeDriver={true}
        animationIn="bounceIn"
      >
        <Animated.View style={[styles.popup]}>
          <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
            <Icon name="md-close" size={30} color={colors.mainText} />
          </TouchableOpacity>
          <Image source={image} style={styles.image} />
          <Text weight="Bold" style={styles.title}>
            {I18n.t("love_using_binbill")}
          </Text>
          <Text weight="Bold" style={styles.desc}>
            {I18n.t("recommend_us", {
              storeName: Platform.OS == "ios" ? "App" : "Play"
            })}
          </Text>
          <Button
            onPress={this.openAppStore}
            style={styles.btn}
            text="RATE US"
          />
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  popup: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 310,
    height: 380,
    backgroundColor: "#fff",
    padding: 50
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 5
  },
  image: {
    width: 110,
    height: 110
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 30
  },
  desc: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
    color: colors.secondaryText
  },
  btn: {
    width: 170,
    marginTop: 20
  }
});

export default RateUsScreen;
