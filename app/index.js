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

import navigation from "./navigation";

persistStore(store, {}, () => {
  registerScreens(store, Provider); // this is where you register all of your app's screens
  try {
    FCM.requestPermissions()
      .then(() => console.log("granted"))
      .catch(() => console.log("notification permission rejected"));

    FCM.getFCMToken()
      .then(token => {
        console.log("token: ", token);
        // store fcm token in your server
      })
      .catch(e => console.log("token error: ", e));

    FCM.on(FCMEvent.RefreshToken, token => {
      console.log("FCM TOKEN: ", token);
      // fcm token may not be available on first load, catch it here
    });

    FCM.on(FCMEvent.Notification, async notif => {
      if (notif.opened_from_tray) {
        Alert.alert("notification clicked");
      }
    });
  } catch (e) {
    console.log("FCM INIT Error: ", e);
  }
  if (store.getState().loggedInUser.authToken) {
    // start the app
    // navigation.openAddProductsScreen();
    navigation.openAppScreen();
  } else {
    navigation.openIntroScreen();
  }
});
