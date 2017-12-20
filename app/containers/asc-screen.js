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
import { getBrands, getCategories } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import I18n from "../i18n";
import SelectModal from "../components/select-modal";

import { colors } from "../theme";

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
      selectedCategory: null,
      isBrandsModalVisible: false,
      isCategoriesModalVisible: false,
      brandTextInput: "",
      categoryTextInput: ""
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
    try {
      const res = await getBrands();
      this.setState({
        brands: res.brands
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  }

  selectBrand = async brand => {
    this.setState({
      products: [],
      categories: [],
      selectedBrand: brand,
      selectedCategory: null,
      isBrandsModalVisible: false,
      brandTextInput: "",
      categoryTextInput: ""
    });
    try {
      const res = await getCategories(brand.id);
      this.setState({
        categories: res.categories
      });
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
    if (!this.state.selectedBrand || !this.state.selectedCategory) {
      return Alert.alert(I18n.t("asc_screen_select_brand_first"));
    }
    this.props.navigator.push({
      screen: "AscSearchScreen",
      passProps: {
        brand: this.state.selectedBrand,
        category: this.state.selectedCategory
      }
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
              <Text />
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
            // onPress={onUploadBillPress}
            style={[styles.select, { flexDirection: "row", marginBottom: 35 }]}
          >
            <Text
              weight="Bold"
              style={{ color: colors.secondaryText, flex: 1 }}
            >
              {I18n.t("asc_screen_placeholder_select_location")}
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

export default AscScreen;

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
    marginTop: 20,
    width: "100%",
    alignSelf: "center"
  }
});
