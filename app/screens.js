import { Navigation } from "react-native-navigation";

import DashboardScreen from "./containers/dashboard-screen";
import IntroScreen from "./containers/intro-screen";
import LoginScreen from "./containers/login-screen";
import VerifyScreen from "./containers/verify-screen";
import TermsScreen from "./containers/terms-screen";

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
    "TermsScreen",
    () => TermsScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "DashboardScreen",
    () => DashboardScreen,
    store,
    Provider
  );
}
