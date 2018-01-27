import { Navigation } from "react-native-navigation";
import store from "./store";
import { actions as uiActions } from "./modules/ui";
import { colors, defaultNavigatorStyle } from "./theme";
import { SCREENS } from "./constants";

export const openBillsPopUp = props => {
  Navigation.showModal({
    screen: SCREENS.BILLS_POPUP_SCREEN,
    passProps: props
  });
};

export const openLoginScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: SCREENS.LOGIN_SCREEN,
      navigatorStyle: defaultNavigatorStyle,
      navigatorButtons: {}
    }
  });
};

export const openForceUpdateScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: SCREENS.FORCE_UPDATE_SCREEN
    }
  });
};

export const openForceUpdateModal = () => {
  Navigation.showModal({
    screen: SCREENS.FORCE_UPDATE_SCREEN,
    passProps: {
      allowSkip: true
    },
    animationType: "none"
  });
};

export const openAddProductsScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: SCREENS.ADD_PRODUCTS_SCREEN,
      navigatorStyle: defaultNavigatorStyle
    }
  });
};

export const openAddProductScreen = props => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: SCREENS.ADD_PRODUCT_SCREEN,
      navigatorStyle: defaultNavigatorStyle
    },
    passProps: props
  });
};

export const openIntroScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: SCREENS.INTRO_SCREEN,
      navigatorStyle: { navBarHidden: true },
      navigatorButtons: {}
    }
  });
};

export const openAfterLoginScreen = () => {
  const startScreen = store.getState().ui.screenToOpenAfterLogin;
  if (startScreen) {
    store.dispatch(uiActions.setScreenToOpenAferLogin(null));
    return openAppScreen({
      startScreen
    });
  }
  return openAppScreen();
};

export const openAppScreen = opts => {
  let initialTabIndex = 0;
  let props = {};
  if (opts) {
    props.screenOpts = opts;
    switch (opts.startScreen) {
      case SCREENS.EHOME_SCREEN:
      case SCREENS.PRODUCT_DETAILS_SCREEN:
      case SCREENS.DOCS_UNDER_PROCESSING_SCREEN:
        initialTabIndex = 1;
        break;
      case SCREENS.ASC_SCREEN:
        initialTabIndex = 2;
        break;
      case SCREENS.FAQS_SCREEN:
      case SCREENS.PROFILE_SCREEN:
        initialTabIndex = 3;
        break;
    }
  }
  Navigation.startTabBasedApp({
    tabs: [
      {
        label: "Dashboard",
        screen: SCREENS.DASHBOARD_SCREEN,
        icon: require("./images/ic_nav_dashboard_off.png")
      },
      {
        label: "eHome",
        screen: SCREENS.EHOME_SCREEN,
        icon: require("./images/ic_nav_ehome_off.png")
      },
      {
        label: "ASC",
        screen: SCREENS.ASC_SCREEN,
        icon: require("./images/ic_nav_asc_off.png")
      },
      {
        label: "More",
        screen: SCREENS.MORE_SCREEN,
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
      initialTabIndex,
      hideBackButtonTitle: true
    }
  });
};

export default {
  openLoginScreen,
  openForceUpdateScreen,
  openForceUpdateModal,
  openIntroScreen,
  openAfterLoginScreen,
  openAppScreen,
  openBillsPopUp,
  openAddProductsScreen,
  openAddProductScreen
};
