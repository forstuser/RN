import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  FlatList,
  Alert,
  TouchableOpacity
} from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import Collapsible from "./../components/collapsible";

class TotalTaxScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Total Tax Paid"
    });
  }

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <Text>Hello</Text>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  }
});

export default TotalTaxScreen;
