import { AppState, AsyncStorage, Platform, Alert } from "react-native";
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";

import { persistStore } from "redux-persist";
import { Provider } from "react-redux";

import { registerScreens } from "./screens";
import store from "./store";
import { actions as loggedInUserActions } from "./modules/logged-in-user";
import { SCREENS } from "./constants";

import navigation, { openAppScreen } from "./navigation";

import { addFcmToken } from "./api";

persistStore(store, {}, () => {
  registerScreens(store, Provider); // this is where you register all of your app's screens
  try {
    FCM.requestPermissions()
      .then(() => console.log("granted"))
      .catch(() => console.log("notification permission rejected"));

    FCM.getFCMToken()
      .then(async token => {
        console.log("token: ", token);
        store.dispatch(loggedInUserActions.setLoggedInUserFcmToken(token));
        try {
          await addFcmToken(token);
        } catch (e) {}
      })
      .catch(e => console.log("token error: ", e));

    FCM.on(FCMEvent.RefreshToken, async token => {
      console.log("FCM TOKEN: ", token);
      store.dispatch(loggedInUserActions.setLoggedInUserFcmToken(token));
      try {
        await addFcmToken(token);
      } catch (e) {}
    });

    FCM.on(FCMEvent.Notification, async notif => {
      FCM.presentLocalNotification({
        title: "My Notification Title", // as FCM payload
        body: "My Notification Message", // as FCM payload (required)
        badge: 0 // as FCM payload IOS only, set 0 to clear badges
      });
      if (notif.opened_from_tray) {
        console.log("notif: ", notif);
        switch (notif.notification_type) {
          case "1":
            return openAppScreen();
          case "2":
            return openAppScreen({ startScreen: SCREENS.MAILBOX_SCREEN });
          case "3":
          case "4":
            return openAppScreen({
              startScreen: SCREENS.PRODUCT_SCREEN,
              productId: notif.productId
            });
          case "5":
            return openAppScreen({
              startScreen: SCREENS.INSIGHTS_SCREEN,
              initialFilterIndex: 0 //last 7 days
            });
          case "6":
            return openAppScreen({
              startScreen: SCREENS.INSIGHTS_SCREEN,
              initialFilterIndex: 1 // current month
            });
          case "7":
            return openAppScreen({
              startScreen: SCREENS.INSIGHTS_SCREEN,
              initialFilterIndex: 2 // current year
            });
          case "8":
            return openAppScreen({
              startScreen: SCREENS.PROFILE_SCREEN
            });
          case "9":
            return openAppScreen();
          case "10":
            return openAppScreen({
              startScreen: SCREENS.ADD_PRODUCT_SCREEN
            });
        }
      }
    });
  } catch (e) {
    console.log("FCM INIT Error: ", e);
  }
  if (store.getState().loggedInUser.authToken) {
    // start the app
    // navigation.openAddProductScreen();
    navigation.openAppScreen();
  } else {
    navigation.openIntroScreen();
  }
});
