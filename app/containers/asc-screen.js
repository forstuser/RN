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
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
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
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <View style={{ flex: 1 }}>
          <Image
            style={{
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
            resizeMode="cover"
            source={bgImage}
          />
          <View style={styles.titlesContainer}>
            <Text weight="Medium" style={styles.title}>
              {I18n.t("asc_screen_title")}
            </Text>
            <Text weight="Medium" style={styles.subTitle}>
              {I18n.t("asc_screen_sub_title")}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, padding: 20, alignContent: "center" }}>
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
          <Button
            onPress={this.startSearch}
            style={{ marginTop: 20, width: "100%" }}
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
  titlesContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%"
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
  },
  select: {
    backgroundColor: "#fff",
    borderColor: colors.secondaryText,
    borderWidth: 1,
    height: 50,
    width: 320,
    borderRadius: 4,
    padding: 14,
    marginBottom: 20
  },
  selectText: {
    flex: 1
  },
  dropdownIcon: {
    width: 20,
    height: 20
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 5,
    flex: 1,
    margin: 0
  },
  modalHeader: {
    flexDirection: "row",
    height: 56,
    alignItems: "center",
    borderColor: "#eee",
    borderBottomWidth: 1
  },
  modalClose: {
    paddingVertical: 16,
    paddingHorizontal: 12
  },
  crossIcon: {
    width: 24,
    height: 24
  },
  textInput: {
    flex: 1
  },
  selectOption: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 1
  }
});
