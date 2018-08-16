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
    isBrandsPopupVisible: false,
    checkedBrands: []
  };

  toggleBrandsPopup = () => {
    const { selectedBrands } = this.props;
    const { isBrandsPopupVisible } = this.state;
    this.setState({
      isBrandsPopupVisible: !isBrandsPopupVisible,
      checkedBrands: selectedBrands
    });
  };

  toggleBrandSelection = brand => {
    const checkedBrands = [...this.state.checkedBrands];
    const idx = checkedBrands.findIndex(brandItem => brandItem.id == brand.id);
    if (idx == -1) {
      checkedBrands.push(brand);
    } else {
      checkedBrands.splice(idx, 1);
    }
    this.setState({ checkedBrands });
  };

  applyBrandsFilter = () => {
    const checkedBrands = [...this.state.checkedBrands];
    const { setSelectedBrands = () => null } = this.props;
    this.setState({ isBrandsPopupVisible: false });
    setSelectedBrands(checkedBrands);
  };

  resetBrandsFilter = () => {
    const { setSelectedBrands = () => null } = this.props;
    setSelectedBrands([]);
    this.setState({ isBrandsPopupVisible: false, checkedBrands: [] });
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
      openAddManualItemModal,
      hideAddManually = false
    } = this.props;

    const { isBrandsPopupVisible, checkedBrands } = this.state;

    const activeMainCategory = activeMainCategoryId
      ? mainCategories.find(
          mainCategory => mainCategory.id == activeMainCategoryId
        )
      : null;

    console.log("brands: ", brands);

    const checkedBrandIds = checkedBrands.map(checkedBrand => checkedBrand.id);

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
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View
            style={{
              ...defaultStyles.card,
              flex: 1,
              margin: 10,
              marginRight: 5,
              borderRadius: 5,
              flexDirection: "row",
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
          </View>
          <TouchableOpacity
            onPress={this.toggleBrandsPopup}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              padding: 10,
              marginRight: 5
            }}
          >
            <Icon name="md-options" size={25} />
            {selectedBrands.length ? (
              <View
                style={{
                  position: "absolute",
                  top: 5,
                  right: 0,
                  backgroundColor: colors.pinkishOrange,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10 }}>
                  {selectedBrands.length}
                </Text>
              </View>
            ) : null}
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
                    height: 32,
                    paddingHorizontal: 10,
                    justifyContent: "center"
                  }}
                >
                  <Text
                    weight="Medium"
                    style={{
                      fontSize: 11,
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
                      justifyContent: "center",
                      paddingHorizontal: 5,
                      paddingVertical: 7,
                      backgroundColor:
                        item.id == activeCategoryId ? "#fff" : "transparent"
                    }}
                  >
                    <Text
                      weight="Medium"
                      style={{ fontSize: 10 }}
                      numberOfLines={2}
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
                  changeSkuItemQuantityInList={changeSkuItemQuantityInList}
                  selectActiveSkuMeasurementId={selectActiveSkuMeasurementId}
                />
              )}
              ListEmptyComponent={() => {
                if (items.length == 0 && isSearchDone) {
                  return (
                    <View style={{ padding: 20, alignItems: "center" }}>
                      <Text style={{ textAlign: "center" }}>
                        Sorry we couldn't find any items
                        {searchTerm ? ` for "${searchTerm}"` : ""}
                      </Text>
                      {searchTerm && !hideAddManually ? (
                        <Button
                          onPress={openAddManualItemModal}
                          style={{ height: 40, width: 180, marginTop: 15 }}
                          text="Add Manually"
                          color="secondary"
                        />
                      ) : null}
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
              top: 40,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            <View
              style={{
                flex: 1,
                ...defaultStyles.card,
                borderRadius: 5,
                margin: 10,
                marginTop: 10,
                overflow: "hidden"
              }}
            >
              <Text weight="Bold" style={{ fontSize: 11, padding: 10 }}>
                Filter By Brands
              </Text>
              <View
                style={{
                  flex: 1,
                  borderTopColor: "#efefef",
                  borderTopWidth: 1
                }}
              >
                <FlatList
                  data={brands}
                  extraData={brands}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => this.toggleBrandSelection(item)}
                      style={{
                        flexDirection: "row",
                        padding: 8,
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ flex: 1, fontSize: 10 }}>
                        {item.title}
                      </Text>
                      <Checkbox isChecked={checkedBrandIds.includes(item.id)} />
                    </TouchableOpacity>
                  )}
                  extraData={wishList}
                  keyExtractor={(item, index) => item.id}
                  ItemSeparatorComponent={() => (
                    <View style={{ backgroundColor: "#efefef", height: 1 }} />
                  )}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={this.applyBrandsFilter}
                  style={{
                    flex: 1,
                    height: 48,
                    backgroundColor: colors.pinkishOrange,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text weight="Bold" style={{ fontSize: 15, color: "#fff" }}>
                    Apply Filter
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.resetBrandsFilter}
                  style={{
                    flex: 1,
                    height: 48,
                    backgroundColor: colors.lighterText,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text weight="Bold" style={{ fontSize: 15, color: "#fff" }}>
                    Reset Filter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Icon
              name="md-arrow-dropup"
              size={45}
              color="#eee"
              style={{
                position: "absolute",
                right: 14,
                top: -17
              }}
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
