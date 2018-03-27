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

export const openEnterPinPopup = props => {
  Navigation.showModal({
    screen: SCREENS.ENTER_PIN_POPUP_SCREEN,
    passProps: props,
    overrideBackPress: true
  });
};

export const openLoginScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: SCREENS.LOGIN_SCREEN,
      navigatorStyle: defaultNavigatorStyle,
      navigatorButtons: {}
    },
    appStyle: {
      orientation: "portrait"
    }
  });
};

export const openForceUpdateScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: SCREENS.FORCE_UPDATE_SCREEN
    },
    appStyle: {
      orientation: "portrait"
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
    },
    appStyle: {
      orientation: "portrait"
    }
  });
};

export const openAddProductScreen = props => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: SCREENS.ADD_PRODUCT_SCREEN,
      navigatorStyle: defaultNavigatorStyle
    },
    passProps: props,
    appStyle: {
      orientation: "portrait"
    }
  });
};

export const openIntroScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: SCREENS.INTRO_SCREEN,
      navigatorStyle: { navBarHidden: true },
      navigatorButtons: {}
    },
    appStyle: {
      orientation: "portrait"
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
      case SCREENS.DO_YOU_KNOW_SCREEN:
        initialTabIndex = 3;
        break;
      case SCREENS.FAQS_SCREEN:
      case SCREENS.PROFILE_SCREEN:
        initialTabIndex = 4;
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
        label: "My Calendar",
        screen: SCREENS.MY_CALENDAR_SCREEN,
        icon: require("./images/ic_calendar.png")
      },
      {
        label: "Do You Know",
        screen: SCREENS.DO_YOU_KNOW_SCREEN,
        icon: require("./images/ic_do_you_know.png")
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
      orientation: "portrait",
      tabBarBackgroundColor: "#ffffff",
      tabBarButtonColor: colors.secondaryText,
      tabBarSelectedButtonColor: colors.mainBlue,
      tabBarTranslucent: false,
      forceTitlesDisplay: true,
      tabFontFamily: "Quicksand-Bold",
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
  openEnterPinPopup,
  openAddProductsScreen,
  openAddProductScreen
};
