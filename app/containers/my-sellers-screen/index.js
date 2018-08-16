import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

import { Text, Image } from "../../elements";
import DrawerScreenContainer from "../../components/drawer-screen-container";

import { getMySellers } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

export default class MySellersScreen extends React.Component {
  state = {
    mySellers: [],
    isLoading: false,
    error: null
  };

  componentDidMount() {}

  loadMySellers = async () => {
    try {
    } catch (e) {}
  };

  render() {
    const { navigation } = this.props;

    return <DrawerScreenContainer title="My Sellers" navigation={navigation} />;
  }
}
