import React, { Component } from "react";
import { WebView } from "react-native";

export default class WebviewScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return { title: navigation.getParam("title", "WebView") };
  };

  render() {
    const uri = this.props.navigation.getParam("uri", null);
    return <WebView source={{ uri }} javaScriptEnabled={true} />;
  }
}
