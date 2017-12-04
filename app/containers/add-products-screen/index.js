import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import Collapsible from "./../../components/collapsible";

import AddProductItem from "./add-product-item";

class AddProductsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Add Products in eHome"
    });
  }

  render() {
    return (
      <ScreenContainer style={styles.contain}>
        <AddProductItem item="car" />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  contain: {
    fontSize: 14,
    padding: 0
  },
  text: {
    padding: 12,
    fontSize: 14,
    color: "#3b3b3b"
  }
});
export default AddProductsScreen;
