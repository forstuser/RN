import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import Modal from "react-native-modal";
import RNGooglePlaces from "react-native-google-places";
import {
  API_BASE_URL,
  getBrands,
  getCategories,
  getProductsForAsc
} from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import I18n from "../i18n";
import SelectModal from "../components/select-modal";

import { colors } from "../theme";
import { getProductMetasString } from "../utils";

const bgImage = require("../images/ic_asc_bg_image.jpg");
const crossIcon = require("../images/ic_close.png");
const dropdownIcon = require("../images/ic_dropdown_arrow.png");

class AscScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      brands: [],
      categories: [],
      selectedBrand: null,
      selectedCategoryId: null,
      selectedCategory: null,
      latitude: null,
      longitude: null,
      address: ""
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        // this.setState({
        //   selectedBrand: null,
        //   selectedCategory: null
        // });
        break;
    }
  };

  async componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("asc_screen_title")
    });
    this.fetchProducts();
    try {
      const res = await getBrands();
      this.setState({
        brands: res.brands
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  }

  fetchProducts = async () => {
    {
      const res = await getProductsForAsc();
      this.setState({
        products: res.productList
      });
    }
  };

  selectBrand = async brand => {
    this.setState(
      {
        categories: [],
        selectedBrand: brand,
        selectedCategoryId: null,
        selectedCategory: null
      },
      () => {
        this.fetchCategories();
      }
    );
  };

  fetchCategories = async () => {
    try {
      const res = await getCategories(this.state.selectedBrand.id);
      this.setState(
        {
          categories: res.categories
        },
        () => {
          if (this.state.selectedCategoryId) {
            this.setState({
              selectedCategory: this.state.categories.find(
                category =>
                  category.category_id == this.state.selectedCategoryId
              )
            });
          }
        }
      );
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onCategorySelectClick = () => {
    if (!this.state.selectedBrand) {
      Alert.alert(I18n.t("asc_screen_select_brand_first"));
    } else {
      this.setState({
        isCategoriesModalVisible: true
      });
    }
  };

  selectCategory = category => {
    this.setState({
      categoryTextInput: "",
      isCategoriesModalVisible: false,
      selectedCategory: category
    });
  };

  startSearch = () => {
    if (
      !this.state.selectedBrand ||
      !this.state.selectedCategory ||
      !this.state.latitude
    ) {
      return Alert.alert(I18n.t("asc_screen_select_fields_first"));
    }
    this.props.navigator.push({
      screen: "AscSearchScreen",
      passProps: {
        brand: this.state.selectedBrand,
        category: this.state.selectedCategory,
        latitude: this.state.latitude,
        longitude: this.state.longitude
      }
    });
  };

  onProductPress = product => {
    if (product.brand) {
      this.setState(
        {
          selectedBrand: {
            id: product.brand.brandId,
            brandName: product.brand.name
          },
          selectedCategoryId: product.categoryId
        },
        () => {
          this.fetchCategories();
        }
      );
    }
  };

  openLocationModal = () => {
    RNGooglePlaces.openPlacePickerModal()
      .then(place => {
        console.log(place);
        this.setState({
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.name
        });
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  };

  render() {
    const {
      products,
      brands,
      categories,
      selectedBrand,
      selectedCategory,
      brandTextInput,
      categoryTextInput,
      isBrandsModalVisible,
      isCategoriesModalVisible
    } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.innerContainer}>
          <Text weight="Bold" style={styles.sectionTitle}>
            {I18n.t("asc_screen_section_1_title")}
          </Text>
          {products.length > 0 && (
            <ScrollView style={styles.productsContainer} horizontal={true}>
              {products.map(product => {
                const meta = getProductMetasString(product.productMetaData);
                return (
                  <TouchableOpacity
                    key={product.key}
                    onPress={() => this.onProductPress(product)}
                    style={styles.product}
                  >
                    <Image
                      style={styles.productImage}
                      source={{ uri: API_BASE_URL + product.cImageURL + "1" }}
                    />
                    <View style={styles.productTexts}>
                      <Text numberOfLines={1} weight="Bold" style={styles.name}>
                        {product.productName}
                      </Text>
                      <View style={styles.productMetaContainer}>
                        <Text numberOfLines={2} style={styles.productMeta}>
                          {meta}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          {products.length == 0 && (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsMsg}>
                {I18n.t("asc_screen_section_no_products_msg")}
              </Text>
              <TouchableOpacity style={styles.addProductBtn}>
                <Text weight="Bold" style={styles.addProductBtnText}>
                  {I18n.t("asc_screen_section_add_product_btn")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Text weight="Bold" style={styles.sectionTitle}>
            {I18n.t("asc_screen_section_2_title")}
          </Text>
          <SelectModal
            style={styles.select}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder={I18n.t("asc_screen_placeholder_select_brand")}
            placeholderRenderer={({ placeholder }) => (
              <Text weight="Bold" style={{ color: colors.secondaryText }}>
                {placeholder}
              </Text>
            )}
            selectedOption={selectedBrand}
            options={brands}
            visibleKey="brandName"
            onOptionSelect={value => {
              this.selectBrand(value);
            }}
            hideAddNew={true}
          />

          <SelectModal
            style={styles.select}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder={I18n.t("asc_screen_placeholder_select_category")}
            placeholderRenderer={({ placeholder }) => (
              <Text weight="Bold" style={{ color: colors.secondaryText }}>
                {placeholder}
              </Text>
            )}
            selectedOption={selectedCategory}
            options={categories}
            visibleKey="category_name"
            onOptionSelect={value => {
              this.selectCategory(value);
            }}
            hideAddNew={true}
          />

          <TouchableOpacity
            onPress={this.openLocationModal}
            style={[styles.select, { flexDirection: "row", marginBottom: 35 }]}
          >
            <Text
              weight="Bold"
              style={{ color: colors.secondaryText, flex: 1 }}
            >
              {!this.state.address &&
                I18n.t("asc_screen_placeholder_select_location")}
              {this.state.address.length > 0 && this.state.address}
            </Text>
          </TouchableOpacity>
          <Button
            onPress={this.startSearch}
            style={styles.searchBtn}
            text={I18n.t("asc_screen_placeholder_search_btn")}
            color="secondary"
          />
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fafafa"
  },
  innerContainer: {
    width: "100%",
    maxWidth: 350
  },
  sectionTitle: {
    color: colors.mainBlue,
    marginBottom: 10
  },
  productsContainer: {
    marginBottom: 20,
    padding: 5
  },
  product: {
    flexDirection: "row",
    padding: 8,
    width: 240,
    height: 64,
    marginRight: 10,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    alignItems: "center"
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 16
  },
  productTexts: {
    flex: 1,
    justifyContent: "center"
  },
  productName: {
    fontSize: 14,
    color: colors.mainText
  },
  productMetaContainer: {
    paddingTop: 4
  },
  productMeta: {
    fontSize: 12,
    color: colors.mainText
  },
  noProductsContainer: {
    alignItems: "center"
  },
  noProductsMsg: {
    color: colors.secondaryText,
    fontSize: 12
  },
  addProductBtn: {
    marginTop: 7,
    backgroundColor: "#fff",
    width: 150,
    height: 35,
    marginBottom: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  addProductBtnText: {
    fontSize: 12,
    color: colors.pinkishOrange
  },
  select: {
    backgroundColor: "#fff",
    borderColor: colors.secondaryText,
    borderWidth: 1,
    height: 50,
    width: "100%",
    borderRadius: 4,
    padding: 14,
    marginBottom: 20,
    alignSelf: "center"
  },
  searchBtn: {
    width: "100%",
    alignSelf: "center"
  }
});

export default AscScreen;