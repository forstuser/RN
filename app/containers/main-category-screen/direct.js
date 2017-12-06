import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity
} from "react-native";

import { getCategoryProducts } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import ProductsList from "../../components/products-list";
import { colors } from "../../theme";

class Direct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }
  async componentDidMount() {
    await this.loadProducts({});
  }

  loadProducts = async () => {
    try {
      const res = await getCategoryProducts({
        categoryId: this.props.category.id
      });

      this.setState({
        products: res.productList
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <ProductsList
          mainCategoryId={this.props.category.id}
          products={this.state.products}
          navigator={this.props.navigator}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({});

export default Direct;
