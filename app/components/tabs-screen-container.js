import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Platform,
  TouchableOpacity
} from "react-native";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/Ionicons";

import BlueGradientBG from "./blue-gradient-bg";

import { Text, ScreenContainer } from "../elements";
import { colors } from "../theme";

import ScreenHeaderWithDrawer from "./screen-header-with-drawer";

export default class TabsScreenContainer extends React.Component {
  render() {
    const {
      iconSource,
      title,
      headerRight,
      onTabChange,
      tabs,
      children,
      scrollableTabViewRef = () => {},
      navigation,
      showHamburger = true
    } = this.props;
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <BlueGradientBG />

          {showHamburger ? (
            <ScreenHeaderWithDrawer
              navigation={navigation}
              title={title}
              headerRight={headerRight}
            />
          ) : null}
        </View>

        <View style={{ marginTop: -35, flex: 1 }}>
          <ScrollableTabView
            ref={ref => {
              scrollableTabViewRef(ref);
            }}
            locked={true}
            onChangeTab={onTabChange}
            renderTabBar={() => <DefaultTabBar style={{ height: 35 }} />}
            tabBarUnderlineStyle={{
              backgroundColor: colors.mainBlue,
              height: 2
            }}
            tabBarBackgroundColor="transparent"
            tabBarTextStyle={{
              fontSize: 14,
              fontFamily: `Roboto-Bold`,
              color: "#fff",
              marginTop: 8
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
    ...Platform.select({
      ios: { height: 90, paddingTop: 20 },
      android: { height: 70, paddingTop: 0 }
    })
  },
  headerUpperHalf: {
    height: 35,
    paddingHorizontal: 16
    //flexDirection: "row",
    //alignItems: "flex-end"
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
  menuIcon: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
    paddingHorizontal: 5,
    marginLeft: 14
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 2
  },

  headerLowerHalf: {
    height: 60,
    flexDirection: "row"
  },

  headerRight: {
    position: "absolute",
    right: 20,
    top: 0
  }
});
