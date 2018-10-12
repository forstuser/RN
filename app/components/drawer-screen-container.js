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

import ScreenHeaderWithDrawer from "./screen-header-with-drawer";

import { Text, ScreenContainer } from "../elements";
import { colors } from "../theme";

export default class TabsScreenContainer extends React.Component {
  render() {
    const {
      title,
      titleComponent,
      headerRight,
      children,
      navigation
    } = this.props;
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <BlueGradientBG />
          <ScreenHeaderWithDrawer
            navigation={navigation}
            title={title}
            titleComponent={titleComponent}
            headerRight={headerRight}
          />
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
    ...Platform.select({
      ios: { height: 55, paddingTop: 20 },
      android: { height: 35 }
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
