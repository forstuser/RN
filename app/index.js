import { AppState, AsyncStorage, Platform, Alert, Linking } from "react-native";
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

import { registerScreens } from "./screens";
import store from "./store";
import { actions as loggedInUserActions } from "./modules/logged-in-user";
import { actions as uiActions } from "./modules/ui";
import {
  SCREENS,
  MAIN_CATEGORY_IDS,
  GLOBAL_VARIABLES,
  CODEPUSH_KEYS
} from "./constants";

import navigation, { openAppScreen } from "./navigation";

import { addFcmToken, verifyEmail } from "./api";

const showLocalNotification = notif => {
  if (notif && notif.title && Platform.OS == "android") {
    FCM.presentLocalNotification({
      title: notif.title, // as FCM payload
      body: notif.description, // as FCM payload (required)
      sound: "default", // as FCM payload
      priority: "high", // as FCM payload
      icon: "ic_launcher", // as FCM payload, you can relace this with custom icon you put in mipmap
      notification_type: notif.notification_type, // extra data you want to throw
      lights: true // Android only, LED blinking (default false)
    });
  }
};

FCM.on(FCMEvent.Notification, notif => {
  console.log("notification in background: ", notif);
  showLocalNotification(notif);
});

Navigation.isAppLaunched().then(appLaunched => {
  if (appLaunched) {
    startApp(); // App is launched -> show UI
  }
  new NativeEventsReceiver().appLaunched(startApp); // App hasn't been launched yet -> show the UI only when needed.
});

function startApp() {
  persistStore(store, {}, async () => {
    registerScreens(store, Provider); // this is where you register all of your app's screens
    const openFirstScreen = () => {
      if (store.getState().loggedInUser.authToken) {
        // start the app
        // navigation.openAddProductsScreen();
        navigation.openAfterLoginScreen();
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
              Alert.alert("Email Verified");
            })
            .catch(() => {
              Alert.alert("Couldn't Verify Email");
            });
        }
        switch (path.toLowerCase()) {
          case "/ehome":
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.EHOME_SCREEN)
            );
            break;
          case "/upload":
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.UPLOAD_DOCUMENT_SCREEN)
            );
            break;
          case "/asc":
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.ASC_SCREEN)
            );
            break;
          case "/faq":
            store.dispatch(
              uiActions.setScreenToOpenAferLogin(SCREENS.FAQS_SCREEN)
            );
            break;
          case "/direct-upload-document":
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
        if (event.url) {
          // console.log("url event: ", event.url);
          handleDeeplink(event.url);
        }
      });

      const notif = await FCM.getInitialNotification();
      console.log("InitialNotification: ", notif);
      const url = await Linking.getInitialURL();
      if (notif && notif.notification_type) handleNotification(notif);
      else if (url) handleDeeplink(url);
      else openFirstScreen();
    } catch (e) {}

    // let the app initialize and start a screen or codepush will throw error
    setTimeout(() => {
      codePush.sync({
        deploymentKey: store.getState().loggedInUser.codepushDeploymentStaging
          ? CODEPUSH_KEYS.DEPLOYEMENT
          : CODEPUSH_KEYS.PRODUCTION,
        installMode: codePush.InstallMode.ON_NEXT_RESUME
      });
      AppState.addEventListener("change", nextAppState => {
        if (nextAppState === "active") {
          codePush.sync({
            deploymentKey: store.getState().loggedInUser
              .codepushDeploymentStaging
              ? CODEPUSH_KEYS.DEPLOYEMENT
              : CODEPUSH_KEYS.PRODUCTION,
            installMode: codePush.InstallMode.ON_NEXT_RESUME
          });
        }
      });
    }, 5000);
  });
}
