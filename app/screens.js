import { Navigation } from "react-native-navigation";

import FirstTabScreen from "./containers/App";
import SecondTabScreen from "./containers/App";
import PushedScreen from "./containers/App";
import IntroScreen from "./containers/intro-screen";
import LoginScreen from "./containers/login-screen";
import VerifyScreen from "./containers/verify-screen";

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent(
    "IntroScreen",
    () => IntroScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "LoginScreen",
    () => LoginScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "VerifyScreen",
    () => VerifyScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "example.FirstTabScreen",
    () => FirstTabScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "example.SecondTabScreen",
    () => SecondTabScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "example.PushedScreen",
    () => PushedScreen,
    store,
    Provider
  );
}
