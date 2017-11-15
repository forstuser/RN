import { Navigation } from "react-native-navigation";

import { registerScreens } from "./screens";

registerScreens(); // this is where you register all of your app's screens

// start the app
Navigation.startTabBasedApp({
  tabs: [
    {
      label: "One",
      screen: "example.FirstTabScreen", // this is a registered name for a screen
      icon: require("./images/ic_nav_dashboard.png"),
      selectedIcon: require("./images/ic_nav_dashboard.png"), // iOS only
      title: "Screen One"
    },
    {
      label: "Two",
      screen: "example.SecondTabScreen",
      icon: require("./images/ic_nav_dashboard.png"),
      selectedIcon: require("./images/ic_nav_dashboard.png"),
      title: "Screen Two"
    },
    {
      label: "One",
      screen: "example.FirstTabScreen", // this is a registered name for a screen
      icon: require("./images/ic_nav_dashboard.png"),
      selectedIcon: require("./images/ic_nav_dashboard.png"), // iOS only
      title: "Screen One"
    },
    {
      label: "Two",
      screen: "example.SecondTabScreen",
      icon: require("./images/ic_nav_dashboard.png"),
      selectedIcon: require("./images/ic_nav_dashboard.png"),
      title: "Screen Two"
    }
  ],
  appStyle: {
    tabBarBackgroundColor: "#0f2362",
    tabBarButtonColor: "#ffffff",
    tabBarSelectedButtonColor: "#63d7cc",
    tabBarTranslucent: false,
    forceTitlesDisplay: true
  }
});
