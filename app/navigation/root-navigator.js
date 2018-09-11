import React from "react";
import { Linking, NativeModules, Platform, AppState } from "react-native";
import { createSwitchNavigator } from "react-navigation";
import codePush from "react-native-code-push";
import moment from "moment";
import { connect } from "react-redux";
import SplashScreen from "react-native-splash-screen";
import URI from "urijs";
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";

import {
  SCREENS,
  MAIN_CATEGORY_IDS,
  GLOBAL_VARIABLES,
  CODEPUSH_KEYS
} from "../constants";

import store from "../store";

import { actions as uiActions } from "../modules/ui";
import { actions as loggedInUserActions } from "../modules/logged-in-user";

import socketIo from "../socket-io";

import { openEnterPinPopup } from "./index";

import { addFcmToken, verifyEmail, getProfileDetail } from "../api";

import LoadingOverlay from "../components/loading-overlay";

import { showSnackbar } from "../utils/snackbar";
import IntroScreen from "../containers/intro-screen";
import RegistrationDetailsScreen from "../containers/registration-details-screen";

import NavigationService from "./index";
import AuthStack from "./auth-stack";
import AppStack from "./app-stack";
import UserOnBoardingStack from './user-on-boarding-stack';
import { colors } from "../theme";

const RootNavigator = createSwitchNavigator(
  {
    AppLoading: LoadingOverlay,
    [SCREENS.INTRO_SCREEN]: IntroScreen,
    [SCREENS.AUTH_STACK]: AuthStack,
    [SCREENS.REGISTRATION_DETAILS_SCREEN]: RegistrationDetailsScreen,
    [SCREENS.APP_STACK]: AppStack,
    [SCREENS.USER_ON_BOARDING_STACK]: UserOnBoardingStack
  },
  { initialRouteName: "AppLoading" }
);

const showLocalNotification = notif => {
  console.log("show notification", notif);
  if (notif && notif.title) {
    FCM.presentLocalNotification({
      title: notif.title, // as FCM payload
      body: notif.description, // as FCM payload (required)
      show_in_foreground: true,
      sound: "default", // as FCM payload
      priority: "high", // as FCM payload
      icon: "ic_notify", // as FCM payload, you can relace this with custom icon you put in mipmap
      color: colors.pinkishOrange,
      lights: true, // Android only, LED blinking (default false),
      picture: notif.image_url || undefined,
      hasShownOnce: true, //necessary for iOS, as it will fire the notification event right now
      ...notif
    });
  }
};

FCM.on(FCMEvent.Notification, notif => {
  console.log("notification: ", notif);
  console.log("AppState.currentState: ", AppState.currentState);
  if (Platform.OS == "android") {
    if (notif.local_notification) {
      handleNotification(notif);
    } else {
      showLocalNotification(notif);
    }
  } else if (Platform.OS == "ios") {
    if (notif.opened_from_tray) {
      handleNotification(notif);
    } else if (!notif.hasShownOnce) {
      showLocalNotification(notif);
    }
  }
});

Linking.addEventListener("url", event => {
  // this handles the use case where the app is running in the background and is activated by the listener...
  let url = event.url;
  console.log("url: ", url);
  if (url && url.toLowerCase().indexOf("binbill") > -1) {
    // console.log("url event: ", event.url);
    handleDeeplink(event.url);
  }
});

handleNotification = notif => {
  console.log("handle notification: ", notif);
  const authToken = store.getState().loggedInUser.authToken;
  let screenToOpen = null;
  let params = {};

  switch (notif.notification_type) {
    case "1":
      screenToOpen = SCREENS.TIPS_SCREEN;
      break;
    case "2":
    case "3":
    case "6":
      screenToOpen = SCREENS.ADD_PRODUCT_SCREEN;
      break;
    case "4":
      screenToOpen = SCREENS.ASC_SCREEN;
      params = { hitAccessApi: true };
      break;
    case "5":
      return Linking.openURL(notif.link).catch(err => {});
    case "7":
      screenToOpen = SCREENS.EHOME_SCREEN;
      break;
    case "8":
    case "10":
    case "11":
    case "12":
    case "13":
    case "14":
    case "18":
    case "25":
      screenToOpen = SCREENS.PRODUCT_DETAILS_SCREEN;
      store.dispatch(uiActions.setProductIdToOpenDirectly(notif.id));
      params = { productId: notif.id };
      break;
    case "9":
      return Linking.openURL("http://onelink.to/yemp45").catch(err => {});
    case "16":
    case "17":
      screenToOpen = SCREENS.PRODUCT_DETAILS_SCREEN;
      store.dispatch(uiActions.setProductIdToOpenDirectly(notif.id));
      params = { productId: notif.id, openServiceSchedule: true };
      break;
    case "19":
      screenToOpen = SCREENS.INSIGHTS_SCREEN;
      params = { initialFilterIndex: 0 }; //last 7 days
      break;
    case "20":
      screenToOpen = SCREENS.INSIGHTS_SCREEN;
      params = { initialFilterIndex: 1 }; // current month
      break;
    case "21":
    case "22":
      screenToOpen = SCREENS.PROFILE_SCREEN;
      break;
    case "23":
    case "24":
      screenToOpen = SCREENS.MAILBOX_SCREEN;
      break;
    case "26":
      screenToOpen = SCREENS.DEALS_SCREEN;
      break;
    case "27":
      store.dispatch(uiActions.setDykIdToOpenDirectly(notif.id));
      params.id = notif.id;
      screenToOpen = SCREENS.DO_YOU_KNOW_SCREEN;
      break;
    case "31":
      if (notif.order.order_type == 1) {
        screenToOpen = SCREENS.SHOPPING_LIST_ORDER_SCREEN;
      }
      params = { orderId: notif.order.id };
      break;
    default:
  }

  console.log("screenToOpen: ", screenToOpen);

  if (authToken && screenToOpen) {
    NavigationService.navigate(screenToOpen, params);
    store.dispatch(uiActions.setScreenToOpenAferLogin(null));
  } else if (!authToken && screenToOpen) {
    store.dispatch(uiActions.setScreenToOpenAferLogin(screenToOpen));
  }
};

handleDeeplink = url => {
  const authToken = store.getState().loggedInUser.authToken;
  console.log(url);
  const uri = URI(url);
  const path = uri.path();

  let screenToOpen = null;
  if (uri.hasQuery("verificationId")) {
    verifyEmail(uri.query(true).verificationId)
      .then(() => {
        showSnackbar({
          text: "Email Verified"
        });
      })
      .catch(() => {
        showSnackbar({
          text: "Couldn't Verify Email"
        });
      });
  }

  const pathParts = path.split("/");

  const params = {};
  switch (pathParts[1].toLowerCase()) {
    case "add-product":
      screenToOpen = SCREENS.ADD_PRODUCT_SCREEN;
      break;
    case "ehome":
      screenToOpen = SCREENS.EHOME_SCREEN;
      break;
    case "insight":
      screenToOpen = SCREENS.INSIGHTS_SCREEN;
      break;
    case "asc":
      screenToOpen = SCREENS.ASC_SCREEN;
      break;
    case "faq":
      screenToOpen = SCREENS.FAQS_SCREEN;
      break;
    case "deals":
      screenToOpen = SCREENS.DEALS_SCREEN;

      params.defaultTab = pathParts[2];
      params.categoryId = pathParts[3];
      if (uri.hasQuery("product_id")) {
        params.productId = uri.query(true).product_id;
      }

      if (uri.hasQuery("accessory_id")) {
        params.accessoryId = uri.query(true).accessory_id;
      }

      break;
    case "products":
      const productId = path.split("/").pop();
      store.dispatch(uiActions.setProductIdToOpenDirectly(productId));
      params.productId = productId;
      screenToOpen = SCREENS.PRODUCT_DETAILS_SCREEN;
      break;
    case "do-you-know":
      const dykId = path.split("/").pop();
      store.dispatch(uiActions.setDykIdToOpenDirectly(dykId));
      screenToOpen = SCREENS.DO_YOU_KNOW_SCREEN;
      break;
    case "direct-upload-document":
      if (uri.hasQuery("files")) {
        global[GLOBAL_VARIABLES.FILES_FOR_DIRECT_UPLOAD] = uri.query(
          true
        ).files;
      }
      screenToOpen = SCREENS.DIRECT_UPLOAD_DOCUMENT_SCREEN;
      break;
    default:
      screenToOpen = null;
  }

  if (authToken && screenToOpen) {
    NavigationService.navigate(screenToOpen, params);
    store.dispatch(uiActions.setScreenToOpenAferLogin(null));
  } else if (!authToken && screenToOpen) {
    store.dispatch(uiActions.setScreenToOpenAferLogin(screenToOpen));
  }
};

const urlForDirectFileUpload = filePath => {
  // 2 'files' because it should be array when parsed
  return `https://www.binbill.com/direct-upload-document?files=${filePath}&files=${filePath}`;
};

//things to do on app resume
AppState.addEventListener("change", nextAppState => {
  console.log("nextAppState: ", nextAppState);
  if (nextAppState === "background") {
    global[GLOBAL_VARIABLES.LAST_ACTIVE_TIMESTAMP] = moment().toISOString();
  } else if (nextAppState === "active") {
    if (
      global[GLOBAL_VARIABLES.LAST_ACTIVE_TIMESTAMP] &&
      moment().diff(
        moment(global[GLOBAL_VARIABLES.LAST_ACTIVE_TIMESTAMP]),
        "minutes"
      ) > 10 &&
      store.getState().loggedInUser.isPinSet
    ) {
      NavigationService.navigate(SCREENS.ENTER_PIN_POPUP_SCREEN);
    }

    if (Platform.OS == "android") {
      //a timeout so that native android can save the 'filePath' in shared preferences
      setTimeout(async () => {
        const filePath = await NativeModules.RNDirectUploadFileModule.getFIlePath();
        if (filePath) {
          url = urlForDirectFileUpload(filePath);
          handleDeeplink(url);
        }
      }, 1000);
    }

    codePush.sync({
      deploymentKey: store.getState().loggedInUser.codepushDeploymentStaging
        ? CODEPUSH_KEYS.STAGING
        : CODEPUSH_KEYS.PRODUCTION
    });
  }
});

class RootNavigation extends React.Component {
  async componentDidMount() {
    SplashScreen.hide();

    codePush.sync({
      deploymentKey: this.props.codepushDeploymentStaging
        ? CODEPUSH_KEYS.STAGING
        : CODEPUSH_KEYS.PRODUCTION
    });

    if (!this.props.isUserLoggedIn) {
      NavigationService.navigate(SCREENS.INTRO_SCREEN);
    } else {
      socketIo.connect();
      this.props.incrementAppOpen();
      NavigationService.navigate(SCREENS.APP_STACK);
      const r = await getProfileDetail();
      const user = r.userProfile;
      this.props.setLoggedInUser({
        id: user.id,
        name: user.name,
        phone: user.mobile_no,
        imageUrl: user.imageUrl,
        isPinSet: user.hasPin
      });

      if(user.name === null || user.email === null || user.gender === null) {
        NavigationService.navigate(SCREENS.USER_ON_BOARDING_STACK);
      }
        
    }

    FCM.requestPermissions()
      .then(() => console.log("granted"))
      .catch(() => console.log("notification permission rejected"));

    FCM.getFCMToken()
      .then(async token => {
        store.dispatch(uiActions.setFcmToken(token));
        try {
          await addFcmToken(token);
        } catch (e) {
          console.log("error in fcm token update: ", e);
        }
      })
      .catch(e => console.log("token error: ", e));

    FCM.on(FCMEvent.RefreshToken, async token => {
      store.dispatch(uiActions.setFcmToken(token));
      try {
        await addFcmToken(token);
      } catch (e) {}
    });

    const notif = await FCM.getInitialNotification();
    if (notif) {
      handleNotification(notif);
    }

    let url = await Linking.getInitialURL();
    console.log("getInitialURL url: ", url);

    // direct file upload in Android
    if (Platform.OS == "android") {
      const filePath = await NativeModules.RNDirectUploadFileModule.getFIlePath();
      console.log("FilePath: ", filePath);
      if (filePath) {
        // 2 'files' because it should be array when parsed
        url = urlForDirectFileUpload(filePath);
      }
    }
    if (url) {
      handleDeeplink(url);
    }

    if (this.props.isPinSet) {
      NavigationService.navigate(SCREENS.ENTER_PIN_POPUP_SCREEN);
    }
  }

  render() {
    return (
      <RootNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

const mapStateToProps = store => ({
  isUserLoggedIn: store.loggedInUser.authToken ? true : false,
  isPinSet: store.loggedInUser.isPinSet,
  authToken: store.loggedInUser.authToken,
  codepushDeploymentStaging: store.loggedInUser.codepushDeploymentStaging
});

const mapDispatchToProps = dispatch => {
  return {
    setLoggedInUser: user => {
      dispatch(loggedInUserActions.setLoggedInUser(user));
    },
    incrementAppOpen: () => {
      dispatch(uiActions.incrementAppOpen());
    },
    setDykIdToOpenDirectly: id => {
      dispatch(uiActions.setDykIdToOpenDirectly(id));
    },
    setProductIdToOpenDirectly: id => {
      dispatch(uiActions.setProductIdToOpenDirectly(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootNavigation);
