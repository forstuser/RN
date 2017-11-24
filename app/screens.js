import { Navigation } from "react-native-navigation";

import DashboardScreen from "./containers/dashboard-screen";
import EhomeScreen from "./containers/ehome-screen";
import AscScreen from "./containers/asc-screen";
import MoreScreen from "./containers/more-screen";
import IntroScreen from "./containers/intro-screen";
import LoginScreen from "./containers/login-screen";
import VerifyScreen from "./containers/verify-screen";
import TermsScreen from "./containers/terms-screen";
import MainCategoryScreen from "./containers/main-category-screen";
import ProductDetailsScreen from "./containers/product-details-screen";

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
  Navigation.registerComponent(
    "EhomeScreen",
    () => EhomeScreen,
    store,
    Provider
  );
  Navigation.registerComponent("AscScreen", () => AscScreen, store, Provider);
  Navigation.registerComponent("MoreScreen", () => MoreScreen, store, Provider);
  Navigation.registerComponent(
    "MainCategoryScreen",
    () => MainCategoryScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "ProductDetailsScreen",
    () => ProductDetailsScreen,
    store,
    Provider
  );
}
