import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "../../elements";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../theme";

class Header extends Component {
  render() {
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
          onPress={this.props.handleBackPress}
        >
          <Icon name="md-arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text weight="Bold" style={styles.heading}>
          Select Transaction
        </Text>
      </View>
    );
  }
}

const styles = {
  container: {
    height: 50
  },
  backIcon: {
    padding: 10,
    position: "absolute",
    top: 0,
    left: 10,
    zIndex: 2
  },
  heading: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginTop: 10
  }
};

export default Header;
