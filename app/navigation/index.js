import { NavigationActions } from "react-navigation";
import { SCREENS } from "../constants";
import store from "../store";
import { actions as uiActions } from "../modules/ui";

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

  //navigate to saved screen
  const screen = store.getState().ui.screenToOpenAfterLogin;
  if (screen) {
    navigate(screen);
    store.dispatch(uiActions.setScreenToOpenAferLogin(null));
  }
};

export const openBillsPopUp = params => {
  console.log("params for view bill", params)
  navigate(SCREENS.BILLS_POPUP_SCREEN, params);
};

export default {
  navigate,
  setTopLevelNavigator,
  openAfterLoginScreen,
  openBillsPopUp
};
