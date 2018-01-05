import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import AppLink from "react-native-app-link";
import { ScreenContainer, Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";

const image = require("../images/splash.png");

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
          BinBill got Upgraded!
        </Text>
        <Text weight="Bold" style={styles.desc}>
          The new version brings a whole host of fantastic features and
          improvements.
        </Text>
        <Button
          onPress={this.openAppStore}
          style={styles.btn}
          text="UPDATE NOW"
        />
        {this.props.allowSkip && (
          <TouchableOpacity
            style={styles.notNow}
            onPress={() => this.props.navigator.dismissAllModals()}
          >
            <Text weight="Bold" style={styles.notNowText}>
              Not Now
            </Text>
          </TouchableOpacity>
        )}
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
    width: 80,
    height: 80
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
  },
  notNow: {
    marginTop: 10,
    padding: 20
  }
});

export default ForceUpdateScreen;
