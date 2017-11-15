import { Navigation } from "react-native-navigation";

import FirstTabScreen from "./App";
import SecondTabScreen from "./App";
import PushedScreen from "./App";

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent(
    "example.FirstTabScreen",
    () => FirstTabScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "example.SecondTabScreen",
    () => SecondTabScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "example.PushedScreen",
    () => PushedScreen,
    store,
    Provider
  );
}
