import React from "react";
import { Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabIcon from "./tab-icon";
import DashboardScreen from "../containers/dashboard-screen";
import EhomeScreen from "../containers/ehome-screen";
import EasyLifeScreen from "../containers/easy-life-screen";
import DoYouKnowScreen from "../containers/do-you-know-screen";
import MoreScreen from "../containers/more-screen";
import ProductDetailsScreen from "../containers/product-details-screen";
import { SCREENS } from "../constants";

const DashboardStack = createStackNavigator({
  Dashboard: DashboardScreen,
  [SCREENS.PRODUCT_DETAILS_SCREEN]: ProductDetailsScreen
});

DashboardStack.navigationOptions = {
  tabBarLabel: "Dashboard",
  tabBarIcon: ({ focused }) => (
    <TabIcon focused={focused} source={require("../images/ic_dashboard.png")} />
  )
};

const EhomeStack = createStackNavigator({
  Ehome: EhomeScreen
});

EhomeStack.navigationOptions = {
  header: null,
  tabBarLabel: "eHome",
  tabBarIcon: ({ focused }) => (
    <TabIcon
      focused={focused}
      source={require("../images/ic_nav_ehome_off.png")}
    />
  )
};

const EasyLifeStack = createStackNavigator({
  More: EasyLifeScreen
});

EasyLifeStack.navigationOptions = {
  header: null,
  tabBarLabel: "Eazy Life",
  tabBarIcon: ({ focused }) => (
    <TabIcon focused={focused} source={require("../images/ic_calendar.png")} />
  )
};

const DoYouKnowStack = createStackNavigator({
  More: DoYouKnowScreen
});

DoYouKnowStack.navigationOptions = {
  header: null,
  tabBarLabel: "DYK",
  tabBarIcon: ({ focused }) => (
    <TabIcon
      focused={focused}
      source={require("../images/ic_do_you_know.png")}
    />
  )
};

const MoreStack = createStackNavigator({
  More: MoreScreen
});

MoreStack.navigationOptions = {
  header: null,
  tabBarLabel: "More",
  tabBarIcon: ({ focused }) => (
    <TabIcon
      focused={focused}
      source={require("../images/ic_nav_more_off.png")}
    />
  )
};

export default createBottomTabNavigator({
  DashboardStack,
  EhomeStack,
  EasyLifeStack,
  DoYouKnowStack,
  MoreStack
});
