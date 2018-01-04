import React, { Component } from "react";
import { StyleSheet, Image } from "react-native";
import AppLink from "react-native-app-link";
import { ScreenContainer, Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";

const image = require("../images/on_boarding_1.png");

class ForceUpdateScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  openAppStore = () => {
    AppLink.openInStore(585027354, "com.bin.binbillcustomer")
      .then(() => {
        // do stuff
      })
      .catch(err => {
        // handle error
      });
  };
  render() {
    return (
      <ScreenContainer style={styles.container}>
        <Image source={image} style={styles.image} />
        <Text weight="Bold" style={styles.title}>
          We Are Better Than Ever
        </Text>
        <Text weight="Bold" style={styles.desc}>
          To serve you even better, we have upgraded our systems and this
          version is no longer supported.
        </Text>
        <Button
          onPress={this.openAppStore}
          style={styles.btn}
          text="UPDATE NOW"
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: 300,
    height: 300
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 20
  },
  desc: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 5,
    color: colors.secondaryText
  },
  btn: {
    width: 300,
    marginTop: 25
  }
});

export default ForceUpdateScreen;
