import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import AppLink from "react-native-app-link";
import { getNewAppVersionDetails } from "../api";
import { ScreenContainer, Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";

import image from "../images/binbill_logo.png";

class ForceUpdateScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    changes: []
  };

  async componentDidMount() {
    try {
      const res = await getNewAppVersionDetails();
      this.setState({ changes: res.details.updates });
    } catch (e) {
      console.log("error: ", e);
    }
  }

  openAppStore = async () => {
    await AppLink.openInStore("id1328873045", "com.bin.binbillcustomer");
  };

  render() {
    const { changes } = this.state;
    const allowSkip = this.props.navigation.getParam("allowSkip", false);
    return (
      <ScreenContainer style={styles.container}>
        <View collapsable={false} style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
        </View>
        <View collapsable={false} style={styles.textContainer}>
          <Text weight="Bold" style={styles.title}>
            {I18n.t("add_edit_force_update_upgrade")}
          </Text>
          <View collapsable={false} style={styles.subTextContainer}>
            {changes.map(change => (
              <Text key={change} style={styles.desc}>
                {change}
              </Text>
            ))}
          </View>
          <View collapsable={false} style={styles.buttonView}>
            <Button
              onPress={this.openAppStore}
              style={styles.btn}
              text={I18n.t("add_edit_force_update_now")}
            />
            {allowSkip ? (
              <TouchableOpacity
                style={styles.notNow}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text weight="Bold" style={styles.notNowText}>
                  {I18n.t("add_edit_force_not_now")}
                </Text>
              </TouchableOpacity>
            ) : (
              <View collapsable={false} />
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
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: 100
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  subTextContainer: {
    // flex: 1,
    // alignItems: "center",
    justifyContent: "flex-start",
    // alignSelf: 'center',
    marginTop: 20,
    marginBottom: 60
  },
  buttonView: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  image: {
    resizeMode: "contain",
    width: 80,
    height: 80
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20
  },
  desc: {
    textAlign: "center",
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 5
  },
  btn: {
    width: 300,
    marginTop: 25
  },
  notNow: {
    marginTop: 0,
    padding: 20
  }
});

export default ForceUpdateScreen;
