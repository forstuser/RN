import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform
} from "react-native";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";
import { SCREENS } from "../constants";
import Analytics from "../analytics";

const dashBoardIcon = require("../images/ic_nav_dashboard_off.png");
const eHomeIcon = require("../images/ic_nav_ehome_off.png");
const messagesIcon = require("../images/ic_top_messages.png");
const searchIcon = require("../images/ic_top_search.png");

class SearchHeader extends Component {
  openSearchScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.SEARCH_SCREEN,
      passProps: {
        recentSearches: this.props.recentSearches
      }
    });
  };
  openMailboxScreen = () => {
    Analytics.logEvent(Analytics.EVENTS.OPEN_MAILS);
    this.props.navigator.push({
      screen: SCREENS.MAILBOX_SCREEN
    });
  };
  render() {
    const { screen = "dashboard", notificationCount = 0 } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          {screen === "dashboard" && (
            <View style={styles.nameAndIcon}>
              <Image style={styles.icon} source={dashBoardIcon} />
              <Text weight="Medium" style={styles.screenName}>
                {I18n.t("search_header_dashboard")}
              </Text>
            </View>
          )}
          {screen === "ehome" && (
            <View style={styles.nameAndIcon}>
              <Image style={styles.icon} source={eHomeIcon} />
              <Text weight="Medium" style={styles.screenName}>
                {I18n.t("search_header_ehome")}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={this.openMailboxScreen}
            style={styles.messagesContainer}
            ref={this.props.mailboxIconRef}
          >
            <Image style={styles.messagesIcon} source={messagesIcon} />
            {notificationCount > 0 && (
              <View style={styles.messagesCountContainer}>
                <Text weight="Bold" style={styles.messagesCount}>
                  {notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={this.openSearchScreen}
          style={styles.searchContainer}
        >
          <Image style={styles.searchIcon} source={searchIcon} />
          <Text weight="Bold" style={styles.searchText}>
            {I18n.t("search_header_search_placeholder")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    elevation: 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    ...Platform.select({
      ios: {
        zIndex: 2,
        paddingTop: 32
      },
      android: {
        paddingTop: 10
      }
    })
  },
  upperContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  nameAndIcon: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 5
  },
  screenName: {
    fontSize: 18,
    color: colors.secondaryText
  },
  messagesContainer: {},
  messagesIcon: {
    width: 24,
    height: 24
  },
  messagesCountContainer: {
    position: "absolute",
    borderRadius: 8,
    height: 18,
    paddingLeft: 3,
    paddingRight: 3,
    borderColor: "#eee",
    borderWidth: 1,
    top: -2,
    right: -5,
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
    justifyContent: "center"
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
export default SearchHeader;
