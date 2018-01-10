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

import { registerScreens } from "./screens";
import store from "./store";
import { actions as loggedInUserActions } from "./modules/logged-in-user";
import { actions as uiActions } from "./modules/ui";
import { SCREENS, MAIN_CATEGORY_IDS } from "./constants";

import navigation, { openAppScreen } from "./navigation";

import { addFcmToken, verifyEmail } from "./api";

persistStore(store, {}, () => {
  registerScreens(store, Provider); // this is where you register all of your app's screens
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

    FCM.on(FCMEvent.Notification, async notif => {
      if (notif.opened_from_tray) {
        switch (notif.notification_type) {
          case "1":
            if (
              notif.masterCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE ||
              notif.masterCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS
            ) {
              return openAppScreen({
                startScreen: SCREENS.PRODUCT_DETAILS_SCREEN,
                productId: notif.productId
              });
            }
            return openAppScreen();
          case "2":
            return openAppScreen({ startScreen: SCREENS.MAILBOX_SCREEN });
          case "3":
          case "4":
            return openAppScreen({
              startScreen: SCREENS.PRODUCT_DETAILS_SCREEN,
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

  Linking.getInitialURL()
    .then(url => {
      if (url) {
        handleDeeplink(url);
      }
      openFirstScreen();
    })
    .catch(e => {
      openFirstScreen();
    });

  Linking.addEventListener("url", event => {
    // this handles the use case where the app is running in the background and is activated by the listener...
    if (event.url) {
      handleDeeplink(event.url);
      openFirstScreen();
    }
  });

  const handleDeeplink = url => {
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
        return store.dispatch(
          uiActions.setScreenToOpenAferLogin(SCREENS.EHOME_SCREEN)
        );
      case "/upload":
        return store.dispatch(
          uiActions.setScreenToOpenAferLogin(SCREENS.UPLOAD_DOCUMENT_SCREEN)
        );
      case "/asc":
        return store.dispatch(
          uiActions.setScreenToOpenAferLogin(SCREENS.ASC_SCREEN)
        );
      case "/faq":
        return store.dispatch(
          uiActions.setScreenToOpenAferLogin(SCREENS.FAQS_SCREEN)
        );
      default:
        return store.dispatch(uiActions.setScreenToOpenAferLogin(null));
    }
  };

  const openFirstScreen = () => {
    if (store.getState().loggedInUser.authToken) {
      // start the app
      // navigation.openAddProductsScreen();
      navigation.openAfterLoginScreen();
    } else {
      navigation.openIntroScreen();
    }
  };
});
