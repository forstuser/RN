import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Platform,
  Animated
} from "react-native";
import { connect } from "react-redux";
import AppLink from "react-native-app-link";
import Icon from "react-native-vector-icons/Ionicons";
import { ScreenContainer, Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";

import { actions as uiActions } from "../modules/ui";

const image = require("../images/rate_us_star.png");

class RateUsScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor() {
    super();
    this.springValue = new Animated.Value(0.3);
  }

  componentDidMount() {
    this.springValue.setValue(0.3);
    Animated.spring(this.springValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true
    }).start();
  }

  openAppStore = async () => {
    try {
      await AppLink.openInStore("id1328873045", "com.bin.binbillcustomer");
      this.props.setRateUsDialogTimestamp(new Date(2100, 0).toISOString());
      this.props.navigator.dismissModal({
        animationType: "none"
      });
    } catch (e) {
      console.log(e);
    }
  };

  closeDialog = () => {
    this.props.setRateUsDialogTimestamp(new Date().toISOString());
    this.props.navigator.dismissModal({
      animationType: "none"
    });
  };

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <Animated.View
          style={[styles.popup, { transform: [{ scale: this.springValue }] }]}
        >
          <TouchableOpacity style={styles.closeIcon} onPress={this.closeDialog}>
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
      </ScreenContainer>
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

const mapDispatchToProps = dispatch => {
  return {
    setRateUsDialogTimestamp: timestamp => {
      dispatch(uiActions.setRateUsDialogTimestamp(timestamp));
    }
  };
};

export default connect(null, mapDispatchToProps)(RateUsScreen);
