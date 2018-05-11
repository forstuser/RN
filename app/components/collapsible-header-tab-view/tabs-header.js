import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import { colors } from "../../theme";

class TabsHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      getRef,
      routes,
      style = {},
      tabStyle = {},
      isScrollable = false,
      activeTabIndex,
      onTabChange
    } = this.props;

    return (
      <ScrollView
        ref={getRef}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={[styles.container, style]}
        contentContainerStyle={styles.contentContainer}
      >
        {routes.map((route, index) => (
          <TouchableOpacity
            onPress={() => onTabChange(index)}
            key={index}
            style={[
              styles.tab,
              tabStyle,
              isScrollable ? styles.scrollableTab : styles.nonScrollableTab
            ]}
          >
            <Text
              style={[
                styles.tabText,
                index == activeTabIndex ? styles.activeTabText : {}
              ]}
            >
              {route.text}
            </Text>
            <View collapsable={false} 
              style={index == activeTabIndex ? styles.activeIndicator : {}}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff"
  },
  contentContainer: {
    width: "100%"
  },
  tab: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#fff"
  },
  nonScrollableTab: {
    flex: 1
  },
  tabText: {
    color: "#000"
  },
  activeTabText: {
    fontWeight: "500",
    color: colors.mainBlue
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.mainBlue
  }
});

export default TabsHeader;
