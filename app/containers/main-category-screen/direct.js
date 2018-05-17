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
import ErrorOverlay from "../../components/error-overlay";
import { colors } from "../../theme";

class Direct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isFetchingProducts: false,
      error: null
    };
  }
  async componentDidMount() {
    await this.loadProducts({});
  }

  componentWillReceiveProps(newProps) {
    if (newProps.reloadList) {
      this.loadProducts();
    }
  }

  loadProducts = async () => {
    this.setState({
      isFetchingProducts: true,
      error: null
    });
    try {
      const res = await getCategoryProducts({
        categoryId: this.props.category.id
      });

      this.setState({
        products: res.productList
      });
    } catch (e) {
      this.setState({
        error: e
      });
    } finally {
      this.setState({
        isFetchingProducts: false
      });
    }
  };

  render() {
    const { products, isFetchingProducts, error } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.loadProducts} />;
    }
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <ProductsList
          mainCategoryId={this.props.category.id}
          products={products}
          navigation={this.props.navigation}
          onRefresh={() => this.loadProducts()}
          isLoading={isFetchingProducts}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({});

export default Direct;
