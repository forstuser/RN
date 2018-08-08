import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

import Checkbox from "../../components/checkbox";
import LoadingOverlay from "../../components/loading-overlay";

import SkuItem from "./sku-item";

export default class SearchBar extends React.Component {
  state = {
    isBrandsPopupVisible: false
  };

  toggleBrandsPopup = () => {
    const { items = [] } = this.props;
    const { isBrandsPopupVisible } = this.state;
    this.setState({ isBrandsPopupVisible: !isBrandsPopupVisible });
    // if (!isBrandsPopupVisible) {
    //   this.setState({ isBrandsPopupVisible: true });
    // } else {
    //   this.setState({ isBrandsPopupVisible: false });
    // }
  };

  startSearch = () => {
    const { searchTerm = "", loadItems = () => null } = this.props;

    if (searchTerm.length > 2) {
      loadItems();
    }
  };

  render() {
    const {
      mainCategories = [],
      activeMainCategoryId = null,
      activeCategoryId = null,
      updateMainCategoryIdInParent = () => null,
      updateCategoryIdInParent = () => null,
      onSearchTextChange = () => null,
      clearSearchTerm = () => null,
      searchTerm = "",
      brands = [],
      selectedBrands = [],
      measurementTypes,
      isSearching = false,
      isSearchDone = false,
      searchError = null,
      items = [],
      wishList,
      addSkuItemToList,
      changeSkuItemQuantityInList,
      toggleBrand = () => null,
      updateItem,
      openAddManualItemModal
    } = this.props;

    const activeMainCategory = activeMainCategoryId
      ? mainCategories.find(
          mainCategory => mainCategory.id == activeMainCategoryId
        )
      : null;

    console.log("brands: ", brands);

    const { isBrandsPopupVisible } = this.state;

    const selectedBrandIds = selectedBrands.map(
      selectedBrand => selectedBrand.id
    );

    selectActiveSkuMeasurementId = (item, skuMeasurementId) => {
      const itemIdx = items.findIndex(listItem => listItem.id == item.id);
      if (itemIdx > -1) {
        updateItem(itemIdx, {
          ...items[itemIdx],
          activeSkuMeasurementId: skuMeasurementId
        });
      }
    };

    return (
      <View
        style={{
          backgroundColor: "#fff",
          flex: 1
        }}
      >
        <View
          style={{
            margin: 10,
            flexDirection: "row",
            borderRadius: 5,
            ...defaultStyles.card,
            alignItems: "center"
          }}
        >
          <TextInput
            style={{
              flex: 1,
              height: 36,
              padding: 10
            }}
            value={searchTerm}
            placeholder="Search"
            onChangeText={text => onSearchTextChange(text)}
            returnKeyType="search"
            onSubmitEditing={this.startSearch}
            underlineColorAndroid="transparent"
          />
          {searchTerm ? (
            <TouchableOpacity
              onPress={clearSearchTerm}
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                backgroundColor: colors.secondaryText,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 5
              }}
            >
              <Icon name="md-close" size={15} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <TouchableOpacity
            onPress={this.toggleBrandsPopup}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              backgroundColor: colors.pinkishOrange,
              padding: 10
            }}
          >
            <Text
              weight="Medium"
              style={{ color: "#fff", fontSize: 10, marginRight: 5 }}
            >
              {selectedBrands.length == 0
                ? "All Brands"
                : selectedBrands[0].title +
                  (selectedBrands.length > 1
                    ? "+" + String(selectedBrands.length - 1)
                    : "")}
            </Text>
            <Icon
              name="ios-arrow-down"
              color="#fff"
              size={15}
              style={{ marginTop: 2 }}
            />
          </TouchableOpacity>
        </View>
        {mainCategories.length > 0 && !searchTerm ? (
          <View
            style={{
              height: 30,
              backgroundColor: colors.lightBlue,
              borderBottomColor: "#ddd",
              borderBottomWidth: 1
            }}
          >
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={mainCategories}
              extraData={activeMainCategoryId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    updateMainCategoryIdInParent(item.id);
                  }}
                  style={{
                    height: 30,
                    paddingHorizontal: 10,
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color:
                        item.id == activeMainCategoryId
                          ? colors.mainBlue
                          : colors.mainText
                    }}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null}
        <View
          style={{
            flex: 1,
            flexDirection: "row"
          }}
        >
          {activeMainCategory &&
          activeMainCategory.categories &&
          !searchTerm ? (
            <View
              style={{
                flex: 1,
                backgroundColor: colors.lightBlue,
                height: "100%"
              }}
            >
              <FlatList
                data={activeMainCategory.categories}
                extraData={activeCategoryId}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      updateCategoryIdInParent(item.id);
                    }}
                    style={{
                      height: 30,
                      justifyContent: "center",
                      paddingHorizontal: 5,
                      backgroundColor:
                        item.id == activeCategoryId ? "#fff" : "transparent"
                    }}
                  >
                    <Text
                      weight="Medium"
                      style={{ fontSize: 10 }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : (
            <View />
          )}

          <View style={{ flex: 2, height: "100%" }}>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <SkuItem
                  measurementTypes={measurementTypes}
                  item={item}
                  wishList={wishList}
                  addSkuItemToList={addSkuItemToList}
                  changeSkuItemQuantityInList={
                    changeSkuItemQuantityInList
                  }
                  selectActiveSkuMeasurementId={selectActiveSkuMeasurementId}
                />
              )}
              ListEmptyComponent={() => {
                if (items.length == 0 && isSearchDone) {
                  return (
                    <View style={{ padding: 20, alignItems: "center" }}>
                      <Text style={{ textAlign: "center" }}>
                        Sorry we couldn't find any items{searchTerm
                          ? ` for "${searchTerm}"`
                          : ""}
                      </Text>
                      <Button
                        onPress={openAddManualItemModal}
                        style={{ height: 40, width: 180, marginTop: 15 }}
                        text="Add Manually"
                        color="secondary"
                      />
                    </View>
                  );
                } else if (items.length == 0 && !isSearchDone) {
                  return (
                    <View style={{ paddingLeft: 10 }}>
                      <Text style={{ color: colors.secondaryText }}>
                        {searchTerm.length < 3
                          ? "Enter atleast 3 characters and then "
                          : ""}
                        Press 'Search' to start searching
                      </Text>
                    </View>
                  );
                }
                return null;
              }}
              extraData={wishList}
              keyExtractor={(item, index) => item.id}
            />
          </View>
        </View>
        {isBrandsPopupVisible ? (
          <View
            style={{
              position: "absolute",
              top: 50,
              right: 10,
              ...defaultStyles.card,
              borderRadius: 5,
              minHeight: 150,
              maxHeight: 350
            }}
          >
            <FlatList
              data={brands}
              extraData={brands}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleBrand(item)}
                  style={{
                    flexDirection: "row",
                    padding: 8,
                    width: 150,
                    alignItems: "center"
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 10 }}>{item.title}</Text>
                  <Checkbox isChecked={selectedBrandIds.includes(item.id)} />
                </TouchableOpacity>
              )}
              extraData={wishList}
              keyExtractor={(item, index) => item.id}
              ItemSeparatorComponent={() => (
                <View style={{ backgroundColor: "#efefef", height: 1 }} />
              )}
            />
          </View>
        ) : (
          <View />
        )}
        <LoadingOverlay visible={isSearching} />
      </View>
    );
  }
}
