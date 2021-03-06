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

import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

import { getCategoryProducts } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import ErrorOverlay from "../../components/error-overlay";

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
            isFetchingProducts: true,
            error: null
          };
        })
      },
      () => {
        this.loadProducts(0);
      }
    );
  }

  componentWillReceiveProps(newProps) {
    if (newProps.reloadList) {
      this.loadProducts(this.state.activeIndex);
    }
  }

  onTabChange = ({ i }) => {
    const previousindex = this.state.activeIndex;
    this.setState({ activeIndex: i }, () => {
      if (i != previousindex) {
        this.loadProducts(i);
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
    let subCategory = { ...this.state.subCategories[index] };
    subCategory.products = [];
    subCategory.pageNo = 1;
    this.updateStateSubCategory(index, subCategory);
    await this.loadProducts(index);
  };

  loadProducts = async index => {
    let subCategory = this.state.subCategories[index];
    subCategory.isFetchingProducts = true;
    subCategory.error = null;
    this.updateStateSubCategory(index, subCategory);
    try {
      const res = await getCategoryProducts({
        categoryId: this.props.category.id,
        pageNo: subCategory.pageNo,
        subCategoryId: subCategory.id
      });
      subCategory.products = res.productList;
      // subCategory.pageNo = subCategory.pageNo++;
      subCategory.isFetchingProducts = false;

      this.updateStateSubCategory(index, subCategory);
    } catch (e) {
      subCategory.isFetchingProducts = false;
      subCategory.error = e;
      this.updateStateSubCategory(index, subCategory);
    }
  };

  render() {
    if (this.state.subCategories.length == 0) {
      return null;
    }

    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <ScrollableTabView
          onChangeTab={this.onTabChange}
          renderTabBar={() => <ScrollableTabBar />}
          tabBarUnderlineStyle={{ backgroundColor: colors.mainBlue, height: 2 }}
          tabBarBackgroundColor="#fafafa"
          tabBarTextStyle={{ fontSize: 14, fontFamily: `Quicksand-Bold` }}
          tabBarActiveTextColor={colors.mainBlue}
          tabBarInactiveTextColor={colors.secondaryText}
        >
          {this.state.subCategories.map((subCategory, index) => {
            if (subCategory.error) {
              return (
                <View
                  tabLabel={subCategory.name.toUpperCase()}
                  style={{ flex: 1 }}
                  key={subCategory.id}
                >
                  <ErrorOverlay
                    error={subCategory.error}
                    onRetryPress={() => this.loadProducts(index)}
                  />
                </View>
              );
            }
            return (
              <View
                tabLabel={subCategory.name.toUpperCase()}
                style={{ flex: 1 }}
                key={subCategory.id}
              >
                <ProductsList
                  mainCategoryId={this.props.category.id}
                  categoryId={subCategory.id}
                  onRefresh={() => this.loadProductsFirstPage(index)}
                  isLoading={subCategory.isFetchingProducts}
                  products={subCategory.products}
                  navigator={this.props.navigator}
                />
              </View>
            );
          })}
        </ScrollableTabView>
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
