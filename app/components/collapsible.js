import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import { Text, Button } from "../elements";
import { colors } from "../theme";

const dropdownIcon = require("../images/ic_dropdown_arrow.png");

class Collapsible extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true
    };
  }
  render() {
    const { headerText = "", HeaderComponent, children } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              isCollapsed: !this.state.isCollapsed
            })
          }
          style={styles.headerContainer}
        >
          {headerText.length > 0 && (
            <View style={styles.headerInner}>
              <Text weight="Bold" style={styles.headerText}>
                {headerText}
              </Text>
              <Image
                style={[
                  styles.dropdownIcon,
                  this.state.isCollapsed ? {} : styles.reverseArrow
                ]}
                source={dropdownIcon}
              />
            </View>
          )}
          {HeaderComponent && <HeaderComponent />}
        </TouchableOpacity>
        <View
          style={[
            styles.bodyContainer,
            this.state.isCollapsed ? styles.collapsedBody : {}
          ]}
        >
          {children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    borderColor: "#ececec",
    borderBottomWidth: 1
  },
  headerInner: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center"
  },
  headerText: {
    fontSize: 16,
    flex: 1
  },
  dropdownIcon: {
    width: 24,
    height: 24
  },
  reverseArrow: {
    transform: [{ rotate: "180 deg" }]
  },
  bodyContainer: {
    backgroundColor: "#f7f7f7",
    overflow: "hidden"
  },
  collapsedBody: {
    height: 0
  }
});
export default Collapsible;
