import React from "react";
import { Linking, NativeModules, Platform } from "react-native";
import { createSwitchNavigator } from "react-navigation";
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

import { openAppScreen, openEnterPinPopup } from "./index";

import { addFcmToken, verifyEmail } from "../api";

import LoadingOverlay from "../components/loading-overlay";

import { showSnackbar } from "../utils/snackbar";

import NavigationService from "./index";
import AuthStack from "./auth-stack";
import AppStack from "./app-stack";

const RootNavigator = createSwitchNavigator(
  {
    AppLoading: LoadingOverlay,
    [SCREENS.AUTH_STACK]: AuthStack,
    [SCREENS.APP_STACK]: AppStack
  },
  { initialRouteName: "AppLoading" }
);

const showLocalNotification = notif => {
  if (notif && notif.title && Platform.OS == "android") {
    FCM.presentLocalNotification({
      title: notif.title, // as FCM payload
      body: notif.description, // as FCM payload (required)
      show_in_foreground: true,
      sound: "default", // as FCM payload
      priority: "high", // as FCM payload
      icon: "ic_launcher", // as FCM payload, you can relace this with custom icon you put in mipmap
      lights: true, // Android only, LED blinking (default false),
      picture: notif.image_url || undefined,
      ...notif
    });
  }
};

FCM.on(FCMEvent.Notification, notif => {
  console.log("notification: ", notif);
  if (
    notif.local_notification ||
    (Platform.OS == "ios" && notif.opened_from_tray)
  ) {
    handleNotification(notif);
  } else if (Platform.OS == "android") {
    showLocalNotification(notif);
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
    case ("8", "10", "11", "12", "13", "14", "18", "25"):
      screenToOpen = SCREENS.PRODUCT_DETAILS_SCREEN;
      params = { productId: notif.id };
      break;
    case "9":
      return Linking.openURL(
        "https://itunes.apple.com/in/app/binbill/id1328873045"
      ).catch(err => openAppScreen());
    case "16":
    case "17":
      screenToOpen = SCREENS.PRODUCT_DETAILS_SCREEN;
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
      screenToOpen = SCREENS.EASY_LIFE_SCREEN;
      break;
    default:
  }

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

  const pathItem1 = path.split("/")[1];

  switch (pathItem1.toLowerCase()) {
    case "ehome":
      screenToOpen = SCREENS.EHOME_SCREEN;
      break;
    case "upload":
      screenToOpen = SCREENS.UPLOAD_DOCUMENT_SCREEN;
      break;
    case "asc":
      screenToOpen = SCREENS.ASC_SCREEN;
      break;
    case "faq":
      screenToOpen = SCREENS.FAQS_SCREEN;
      break;
    case "eazy-day":
      screenToOpen = SCREENS.EASY_LIFE_SCREEN;
      break;
    case "do-you-know":
      global[
        GLOBAL_VARIABLES.DO_YOU_KNOW_ITEM_ID_TO_OPEN_DIRECTLY
      ] = path.split("/").pop();
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
    NavigationService.navigate(screenToOpen);
    store.dispatch(uiActions.setScreenToOpenAferLogin(null));
  } else if (!authToken && screenToOpen) {
    store.dispatch(uiActions.setScreenToOpenAferLogin(screenToOpen));
  }
};

class RootNavigation extends React.Component {
  async componentDidMount() {
    SplashScreen.hide();
    console.log("this.props: ", this.props);
    if (!this.props.isUserLoggedIn) {
      NavigationService.navigate(SCREENS.AUTH_STACK);
    } else {
      NavigationService.navigate(SCREENS.APP_STACK);
    }

    FCM.requestPermissions()
      .then(() => console.log("granted"))
      .catch(() => console.log("notification permission rejected"));

    FCM.getFCMToken()
      .then(async token => {
        store.dispatch(loggedInUserActions.setLoggedInUserFcmToken(token));
        try {
          await addFcmToken(token);
        } catch (e) {
          console.log("error in fcm token update: ", e);
        }
      })
      .catch(e => console.log("token error: ", e));

    FCM.on(FCMEvent.RefreshToken, async token => {
      store.dispatch(loggedInUserActions.setLoggedInUserFcmToken(token));
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
        url = `https://www.binbill.com/direct-upload-document?files=${filePath}&files=${filePath}`;
      }
    }
    if (url) {
      handleDeeplink(url);
    }
    Linking.addEventListener("url", event => {
      // this handles the use case where the app is running in the background and is activated by the listener...
      let url = event.url;
      console.log("url: ", url);
      if (url && url.toLowerCase().indexOf("binbill") > -1) {
        // console.log("url event: ", event.url);
        handleDeeplink(event.url);
      }
    });

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

export default connect(store => ({
  isUserLoggedIn: store.loggedInUser.authToken ? true : false,
  isPinSet: store.loggedInUser.isPinSet,
  authToken: store.loggedInUser.authToken
}))(RootNavigation);
