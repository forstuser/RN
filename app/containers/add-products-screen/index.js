import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import Collapsible from "./../../components/collapsible";
import { colors } from "../../theme";
import AddProductItem from "./add-product-item";

class AddProductsScreen extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: "SKIP",
        id: "resendOtp",
        buttonColor: colors.pinkishOrange,
        buttonFontWeight: "600"
      }
    ]
  };
  constructor(props) {
    super(props);
    this.state = {
      products: [
        {
          mainCategoryId: 2,
          categoryId: 327,
          text: "Now let’s add your Mobile to Your eHome",
          image: "",
          brands: []
        }
      ]
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Add Products"
    });
  }

  render() {
    return (
      <ScreenContainer style={styles.container}>
        <AddProductItem productType="mobile" />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  text: {
    padding: 12,
    fontSize: 14,
    color: "#3b3b3b"
  }
});
export default AddProductsScreen;
