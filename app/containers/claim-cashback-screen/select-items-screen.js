import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text } from "../../elements";
import SearchBar from "../create-shopping-list-screen/search-bar";
import { defaultStyles, colors } from "../../theme";

export default class SelectCashbackItems extends React.Component {
  static navigationOptions = {
    title: "Select Cashback Items in Bill"
  };

  state = {
    searchTerm: "",
    brands: [],
    selectedBrands: [],
    isSearchDone: false,
    searchError: null,
    items: [],
    selectedItems: [],
    isSearching: false,
    measurementTypes: []
  };

  startSearch = () => {};
  loadItems = () => {};
  updateSearchTerm = () => {};
  clearSearchTerm = () => {};
  toggleBrand = () => {};

  render() {
    const { navigation } = this.props;
    const wishlist = navigation.getParam("wishlist", []);
    const pastItems = navigation.getParam("pastItems", []);

    const {
      searchTerm,
      brands,
      selectedBrands,
      isSearchDone,
      searchError,
      items,
      selectedItems,
      isSearching,
      measurementTypes,
      wishList = []
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <SearchBar
            searchTerm={searchTerm}
            loadItems={this.loadItems}
            onSearchTextChange={this.updateSearchTerm}
            clearSearchTerm={this.clearSearchTerm}
            brands={brands}
            selectedBrands={selectedBrands}
            toggleBrand={this.toggleBrand}
            isSearchDone={isSearchDone}
            searchError={searchError}
            items={items}
            isSearching={isSearching}
            measurementTypes={measurementTypes}
            wishList={wishList}
            addSkuItemToList={this.addSkuItemToList}
            changeSkuItemQuantityInWishList={
              this.changeSkuItemQuantityInWishList
            }
            updateItem={this.updateItem}
          />
        </View>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              alignSelf: "center",
              ...defaultStyles.card,
              borderRadius: 19,
              alignItems: "center"
            }}
          >
            <Icon
              name="ios-arrow-down"
              size={28}
              color={colors.pinkishOrange}
            />
          </View>
          <View style={{ flex: 1, ...defaultStyles.card, marginTop: -16 }}>
            <Text>{selectedItems.length} Items Selected</Text>
          </View>
        </View>
      </View>
    );
  }
}
