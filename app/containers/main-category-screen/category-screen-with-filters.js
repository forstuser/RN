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

class CategoryWithFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilters: {},
      products: []
    };
  }
  async componentDidMount() {
    this.loadProducts();
  }

  loadProducts = async () => {
    try {
      const res = await getCategoryProducts({
        categoryId: this.props.category.id,
        pageNo: this.state.activeFilters.pageNo || 1,
        cType: this.state.activeFilters.cType
      });

      this.setState({
        products: res.productList
      });
    } catch (e) {
      console.log(e);
      Alert.alert(e.message);
    }
  };

  render() {
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <Text>Filters</Text>
        <ProductsList products={this.state.products} />
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
