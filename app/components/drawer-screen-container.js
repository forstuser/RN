import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Platform,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";

import BlueGradientBG from "./blue-gradient-bg";

import { Text, ScreenContainer } from "../elements";
import { colors } from "../theme";

export default class TabsScreenContainer extends React.Component {
  render() {
    const { title, headerRight, children, navigation } = this.props;
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <BlueGradientBG />
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <Text weight="Medium" style={styles.title}>
              {title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.iconWrapper}
          >
            <Icon
              name="md-menu"
              size={30}
              style={styles.headerIcon}
              color="#fff"
            />
          </TouchableOpacity>
          <View style={styles.headerRight}>{headerRight}</View>
        </View>
        {children}
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  header: {
    paddingBottom: 0,
    width: "100%",
    flexDirection: "row",
    ...Platform.select({
      ios: { height: 55, paddingTop: 22 },
      android: { height: 35, paddingTop: 2 }
    })
  },
  iconWrapper: {
    position: "absolute",
    width: 40,
    height: 32,
    top: 0,
    left: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  headerIcon: {},
  title: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center"
  },
  headerRight: {
    position: "absolute",
    right: 5,
    height: 32,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
