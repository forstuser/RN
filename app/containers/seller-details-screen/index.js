import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { Text, Button, Image } from "../../elements";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import { colors } from "../../theme";

import Profile from "./profile";

export default class SellerDetailsScreen extends React.Component {
  static navigationOptions = {
    title: "Seller Details"
  };
  render() {
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollableTabView
          renderTabBar={() => <DefaultTabBar style={{ height: 35 }} />}
          tabBarUnderlineStyle={{
            backgroundColor: colors.mainBlue,
            height: 2
          }}
          tabBarBackgroundColor="transparent"
          tabBarTextStyle={{
            fontSize: 14,
            fontFamily: `Quicksand-Bold`,
            color: colors.mainBlue,
            marginTop: 8
          }}
        >
          <View tabLabel="Profile" style={{ flex: 1 }}>
            <Profile seller={seller} />
          </View>
          <View tabLabel="Transactions" />
          <View tabLabel="Offers" />
        </ScrollableTabView>
      </View>
    );
  }
}
