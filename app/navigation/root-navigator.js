import React from "react";
import { createSwitchNavigator } from "react-navigation";
import { Provider, connect } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";

import store, { persistor } from "../store";
import { SCREENS } from "../constants";

import LoadingOverlay from "../components/loading-overlay";

import NavigationService from "./index";
import AuthStack from "./auth-stack";
import AppStack from "./app-stack";

class AppLoadingComponent extends React.Component {
  componentWillMount() {
    console.log("this.props: ", this.props);
    this.props.navigation.navigate(
      this.props.authToken ? SCREENS.APP_STACK : SCREENS.AUTH_STACK
    );
  }
  render() {
    return <LoadingOverlay visible={true} />;
  }
}

const AppLoading = connect(store => ({
  authToken: store.loggedInUser.authToken
}))(AppLoadingComponent);

const RootNavigator = createSwitchNavigator(
  {
    AppLoading: AppLoading,
    [SCREENS.AUTH_STACK]: AuthStack,
    [SCREENS.APP_STACK]: AppStack
  },
  { initialRouteName: "AppLoading" }
);

export default class RootNavigation extends React.Component {
  componentDidMount() {
    //things to do on app startup
  }

  componentWillUnmount() {}

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={<LoadingOverlay visible={true} />}
          persistor={persistor}
        >
          <RootNavigator
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </PersistGate>
      </Provider>
    );
  }
}
