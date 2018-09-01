import React from "react";
import { StyleSheet, View, Image, Platform, TouchableOpacity } from "react-native";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";

import BlueGradientBG from "./blue-gradient-bg";

import { Text, ScreenContainer } from "../elements";
import { colors } from "../theme";
import Icon from "react-native-vector-icons/Ionicons";

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
            <View>
              {/* <Image
                source={iconSource}
                style={styles.headerIcon}
                resizeMode="contain"
              /> */}
              <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}
              >
                <Icon
                  name="md-menu"
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, paddingRight: 20 }}>
              <Text weight="Medium" style={styles.title}>
                {title}
              </Text>
            </View>
            <View style={styles.headerRight}>{headerRight}</View>
          </View>
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
              fontFamily: `Quicksand-Bold`,
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
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-end"
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
    color: "#fff",
    textAlign: 'center'
  },

  headerLowerHalf: {
    height: 60,
    flexDirection: "row"
  },

  headerRight: {}
});
