import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";
import { SCREENS } from "../constants";
import Analytics from "../analytics";
import Icon from "react-native-vector-icons/Ionicons";

import ScreenHeaderWithDrawer from "./screen-header-with-drawer";

const messagesIcon = require("../images/ic_top_messages.png");
const dykIcon = require("../images/ic_do_you_know.png");
const searchIcon = require("../images/ic_top_search.png");

class TabSearchHeader extends Component {
  openSearchScreen = () => {
    this.props.navigation.navigate(SCREENS.SEARCH_SCREEN, {
      recentSearches: this.props.recentSearches
    });
  };
  openMailboxScreen = () => {
    Analytics.logEvent(Analytics.EVENTS.OPEN_MAILS);
    this.props.navigation.navigate(SCREENS.MAILBOX_SCREEN);
  };
  openDykScreen = () => {
    // Analytics.logEvent(Analytics.EVENTS.OPEN_MAILS);
    this.props.navigation.navigate(SCREENS.DO_YOU_KNOW_SCREEN);
  };
  render() {
    const {
      title,
      icon,
      notificationCount = 0,
      showSearchInput = true,
      showMailbox = true,
      dyk = true,
      showRightSideSearchIcon = false,
      onRightSideSearchIconPress,
      navigation,
      dykRef,
      mailboxRef
    } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.mainBlue} />
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
        <ScreenHeaderWithDrawer
          navigation={navigation}
          title={title}
          headerRight={
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={this.openDykScreen}
                style={styles.dykContainer}
              >
                <Image
                  ref={dykRef}
                  style={styles.messagesIcon}
                  source={dykIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.openMailboxScreen}
                style={styles.messagesContainer}
              >
                <Image
                  ref={mailboxRef}
                  style={styles.messagesIcon}
                  source={messagesIcon}
                />
                {notificationCount > 0 ? (
                  <View style={styles.messagesCountContainer}>
                    <Text weight="Bold" style={styles.messagesCount}>
                      {notificationCount}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
              </TouchableOpacity>

              {showRightSideSearchIcon ? (
                <TouchableOpacity
                  onPress={onRightSideSearchIconPress}
                  style={styles.messagesContainer}
                >
                  <Image style={styles.messagesIcon} source={searchIcon} />
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          }
        />

        {showSearchInput ? (
          <TouchableOpacity
            onPress={this.openSearchScreen}
            style={styles.searchContainer}
          >
            <Image style={styles.searchIcon} source={searchIcon} />
            <Text weight="Bold" style={styles.searchText}>
              {I18n.t("tab_screen_header_search_placeholder")}
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 300,
    paddingBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    ...Platform.select({
      ios: {
        paddingTop: 20
      }
    })
  },
  headerRight: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  messagesContainer: {
    marginLeft: 15
  },
  dykContainer: {},
  messagesIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff"
  },
  messagesCountContainer: {
    position: "absolute",
    borderRadius: 8,
    height: 18,
    paddingLeft: 3,
    paddingRight: 3,
    borderColor: "#eee",
    borderWidth: 1,
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  messagesCount: {
    color: colors.tomato,
    fontSize: 12,
    textAlign: "center",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      android: {
        marginTop: -2
      }
    })
  },
  searchContainer: {
    height: 42,
    backgroundColor: "#eff1f6",
    borderRadius: 21,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingLeft: 15
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 10
  },
  searchText: {
    fontSize: 16,
    color: colors.secondaryText
  }
});
export default TabSearchHeader;
