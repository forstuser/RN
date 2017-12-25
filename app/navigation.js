import { Navigation } from "react-native-navigation";
import { colors, defaultNavigatorStyle } from "./theme";
import { SCREENS } from "./constants";

export const openBillsPopUp = props => {
  Navigation.showModal({
    screen: "BillsPopUpScreen",
    passProps: props
  });
};

export const openLoginScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "LoginScreen",
      navigatorStyle: defaultNavigatorStyle,
      navigatorButtons: {}
    }
  });
};

export const openAddProductsScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "AddProductsScreen",
      navigatorStyle: defaultNavigatorStyle
    }
  });
};

export const openAddProductScreen = props => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "AddProductScreen",
      navigatorStyle: defaultNavigatorStyle
    },
    passProps: props
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

export const openAppScreen = opts => {
  let initialTabIndex = 0;
  let props = {};
  if (opts) {
    props.screenOpts = opts;
    switch (opts.startScreen) {
      case SCREENS.PRODUCT_SCREEN:
      case SCREENS.DOCS_UNDER_PROCESSING_SCREEN:
        initialTabIndex = 1;
        break;
      case SCREENS.PROFILE_SCREEN:
        initialTabIndex = 3;
        break;
    }
  }
  Navigation.startTabBasedApp({
    tabs: [
      {
        label: "Dashboard",
        screen: "DashboardScreen",
        icon: require("./images/ic_nav_dashboard_off.png")
      },
      {
        label: "eHome",
        screen: "EhomeScreen",
        icon: require("./images/ic_nav_ehome_off.png")
      },
      {
        label: "ASC",
        screen: "AscScreen",
        icon: require("./images/ic_nav_asc_off.png")
      },
      {
        label: "More",
        screen: "MoreScreen",
        icon: require("./images/ic_nav_more_off.png")
      }
    ],
    passProps: props || {},
    // **for iOS Only**
    tabsStyle: {
      initialTabIndex,
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
      forceTitlesDisplay: true,
      initialTabIndex
    }
  });
};

export default {
  openLoginScreen,
  openIntroScreen,
  openAppScreen,
  openBillsPopUp,
  openAddProductsScreen,
  openAddProductScreen
};
