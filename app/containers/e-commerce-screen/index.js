import React, { Component } from "react";
import {
  View,
  WebView,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
  Platform
} from "react-native";
import I18n from "../../i18n";
import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer, image } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import Analytics from "../../analytics";
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import Amazon from "./amazon";
class EcommerceScreen extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log(this.props)
  }
  render() {
    return <Amazon navigation={this.props.navigation} item={this.props.navigation.getParam("item", null)} />;
  }
}

const styles = StyleSheet.create({});

export default EcommerceScreen;
