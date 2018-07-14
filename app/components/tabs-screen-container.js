import React from "react";
import { StyleSheet, View, Image, Platform } from "react-native";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";

import BlueGradientBG from "./blue-gradient-bg";

import { Text, ScreenContainer } from "../elements";
import { colors } from "../theme";

export default class TabsScreenContainer extends React.Component {
  render() {
    const {
      iconSource,
      title,
      headerRight,
      onTabChange,
      tabs,
      children,
      scrollableTabViewRef = () => {}
    } = this.props;
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <BlueGradientBG />
          <View style={styles.headerUpperHalf}>
            <View style={styles.iconWrapper}>
              <Image
                source={iconSource}
                style={styles.headerIcon}
                resizeMode="contain"
              />
            </View>

            <View style={{ flex: 1, paddingRight: 20 }}>
              <Text weight="Medium" style={styles.title}>
                {title}
              </Text>
            </View>
            <View style={styles.headerRight}>{headerRight}</View>
          </View>
        </View>

        <View style={{ marginTop: -50, flex: 1 }}>
          <ScrollableTabView
            ref={ref => {
              scrollableTabViewRef(ref);
            }}
            locked={true}
            onChangeTab={onTabChange}
            renderTabBar={() => <DefaultTabBar />}
            tabBarUnderlineStyle={{
              backgroundColor: colors.mainBlue,
              height: 2
            }}
            tabBarBackgroundColor="transparent"
            tabBarTextStyle={{
              fontSize: 14,
              fontFamily: `Quicksand-Bold`,
              color: "#fff"
            }}
          >
            {tabs}
          </ScrollableTabView>
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
    height: 120,
    ...Platform.select({
      ios: { height: 120, paddingTop: 20 },
      android: { height: 100, paddingTop: 0 }
    })
  },
  headerUpperHalf: {
    height: 46,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  iconWrapper: {
    width: 24,
    height: 24,
    padding: 2,
    borderRadius: 2,
    marginRight: 5,
    backgroundColor: "#fff"
  },
  headerIcon: {
    width: "100%",
    height: "100%",
    tintColor: colors.mainBlue,
    marginRight: 5
  },
  title: {
    fontSize: 18,
    color: "#fff"
  },

  headerLowerHalf: {
    height: 60,
    flexDirection: "row"
  },

  headerRight: {}
});
