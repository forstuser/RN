import React from "react";
import { View } from "react-native";

import { Text } from "../../elements";
import SearchBar from "../create-shopping-list-screen";

export default class SelectCashbackItems extends React.Component {
  navigationOptions = {
    title: "Select Cashback Items in Bill"
  };

  state = {
    searchTerm: "",
    brands: [],
    selectedBrands: [],
    isSearchDone: false,
    searchError: null,
    items: [],
    isSearching: false,
    measurementTypes: []
  };

  startSearch = () => {};
  loadItems = () => {};
  updateSearchTerm = () => {};
  clearSearchTerm = () => {};
  toggleBrand = () => {};

  render() {
    const {
      searchTerm,
      brands,
      selectedBrands,
      isSearchDone,
      searchError,
      items,
      isSearching,
      measurementTypes,
      wishList = []
    } = this.state;

    return (
      <View>
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
          changeSkuItemQuantityInWishList={this.changeSkuItemQuantityInWishList}
          updateItem={this.updateItem}
        />
      </View>
    );
  }
}
