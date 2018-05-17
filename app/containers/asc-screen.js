import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
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
  getProductsForAsc,
  ascAccessed
} from "../api";
import { Text, Button, ScreenContainer, Image } from "../elements";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

import SelectModal from "../components/select-modal";
import LoadingOverlay from "../components/loading-overlay";

import Analytics from "../analytics";
import { colors } from "../theme";
import { getProductMetasString } from "../utils";
import ErrorOverlay from "../components/error-overlay";
import { SCREENS } from "../constants";

const crossIcon = require("../images/ic_close.png");
const dropdownIcon = require("../images/ic_dropdown_arrow.png");

class AscScreen extends Component {
  static navigationOptions = {
    title: I18n.t("asc_screen_title")
  };
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingProducts: false,
      isFetchingBrands: false,
      isFetchingCategories: false,
      products: [],
      brands: [],
      categories: [],
      selectedBrand: null,
      selectedCategoryId: null,
      selectedCategory: null,
      latitude: null,
      longitude: null,
      address: "",
      clearSelectedValuesOnScreenAppear: true
    };
    // this.props.navigation.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.fetchProducts();
        if (this.state.clearSelectedValuesOnScreenAppear) {
          this.setState({
            selectedBrand: null,
            selectedCategory: null
          });
        }
        this.setState({
          clearSelectedValuesOnScreenAppear: true
        });
        break;
    }
  };

  async componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.OPEN_ASC_SCREEN);

    if (this.props.screenOpts) {
      const screenOpts = this.props.screenOpts;
      if (screenOpts.hitAccessApi) {
        await ascAccessed();
      }
    }

    this.fetchBrands();
  }

  fetchBrands = async () => {
    this.setState({
      isFetchingBrands: true
    });
    try {
      const res = await getBrands();
      this.setState({
        brands: res.brands.filter(brand => brand.id > 0)
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    } finally {
      this.setState({
        isFetchingBrands: false
      });
    }
  };

  fetchProducts = async () => {
    this.setState({
      isFetchingProducts: true
    });
    try {
      const res = await getProductsForAsc();
      this.setState({
        products: res.productList,
        error: null,
        isFetchingData: false
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    } finally {
      this.setState({
        isFetchingProducts: false
      });
    }
  };

  selectBrand = async brand => {
    this.setState(
      {
        categories: [],
        selectedBrand: brand,
        selectedCategoryId: null,
        selectedCategory: null,
        error: null
      },
      () => {
        this.fetchCategories();
      }
    );
  };

  fetchCategories = async () => {
    this.setState({
      isFetchingCategories: true
    });
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
      showSnackbar({
        text: e.message
      });
    } finally {
      this.setState({
        isFetchingCategories: false
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
    if (!this.state.selectedBrand || !this.state.selectedCategory) {
      return showSnackbar({
        text: I18n.t("asc_screen_select_fields_first")
      });
    }

    if (!this.state.latitude) {
      return showSnackbar({
        text: I18n.t("asc_screen_select_location")
      });
    }

    Analytics.logEvent(Analytics.EVENTS.SEARCH_ASC, {
      brand_name: this.state.selectedBrand.brandName,
      category_name: this.state.selectedCategory.category_name
    });

    this.props.navigation.push({
      screen: SCREENS.ASC_SEARCH_SCREEN,
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
        this.setState({
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.address || place.name
        });
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  };

  openAddProductScreen = () => {
    this.props.navigation.push({
      screen: SCREENS.ADD_PRODUCT_SCREEN,
      overrideBackPress: true
    });
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
      isCategoriesModalVisible,
      isFetchingBrands,
      isFetchingCategories,
      isFetchingProducts
    } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <View collapsable={false} style={styles.body}>
          <View collapsable={false} style={styles.productsPart}>
            <Text weight="Bold" style={styles.sectionTitle}>
              {I18n.t("asc_screen_section_1_title")}
            </Text>
            {products.length > 0 ? (
              <ScrollView style={styles.productsContainer} horizontal={true}>
                {products.map((product, index) => {
                  const meta = getProductMetasString(product.productMetaData);
                  return (
                    <TouchableOpacity
                      key={product.key}
                      onPress={() => this.onProductPress(product)}
                      style={styles.product}
                    >
                      <Image
                        style={styles.productImage}
                        source={{ uri: API_BASE_URL + product.cImageURL }}
                      />
                      <View
                        collapsable={false}
                        key={index}
                        style={styles.productTexts}
                      >
                        <Text
                          numberOfLines={1}
                          weight="Bold"
                          style={styles.name}
                        >
                          {product.productName || product.categoryName}
                        </Text>
                        <View
                          collapsable={false}
                          style={styles.productMetaContainer}
                        >
                          <Text numberOfLines={2} style={styles.productMeta}>
                            {meta}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <View collapsable={false} style={styles.noProductsContainer}>
                <Text style={styles.noProductsMsg}>
                  {I18n.t("asc_screen_section_no_products_msg")}
                </Text>
                <TouchableOpacity
                  onPress={this.openAddProductScreen}
                  style={styles.addProductBtn}
                >
                  <Text weight="Bold" style={styles.addProductBtnText}>
                    {I18n.t("asc_screen_section_add_product_btn")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View collapsable={false} style={styles.selectsPart}>
            <Text weight="Bold" style={styles.sectionTitle}>
              {I18n.t("asc_screen_section_2_title")}
            </Text>
            <SelectModal
              // style={styles.select}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder={I18n.t("asc_screen_placeholder_select_brand")}
              placeholderRenderer={({ placeholder }) => (
                <Text weight="Bold" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              )}
              beforeModalOpen={() => {
                this.setState({ clearSelectedValuesOnScreenAppear: false });
                return true;
              }}
              selectedOption={selectedBrand}
              options={brands.map((brand, index) => ({
                ...brand,
                image: `${API_BASE_URL}/brands/${brand.id}/images`,
                key: { index }
              }))}
              imageKey="image"
              visibleKey="brandName"
              onOptionSelect={value => {
                this.selectBrand(value);
              }}
              hideAddNew={true}
            />

            <SelectModal
              // style={styles.select}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder={I18n.t("asc_screen_placeholder_select_category")}
              placeholderRenderer={({ placeholder }) => (
                <Text weight="Bold" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              )}
              beforeModalOpen={() => {
                if (!this.state.selectedBrand) {
                  showSnackbar({
                    text: I18n.t("asc_screen_select_brand_first")
                  });
                  return false;
                }
                this.setState({ clearSelectedValuesOnScreenAppear: false });
                return true;
              }}
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
              style={[
                styles.select,
                { flexDirection: "row", marginBottom: 35 }
              ]}
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
        </View>
        <LoadingOverlay
          visible={
            isFetchingBrands || isFetchingCategories || isFetchingProducts
          }
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    alignItems: "center",
    backgroundColor: "#fafafa"
  },
  header: {
    width: "100%",
    ...Platform.select({
      ios: {
        zIndex: 1
      },
      android: {}
    })
  },
  body: {
    padding: 16,
    width: "100%",
    flex: 1,
    overflow: "hidden"
  },
  sectionTitle: {
    color: colors.mainBlue,
    marginBottom: 10
  },
  productsContainer: {
    marginBottom: 20,
    padding: 5,
    height: 100
  },
  product: {
    flexDirection: "row",
    padding: 8,
    width: 240,
    height: 64,
    margin: 5,
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
  selectsPart: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 350,
    alignSelf: "center"
  },
  select: {
    height: "auto",
    backgroundColor: "white",
    borderColor: "transparent",
    overflow: "hidden",
    shadowColor: "black",
    padding: 8,
    paddingBottom: 15,
    paddingTop: 10,
    marginBottom: 12,
    alignSelf: "center",
    elevation: 2
  },
  searchBtn: {
    width: 300,
    alignSelf: "center"
  }
});

export default AscScreen;
