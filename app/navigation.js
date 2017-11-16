import { Navigation } from "react-native-navigation";
import { defaultNavigatorStyle } from "./theme";

export const openLoginScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "LoginScreen",
      navigatorStyle: defaultNavigatorStyle,
      navigatorButtons: {}
    }
  });
};

export const openIntroScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "IntroScreen",
      navigatorStyle: { navBarHidden: true },
      navigatorButtons: {}
    }
  });
};

export const openAppScreen = () => {
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
};

export default {
  openLoginScreen,
  openIntroScreen,
  openAppScreen
};
