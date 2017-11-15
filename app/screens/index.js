import { Navigation } from "react-native-navigation";

import FirstTabScreen from "./App";
import SecondTabScreen from "./App";
import PushedScreen from "./App";

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent("example.FirstTabScreen", () => FirstTabScreen);
  Navigation.registerComponent(
    "example.SecondTabScreen",
    () => SecondTabScreen
  );
  Navigation.registerComponent("example.PushedScreen", () => PushedScreen);
}
