import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { getCategoryProducts } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import ProductsList from "../../components/products-list";
import { colors } from "../../theme";

import Filters from "./filters";

class CategoryWithFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      products: []
    };
  }
  async componentDidMount() {
    await this.loadProducts({});
  }

  loadProducts = async ({
    pageNo = 1,
    categoryIds = [],
    brandIds = [],
    onlineSellerIds = [],
    offlineSellerIds = []
  }) => {
    try {
      const res = await getCategoryProducts({
        categoryId: this.props.category.id,
        pageNo: pageNo || 1,
        categoryIds,
        brandIds,
        onlineSellerIds,
        offlineSellerIds
      });

      this.setState({
        products: res.productList,
        filters: res.filterData
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <Filters {...this.state.filters} loadProducts={this.loadProducts} />
        <ProductsList
          products={this.state.products}
          navigator={this.props.navigator}
        />
      </ScreenContainer>
    );
  }
}

export default CategoryWithFilters;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center"
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30
  }
});
