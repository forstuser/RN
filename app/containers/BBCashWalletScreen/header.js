import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { Text, Button } from "../../elements";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../theme";
import RedeemViaModal from "./redeem-via-modal";

class Header extends Component {
  render() {
    let button = null;
    if (this.props.totalCashback > 0)
      button = (
        <Button
          style={styles.button}
          text="Redeem BBCash"
          onPress={() => this.redeemViaModal.show()}
          color="secondary"
          textStyle={{ fontSize: 12 }}
        />
      );
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 0.0, y: 0 }}
          end={{ x: 0.0, y: 1 }}
          colors={[colors.mainBlue, colors.aquaBlue]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        />
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => this.props.navigation.goBack()}
        >
          <Icon name="md-arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text weight="Bold" style={[styles.heading, styles.heading1]}>
          BB Wallet
        </Text>
        <Text style={[styles.heading, styles.heading2]}>Available BBCash</Text>
        <Text weight="Light" style={[styles.heading, styles.heading3]}>
          {this.props.totalCashback}
        </Text>
        {button}
        <RedeemViaModal
          navigation={this.props.navigation}
          ref={node => {
            this.redeemViaModal = node;
          }}
          totalCashback={this.props.totalCashback}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    height: 250
  },
  backIcon: {
    padding: 10,
    position: "absolute",
    top: 10,
    left: 15,
    zIndex: 2
  },
  heading: {
    color: "#fff",
    textAlign: "center"
  },
  heading1: {
    fontSize: 18,
    marginTop: 20
  },
  heading2: {
    fontSize: 16,
    marginTop: 25
  },
  heading3: {
    fontSize: 56
  },
  button: {
    width: 140,
    height: 35,
    alignSelf: "center",
    marginTop: 15
  }
};

export default Header;
