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
      filersFetched: false,
      filters: {
        categories: [],
        brands: [],
        offlineSellers: [],
        onlineSellers: []
      },
      appliedFilters: {
        pageNo: 1,
        categoryIds: [],
        brandIds: [],
        onlineSellerIds: [],
        offlineSellerIds: []
      },
      products: []
    };
  }
  async componentDidMount() {
    await this.loadProducts({});
  }

  applyFilters = ({
    pageNo = 1,
    categoryIds = [],
    brandIds = [],
    onlineSellerIds = [],
    offlineSellerIds = []
  }) => {
    this.setState(
      {
        appliedFilters: {
          pageNo,
          categoryIds,
          brandIds,
          onlineSellerIds,
          offlineSellerIds
        }
      },
      () => {
        this.loadProducts();
      }
    );
  };

  loadProducts = async () => {
    try {
      const {
        pageNo,
        categoryIds,
        brandIds,
        onlineSellerIds,
        offlineSellerIds
      } = this.state.appliedFilters;

      const res = await getCategoryProducts({
        categoryId: this.props.category.id,
        pageNo,
        categoryIds,
        brandIds,
        onlineSellerIds,
        offlineSellerIds
      });

      let newState = {
        products: res.productList
      };
      if (!this.state.filersFetched) {
        newState.filters = {
          categories: res.filterData.categories,
          brands: res.filterData.brands,
          offlineSellers: res.filterData.sellers.offlineSellers,
          onlineSellers: res.filterData.sellers.onlineSellers
        };
        newState.filersFetched = true;
      }
      this.setState(newState);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <Filters {...this.state.filters} applyFilters={this.applyFilters} />
        <ProductsList
          mainCategoryId={this.props.category.id}
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
