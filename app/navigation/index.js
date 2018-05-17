import { NavigationActions } from "react-navigation";
import { SCREENS } from "../constants";

let navigator;

export function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

export function navigate(routeName, params) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

export const openAfterLoginScreen = () => {
  navigate(SCREENS.MAIN_TABS_STACK);
};

export default {
  navigate,
  setTopLevelNavigator,
  openAfterLoginScreen
};
