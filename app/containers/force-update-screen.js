import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import AppLink from "react-native-app-link";
import { ScreenContainer, Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";

const image = require("../images/upgrade.png");

class ForceUpdateScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  openAppStore = () => {
    AppLink.openInStore("id1328873045", "com.bin.binbillcustomer")
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
        <View collapsable={false}  style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
        </View>
        <View collapsable={false}  style={styles.textContainer}>
          <Text style={styles.title}>
            {I18n.t("add_edit_force_update_upgrade")}
          </Text>
          <View collapsable={false}  style={styles.subTextContainer}>
            <Text weight="Bold" style={styles.desc}>
              {I18n.t("add_edit_force_update_text1")}
            </Text>
            <Text weight="Bold" style={styles.desc}>
              {I18n.t("add_edit_force_update_text2")}
            </Text>
            <Text weight="Bold" style={styles.desc}>
              {I18n.t("add_edit_force_update_text3")}
            </Text>
          </View>
          <View collapsable={false}  style={styles.buttonView}>
            <Button
              onPress={this.openAppStore}
              style={styles.btn}
              text={I18n.t("add_edit_force_update_now")}
            />
            {this.props.allowSkip ? (
              <TouchableOpacity
                style={styles.notNow}
                onPress={() => this.props.navigator.dismissAllModals()}
              >
                <Text weight="Bold" style={styles.notNowText}>
                  {I18n.t("add_edit_force_not_now")}
                </Text>
              </TouchableOpacity>
            ) : (
              <View collapsable={false}  />
            )}
          </View>
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
    // marginTop: 200
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  subTextContainer: {
    // flex: 1,
    // alignItems: "center",
    justifyContent: "flex-start",
    // alignSelf: 'center',
    marginTop: 40
  },
  buttonView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20
  },
  image: {
    resizeMode: "contain",
    width: 300,
    height: 300
  },
  title: {
    textAlign: "center",
    fontSize: 16
    // marginTop: 20
  },
  desc: {
    textAlign: "auto",
    fontSize: 20,
    // marginTop: 5,
    // lineHeight: 25,
    color: colors.pinkishOrange
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
