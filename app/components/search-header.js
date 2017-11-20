import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";

const dashBoardIcon = require("../images/ic_nav_dashboard_off.png");
const eHomeIcon = require("../images/ic_nav_ehome_off.png");
const messagesIcon = require("../images/ic_top_messages.png");
const searchIcon = require("../images/ic_top_search.png");

const SearchHeader = ({ screen = "dashboard", messagesCount = 0 }) => (
  <View style={styles.container}>
    <View style={styles.upperContainer}>
      {screen === "dashboard" && (
        <View style={styles.nameAndIcon}>
          <Image style={styles.icon} source={dashBoardIcon} />
          <Text weight="Medium" style={styles.screenName}>
            Dashboard
          </Text>
        </View>
      )}
      {screen === "ehome" && (
        <View style={styles.nameAndIcon}>
          <Image style={styles.icon} source={eHomeIcon} />
          <Text weight="Medium" style={styles.screenName}>
            eHome
          </Text>
        </View>
      )}
      <View style={styles.messagesContainer}>
        <Image style={styles.messagesIcon} source={messagesIcon} />
        {messagesCount > 0 && (
          <View style={styles.messagesCountContainer}>
            <Text weight="Bold" style={styles.messagesCount}>
              {messagesCount}
            </Text>
          </View>
        )}
      </View>
    </View>
    <TouchableOpacity style={styles.searchContainer}>
      <Image style={styles.searchIcon} source={searchIcon} />
      <Text weight="Bold" style={styles.searchText}>
        Search..
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    elevation: 2,
    borderColor: "#eee",
    backgroundColor: "#fff"
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
