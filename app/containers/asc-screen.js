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
        this.setState({
          selectedBrand: null,
          selectedCategory: null
        });
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
      Alert.alert("Please select brand first");
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
      return Alert.alert("Please select brand and product first");
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
              Authorised Service Centres
            </Text>
            <Text weight="Medium" style={styles.subTitle}>
              Get your device serviced by certified professionals
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, padding: 20, alignContent: "center" }}>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                isBrandsModalVisible: true
              })
            }
            style={styles.select}
          >
            <Text style={styles.selectText}>
              {!selectedBrand && "Select a Brand"}
              {selectedBrand && selectedBrand.brandName}
            </Text>
            <Image style={styles.dropdownIcon} source={dropdownIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onCategorySelectClick}
            style={styles.select}
          >
            <Text style={styles.selectText}>
              {!selectedCategory && "Select a Product"}
              {selectedCategory && selectedCategory.category_name}
            </Text>
            <Image style={styles.dropdownIcon} source={dropdownIcon} />
          </TouchableOpacity>
          <Button
            onPress={this.startSearch}
            style={{ marginTop: 20, width: "100%" }}
            text="Search Now"
            color="secondary"
          />
        </View>
        <Modal useNativeDriver={true} isVisible={isBrandsModalVisible}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isBrandsModalVisible: false
                  });
                }}
                style={styles.modalClose}
              >
                <Image style={styles.crossIcon} source={crossIcon} />
              </TouchableOpacity>
              <TextInput
                value={brandTextInput}
                onChangeText={text => this.setState({ brandTextInput: text })}
                style={styles.textInput}
                placeholder="Type here to search brand"
              />
            </View>
            <ScrollView style={{ backgroundColor: "#ececec" }}>
              {brands.map(brand => {
                if (
                  !brandTextInput ||
                  brand.brandName
                    .toLowerCase()
                    .includes(brandTextInput.toLowerCase())
                ) {
                  return (
                    <TouchableOpacity
                      onPress={() => this.selectBrand(brand)}
                      key={brand.id}
                      style={styles.selectOption}
                    >
                      <Text>{brand.brandName}</Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </ScrollView>
          </View>
        </Modal>

        <Modal useNativeDriver={true} isVisible={isCategoriesModalVisible}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    isCategoriesModalVisible: false
                  });
                }}
                style={styles.modalClose}
              >
                <Image style={styles.crossIcon} source={crossIcon} />
              </TouchableOpacity>
              <TextInput
                value={categoryTextInput}
                onChangeText={text =>
                  this.setState({ categoryTextInput: text })
                }
                style={styles.textInput}
                placeholder="Type here to search product"
              />
            </View>
            <ScrollView style={{ backgroundColor: "#ececec" }}>
              {categories.map(category => {
                if (
                  !categoryTextInput ||
                  category.category_name
                    .toLowerCase()
                    .includes(categoryTextInput.toLowerCase())
                ) {
                  return (
                    <TouchableOpacity
                      onPress={() => this.selectCategory(category)}
                      key={category.category_id}
                      style={styles.selectOption}
                    >
                      <Text>{category.category_name}</Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </ScrollView>
          </View>
        </Modal>
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
    flexDirection: "row",
    borderColor: "#ececec",
    borderWidth: 1,
    padding: 16,
    borderRadius: 4,
    marginBottom: 20,
    alignItems: "center"
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
