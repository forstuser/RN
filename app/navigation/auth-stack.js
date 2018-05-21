import React from "react";
import { Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import { SCREENS } from "../constants";

import LoginScreen from "../containers/login-screen";
import VerifyScreen from "../containers/verify-screen";

export default createStackNavigator({
  [SCREENS.LOGIN_SCREEN]: LoginScreen,
  [SCREENS.VERIFY_SCREEN]: VerifyScreen
});
