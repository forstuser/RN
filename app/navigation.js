import { Navigation } from "react-native-navigation";
import { colors, defaultNavigatorStyle } from "./theme";

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
        label: "Dashboard",
        screen: "DashboardScreen",
        icon: require("./images/ic_nav_dashboard_off.png")
      },
      {
        label: "eHome",
        screen: "DashboardScreen",
        icon: require("./images/ic_nav_ehome_off.png")
      },
      {
        label: "ASC",
        screen: "DashboardScreen",
        icon: require("./images/ic_nav_asc_off.png")
      },
      {
        label: "More",
        screen: "DashboardScreen",
        icon: require("./images/ic_nav_more_off.png")
      }
    ],
    // **for iOS Only**
    tabsStyle: {
      tabBarBackgroundColor: "#ffffff",
      tabBarButtonColor: colors.secondaryText,
      tabBarSelectedButtonColor: colors.mainBlue,
      tabBarTranslucent: false
    },
    // **for Android Only**
    appStyle: {
      tabBarBackgroundColor: "#ffffff",
      tabBarButtonColor: colors.secondaryText,
      tabBarSelectedButtonColor: colors.mainBlue,
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
