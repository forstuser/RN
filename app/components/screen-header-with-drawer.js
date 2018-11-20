import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text } from "../elements";
import { colors } from "../theme";

export default class ScreenHeaderWithDrawer extends React.Component {
  render() {
    const { title, titleComponent, headerRight, navigation } = this.props;

    return (
      <View style={styles.headerUpperHalf}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuIcon}
        >
          <Icon name="md-menu" size={30} color="#fff" />
        </TouchableOpacity>
        {title != null ? (
          <Text weight="Medium" style={styles.title}>
            {title}
          </Text>
        ) : (
          <View style={styles.titleComponent}>{titleComponent}</View>
        )}
        <View style={styles.headerRight}>{headerRight}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerUpperHalf: {
    height: 45,
    paddingHorizontal: 16
  },
  menuIcon: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    paddingHorizontal: 5,
    paddingLeft: 15,
    justifyContent: "center"
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 6
  },

  headerLowerHalf: {
    height: 60,
    flexDirection: "row"
  },

  headerRight: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0
  },
  titleComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
