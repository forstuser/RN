import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";

import {
  PagerTabIndicator,
  IndicatorViewPager,
  PagerTitleIndicator,
  PagerDotIndicator
} from "rn-viewpager";

import { getCategoryProducts } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import ProductsList from "../../components/products-list";
import { colors } from "../../theme";

class CategoryWithPager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subCategories: [],
      activeIndex: 0
    };
  }
  async componentDidMount() {
    this.setState(
      {
        subCategories: this.props.category.subCategories.map(subCategory => {
          return {
            ...subCategory,
            products: [],
            pageNo: 1,
            isFetchingProducts: true
          };
        })
      },
      () => {
        this.loadProducts(0);
      }
    );
  }

  onPageChange = newIndex => {
    const previousindex = this.state.activeIndex;
    this.setState({ activeIndex: newIndex }, () => {
      if (newIndex != previousindex) {
        this.loadProducts(newIndex);
      }
    });
  };

  updateStateSubCategory = (index, newSubCategory) => {
    let newSubCategories = [...this.state.subCategories];
    newSubCategories[index] = newSubCategory;
    this.setState({
      subCategories: newSubCategories
    });
  };

  loadProductsFirstPage = async index => {
    let subCategory = this.state.subCategories[index];
    subCategory.products = [];
    subCategory.pageNo = 1;
    this.updateStateSubCategory(index, subCategory);
    await this.loadProducts(index);
  };

  loadProducts = async index => {
    let subCategory = this.state.subCategories[index];
    subCategory.isFetchingProducts = true;
    this.updateStateSubCategory(index, subCategory);
    try {
      const res = await getCategoryProducts({
        categoryId: this.props.category.id,
        pageNo: subCategory.pageNo,
        subCategoryId: subCategory.id
      });
      subCategory.products = res.productList;
      subCategory.pageNo = subCategory.pageNo++;
      subCategory.isFetchingProducts = false;

      this.updateStateSubCategory(index, subCategory);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  renderTabTitles() {
    return (
      <PagerTitleIndicator
        style={{ backgroundColor: "#fafafa" }}
        itemTextStyle={{
          paddingVertical: 7,
          paddingHorizontal: 14,
          fontSize: 14
        }}
        selectedItemTextStyle={{
          paddingVertical: 7,
          paddingHorizontal: 14,
          fontSize: 14,
          color: colors.mainBlue
        }}
        selectedBorderStyle={{
          backgroundColor: colors.mainBlue
        }}
        titles={this.state.subCategories.map(subCategory =>
          subCategory.name.toUpperCase()
        )}
      />
    );
  }

  render() {
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <IndicatorViewPager
          onPageSelected={page => this.onPageChange(page.position)}
          style={{ flex: 1, flexDirection: "column-reverse" }}
          indicator={this.renderTabTitles()}
        >
          {this.state.subCategories.map((subCategory, index) => (
            <View style={{ flex: 1 }} key={subCategory.id}>
              <ProductsList
                onRefresh={() => this.loadProductsFirstPage(index)}
                isLoading={subCategory.isFetchingProducts}
                products={subCategory.products}
              />
            </View>
          ))}
        </IndicatorViewPager>
      </ScreenContainer>
    );
  }
}

export default CategoryWithPager;

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
