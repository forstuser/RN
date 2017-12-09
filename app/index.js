import { AppState, AsyncStorage, Platform } from "react-native";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";

import { registerScreens } from "./screens";
import store from "./store";

import navigation from "./navigation";

persistStore(store, {}, () => {
  registerScreens(store, Provider); // this is where you register all of your app's screens

  if (store.getState().loggedInUser.authToken) {
    // start the app
    navigation.openAddProductsScreen();
    // navigation.openAppScreen();
  } else {
    navigation.openIntroScreen();
  }
});
