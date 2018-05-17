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
  navigate(SCREENS.APP_STACK);
};

export const openBillsPopUp = params => {
  navigate(SCREENS.BILLS_POPUP_SCREEN, params);
};

export default {
  navigate,
  setTopLevelNavigator,
  openAfterLoginScreen,
  openBillsPopUp
};
