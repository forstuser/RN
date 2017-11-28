import React, { Component } from "react";
import { Platform, StyleSheet, View, Image } from "react-native";
import { connect } from "react-redux";
import { Text, Button, ScreenContainer } from "../../elements";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.header}>
        <Image
          style={styles.backgroundImg}
          source={require("../../images/dashboard_main.png")}
        />

        <View style={styles.overlay} />

        <View style={styles.headerInner}>
          <Image
            style={{ width: 80, height: 80, marginRight: 20 }}
            source={require("../../images/dashboard_main.png")}
          />
          <View style={styles.centerText}>
            <Text style={styles.name} weight="Bold">
              Shobhit Karnatak
            </Text>
            <Text style={styles.mobile} weight="Medium">
              8826262175
            </Text>
          </View>
          <Image
            style={{ width: 12, height: 12 }}
            source={require("../../images/ic_processing_arrow.png")}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 120,
    overflow: "hidden"
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    padding: 16
  },

  centerText: {
    width: 180,
    flex: 1
  },
  rightArrow: {
    alignItems: "center"
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
  name: {
    fontSize: 18,
    color: "#ffffff"
  },
  mobile: {
    fontSize: 14,
    color: "#ffffff"
  }
});

export default Header;
