import React from "react";
import { Linking } from "react-native";
import { createSwitchNavigator } from "react-navigation";
import { connect } from "react-redux";
import URI from "urijs";

import {
  SCREENS,
  MAIN_CATEGORY_IDS,
  GLOBAL_VARIABLES,
  CODEPUSH_KEYS
} from "../constants";

import store from "../store";

import { actions as uiActions } from "../modules/ui";

import { openAppScreen, openEnterPinPopup } from "./index";

import { addFcmToken, verifyEmail } from "../api";

import LoadingOverlay from "../components/loading-overlay";

import { showSnackbar } from "../utils/snackbar";

import NavigationService from "./index";
import AuthStack from "./auth-stack";
import AppStack from "./app-stack";

const RootNavigator = createSwitchNavigator(
  {
    AppLoading: LoadingOverlay,
    [SCREENS.AUTH_STACK]: AuthStack,
    [SCREENS.APP_STACK]: AppStack
  },
  { initialRouteName: "AppLoading" }
);

class RootNavigation extends React.Component {
  componentDidMount() {
    console.log("this.props: ", this.props);
    if (!this.props.isUserLoggedIn) {
      NavigationService.navigate(SCREENS.AUTH_STACK);
    } else {
      NavigationService.navigate(SCREENS.APP_STACK);
    }

    return;
    let url = Linking.getInitialURL();
    console.log("getInitialURL url: ", url);

    Linking.addEventListener("url", event => {
      // this handles the use case where the app is running in the background and is activated by the listener...
      let url = event.url;
      console.log("url: ", url);
      if (url && url.toLowerCase().indexOf("binbill") > -1) {
        // console.log("url event: ", event.url);
        this.handleDeeplink(event.url);
      }
    });
  }

  handleDeeplink = url => {
    console.log(url);
    const uri = URI(url);
    const path = uri.path();

    screenToOpen = null;
    if (uri.hasQuery("verificationId")) {
      verifyEmail(uri.query(true).verificationId)
        .then(() => {
          showSnackbar({
            text: "Email Verified"
          });
        })
        .catch(() => {
          showSnackbar({
            text: "Couldn't Verify Email"
          });
        });
    }

    const pathItem1 = path.split("/")[1];

    switch (pathItem1.toLowerCase()) {
      case "ehome":
        screenToOpen = SCREENS.EHOME_SCREEN;
        break;
      case "upload":
        screenToOpen = SCREENS.UPLOAD_DOCUMENT_SCREEN;
        break;
      case "asc":
        screenToOpen = SCREENS.ASC_SCREEN;
        break;
      case "faq":
        screenToOpen = SCREENS.FAQS_SCREEN;
        break;
      case "eazy-day":
        screenToOpen = SCREENS.EASY_LIFE_SCREEN;

        break;
      case "do-you-know":
        global[
          GLOBAL_VARIABLES.DO_YOU_KNOW_ITEM_ID_TO_OPEN_DIRECTLY
        ] = path.split("/").pop();
        screenToOpen = SCREENS.DO_YOU_KNOW_SCREEN;
        break;
      case "direct-upload-document":
        if (uri.hasQuery("files")) {
          global[GLOBAL_VARIABLES.FILES_FOR_DIRECT_UPLOAD] = uri.query(
            true
          ).files;
        }
        screenToOpen = SCREENS.DIRECT_UPLOAD_DOCUMENT_SCREEN;
        break;
      default:
        screenToOpen = null;
    }
    store.dispatch(uiActions.setScreenToOpenAferLogin(SCREENS.EHOME_SCREEN));
    if (screenToOpen) NavigationService.navigate(screenToOpen);
  };

  render() {
    return (
      <RootNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

export default connect(store => ({
  isUserLoggedIn: store.loggedInUser.authToken ? true : false,
  authToken: store.loggedInUser.authToken
}))(RootNavigation);
