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

import {
  PagerTabIndicator,
  IndicatorViewPager,
  PagerTitleIndicator,
  PagerDotIndicator
} from "rn-viewpager";

import { getCategoryProducts } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import ProductList from "../../components/product-list";
import { colors } from "../../theme";

class CategoryWithPager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      tabTitles: [],
      products: []
    };
  }
  async componentDidMount() {
    this.setState({
      tabTitles: this.props.category.subCategories.map(
        subCategory => subCategory.name
      )
    });
    this.loadProducts();
  }

  onPageChange = position => {
    const previousindex = this.state.activeIndex;
    this.setState({ activeIndex: position }, () => {
      if (this.state.activeIndex != previousindex) {
        this.loadProducts();
      }
    });
  };
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

  renderTabTitles() {
    return (
      <PagerTitleIndicator
        itemTextStyle={{
          paddingVertical: 7,
          paddingHorizontal: 14,
          fontSize: 16
        }}
        selectedItemTextStyle={{
          paddingVertical: 7,
          paddingHorizontal: 14,
          fontSize: 16,
          color: colors.mainBlue
        }}
        selectedBorderStyle={{
          backgroundColor: colors.mainBlue
        }}
        titles={this.state.tabTitles}
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
          {this.props.category.subCategories.map((subCategory, index) => (
            <View style={{ flex: 1 }} key={subCategory.id}>
              {index === this.state.activeIndex && (
                <ProductList products={this.state.products} />
              )}
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
