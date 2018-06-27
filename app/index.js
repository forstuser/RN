import React, { Component } from "react";
import { AppRegistry, View, Text, StatusBar } from "react-native";
import { Provider, connect } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";
import store, { persistor } from "./store";
import LoadingOverlay from "./components/loading-overlay";
import RootNavigator from "./navigation/root-navigator";
import NavigationService from "./navigation";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={<LoadingOverlay visible={true} />}
          persistor={persistor}
        >
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <RootNavigator />
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent("BinBill", () => App);
