import {
  AppState,
  AsyncStorage,
  Platform,
  Alert,
  Linking,
  NativeModules
} from "react-native";
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";
import URI from "urijs";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import codePush from "react-native-code-push";
import { Navigation, NativeEventsReceiver } from "react-native-navigation";
import moment from "moment";
import { registerScreens } from "./screens";
import I18n from "./i18n";
import { showSnackbar } from "./containers/snackbar";
import store from "./store";
import { actions as loggedInUserActions } from "./modules/logged-in-user";
import { actions as uiActions } from "./modules/ui";
import {
  SCREENS,
  MAIN_CATEGORY_IDS,
  GLOBAL_VARIABLES,
  CODEPUSH_KEYS
} from "./constants";

import navigation, { openAppScreen, openEnterPinPopup } from "./navigation";

import { addFcmToken, verifyEmail } from "./api";

const showLocalNotification = notif => {
  if (notif && notif.title && Platform.OS == "android") {
    FCM.presentLocalNotification({
      title: notif.title, // as FCM payload
      body: notif.description, // as FCM payload (required)
      sound: "default", // as FCM payload
      priority: "high", // as FCM payload
      icon: "ic_launcher", // as FCM payload, you can relace this with custom icon you put in mipmap
      lights: true, // Android only, LED blinking (default false),
      show_in_foreground: true,
      picture: notif.image_url || undefined,
      ...notif
    });
  }
};

FCM.on(FCMEvent.Notification, notif => {
  console.log("notification in background: ", notif);
  if (!notif.opened_from_tray) {
    showLocalNotification(notif);
  }
});

if (Platform.OS == "android") {
  Navigation.isAppLaunched().then(appLaunched => {
    if (appLaunched) {
      startApp(); // App is launched -> show UI
    }
    new NativeEventsReceiver().appLaunched(startApp); // App hasn't been launched yet -> show the UI only when needed.
  });
} else {
  startApp();
}

const urlForDirectFileUpload = filePath => {
  // 2 'files' because it should be array when parsed
  return `https://www.binbill.com/direct-upload-document?files=${filePath}&files=${filePath}`;
};

function startApp() {
  persistStore(store, {}, async () => {
    registerScreens(store, Provider); // this is where you register all of your app's screens

    const language = store.getState().ui.language;
    // I18n.locale = language.code;

    let previousAppAuthToken = null;
    try {
      previousAppAuthToken = await NativeModules.RNGetPreviousAppAuthToken.getAuthToken();
    } catch (e) {}
    if (previousAppAuthToken && !store.getState().loggedInUser.authToken) {
      store.dispatch(
        loggedInUserActions.setLoggedInUserAuthToken(previousAppAuthToken)
      );
    }

    const openFirstScreen = () => {
      if (store.getState().loggedInUser.authToken) {
        // start the app
        // navigation.openAddProductsScreen();
        navigation.openAfterLoginScreen();

        if (store.getState().loggedInUser.isPinSet) {
          setTimeout(openEnterPinPopup, 300);
        }
      } else {
        navigation.openIntroScreen();
      }
    };

    try {
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

      FCM.on(FCMEvent.Notification, notif => {
        console.log("notification in foreground: ", notif);
        // showLocalNotification(notif);
        if (Platform.os == "ios" && notif.opened_from_tray) {
          handleNotification(notif);
        } else if (notif.local_notification) {
          handleNotification(notif);
        }
      });

      const handleNotification = notif => {
        console.log("handle notification: ", notif);
        switch (notif.notification_type) {
          case "1":
            return openAppScreen({
              startScreen: SCREENS.TIPS_SCREEN
            });
          case "2":
          case "3":
          case "6":
            return openAppScreen({
              startScreen: SCREENS.DASHBOARD_SCREEN,
              openAddProductOptions: true
            });
          case "4":
            return openAppScreen({
              startScreen: SCREENS.ASC_SCREEN,
              hitAccessApi: true
            });
          case "5":
            return Linking.openURL(notif.link).catch(err => openAppScreen());
          case "7":
            return openAppScreen({
              startScreen: SCREENS.EHOME_SCREEN
            });
          case ("8", "10", "11", "12", "13", "14", "18", "25"):
            return openAppScreen({
              startScreen: SCREENS.PRODUCT_DETAILS_SCREEN,
              productId: notif.id
            });
          case "9":
            return Linking.openURL(
              "https://itunes.apple.com/in/app/binbill/id1328873045"
            ).catch(err => openAppScreen());
          case "16":
          case "17":
            return openAppScreen({
              startScreen: SCREENS.PRODUCT_DETAILS_SCREEN,
              productId: notif.id,
              openServiceSchedule: true
            });
          case "19":
            return openAppScreen({
              startScreen: SCREENS.INSIGHTS_SCREEN,
              initialFilterIndex: 0 //last 7 days
            });
          case "20":
            return openAppScreen({
              startScreen: SCREENS.INSIGHTS_SCREEN,
              initialFilterIndex: 1 // current month
            });
          case "21":
          case "22":
            return openAppScreen({
              startScreen: SCREENS.PROFILE_SCREEN
            });
          case "23":
          case "24":
            return openAppScreen({ startScreen: SCREENS.MAILBOX_SCREEN });
          case "26":
            return openAppScreen({ startScreen: SCREENS.EASY_LIFE_SCREEN });
          default:
        }
      };

      const handleDeeplink = url => {
        console.log(url);
        const uri = URI(url);
        const path = uri.path();

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
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.EHOME_SCREEN)
            );
            break;
          case "upload":
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.UPLOAD_DOCUMENT_SCREEN)
            );
            break;
          case "asc":
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.ASC_SCREEN)
            );
            break;
          case "faq":
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.FAQS_SCREEN)
            );
            break;
          case "eazy-day":
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.EASY_LIFE_SCREEN)
            );
            break;
          case "do-you-know":
            global[
              GLOBAL_VARIABLES.DO_YOU_KNOW_ITEM_ID_TO_OPEN_DIRECTLY
            ] = path.split("/").pop();
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.DO_YOU_KNOW_SCREEN)
            );
            break;
          case "direct-upload-document":
            if (uri.hasQuery("files")) {
              global[GLOBAL_VARIABLES.FILES_FOR_DIRECT_UPLOAD] = uri.query(
                true
              ).files;
            }
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(
                SCREENS.DIRECT_UPLOAD_DOCUMENT_SCREEN
              )
            );
            break;
          default:
            store.dispatch(uiActions.setScreenToOpenAferLogin(null));
        }
        openFirstScreen();
      };

      Linking.addEventListener("url", event => {
        // this handles the use case where the app is running in the background and is activated by the listener...
        let url = event.url;
        console.log("url: ", url);
        if (url && url.toLowerCase().indexOf("binbill") > -1) {
          // console.log("url event: ", event.url);
          handleDeeplink(event.url);
        }
      });

      const notif = await FCM.getInitialNotification();
      console.log("InitialNotification: ", notif);
      let url = await Linking.getInitialURL();
      // direct file upload in Android
      if (Platform.OS == "android") {
        const filePath = await NativeModules.RNDirectUploadFileModule.getFIlePath();
        console.log("FilePath: ", filePath);
        if (filePath) {
          url = urlForDirectFileUpload(filePath);
        }
      }
      if (notif && notif.notification_type) handleNotification(notif);
      else if (url) handleDeeplink(url);
      else openFirstScreen();

      //things to do on app resume
      AppState.addEventListener("change", nextAppState => {
        console.log("nextAppState: ", nextAppState);
        if (nextAppState === "background") {
          global[
            GLOBAL_VARIABLES.LAST_ACTIVE_TIMESTAMP
          ] = moment().toISOString();
        } else if (nextAppState === "active") {
          if (
            global[GLOBAL_VARIABLES.LAST_ACTIVE_TIMESTAMP] &&
            moment().diff(
              moment(global[GLOBAL_VARIABLES.LAST_ACTIVE_TIMESTAMP]),
              "minutes"
            ) > 10 &&
            store.getState().loggedInUser.isPinSet
          ) {
            openEnterPinPopup();
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
            deploymentKey: store.getState().loggedInUser
              .codepushDeploymentStaging
              ? CODEPUSH_KEYS.STAGING
              : CODEPUSH_KEYS.PRODUCTION
          });
        }
      });

      // let the app initialize and start a screen or codepush will throw error
      setTimeout(() => {
        codePush.sync({
          deploymentKey: store.getState().loggedInUser.codepushDeploymentStaging
            ? CODEPUSH_KEYS.STAGING
            : CODEPUSH_KEYS.PRODUCTION
        });
      }, 5000);
    } catch (e) {
      console.log("startApp error: ", e);
    }
  });
}
