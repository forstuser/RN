import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import _ from "lodash";
import { API_BASE_URL } from "../../api";

import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

import LoadingOverlay from "../../components/loading-overlay";
import { MAIN_CATEGORY_IDS_SHOP_N_EARN } from "../../constants";

import SkuItem from "./sku-item";
import { showSnackbar } from "../../utils/snackbar";
import FilterModal from "./filter-modal";

export default class SearchBar extends React.Component {
  state = {
    isBrandsPopupVisible: false,
    checkedBrands: [],
    checkedSellers: [],
    isModalVisible: false
  };

  hideFilter = () => {
    this.setState({ isBrandsPopupVisible: false });
  };

  toggleBrandsPopup = () => {
    const { selectedBrands } = this.props;
    const { isBrandsPopupVisible } = this.state;
    this.setState({
      isBrandsPopupVisible: !isBrandsPopupVisible,
      checkedBrands: selectedBrands
    });
    this.searchInput.blur();
  };
  toggleSellersPopup = () => {
    let { selectedSeller } = this.props;
    if (selectedSeller == null) {
      selectedSeller = "";
    }
    const { isBrandsPopupVisible } = this.state;
    this.setState({
      isBrandsPopupVisible: !isBrandsPopupVisible,
      checkedSellers: [selectedSeller]
    });
    this.searchInput.blur();
  };

  toggleBrandSelection = brand => {
    const checkedBrands = [...this.state.checkedBrands];
    const idx = checkedBrands.findIndex(
      brandItem => brandItem.brand_id == brand.brand_id
    );
    if (idx == -1) {
      checkedBrands.push(brand);
    } else {
      checkedBrands.splice(idx, 1);
    }
    this.setState({ checkedBrands });
  };

  toggleSellerSelection = seller => {
    let checkedSellers = [...this.state.checkedSellers];
    if (seller) {
      const idx = checkedSellers.findIndex(
        sellerItem => sellerItem.id == seller.id
      );
      if (idx == -1) {
        checkedSellers = [seller];
      } else {
        checkedSellers = [];
      }
    } else {
      checkedSellers = [];
    }
    this.setState({ checkedSellers });

    const { setSelectedSellers = () => null } = this.props;
    this.setState({ isBrandsPopupVisible: false });
    setSelectedSellers(checkedSellers);
    this.filterModal.hide();
  };

  applyBrandsFilter = () => {
    const checkedBrands = [...this.state.checkedBrands];
    const { setSelectedBrands = () => null } = this.props;
    this.setState({ isBrandsPopupVisible: false });
    setSelectedBrands(checkedBrands);
    this.filterModal.hide();
  };

  applySellersFilter = () => {
    const checkedSellers = [...this.state.checkedSellers];
    const { setSelectedSellers = () => null } = this.props;
    this.setState({ isBrandsPopupVisible: false });
    setSelectedSellers(checkedSellers);
    this.filterModal.hide();
  };

  resetBrandsFilter = () => {
    const {
      setSelectedBrands = () => null
      // setSelectedSellers = () => null
    } = this.props;
    setSelectedBrands([], true);
    this.setState(
      {
        isBrandsPopupVisible: false,
        checkedBrands: []
        // checkedSellers: []
      },
      () => {
        this.applyBrandsFilter();
      }
    );

    this.filterModal.hide();
  };

  startSearch = () => {
    console.log("start search");
  };

  addManualItem = () => {
    const {
      addManualItemsToList = () => null,
      searchTerm = "",
      onSearchTextChange = () => null
    } = this.props;
    addManualItemsToList([{ title: searchTerm, quantity: 1 }]);
    onSearchTextChange("");
    showSnackbar({ text: "Item added to the list" });
  };

  changeMainCategory = id => {
    const { updateMainCategoryIdInParent } = this.props;
    if (this.categoryScrollView) {
      this.categoryScrollView.scrollTo({ x: 0, y: 0, animated: false });
    }
    updateMainCategoryIdInParent(id);
  };
  loadNextItems = () => {
    if (
      this.props.endhasReachedFlag == false &&
      this.props.activeMainCategoryId != 0
    ) {
      this.props.loadItems();
    }
  };

  render() {
    let {
      mainCategories = [],
      sellerMainCategories = [],
      activeMainCategoryId = null,
      selectedCategoryIds = [],
      updateMainCategoryIdInParent = () => null,
      updateCategoryIdInParent = () => null,
      onSearchTextChange = () => null,
      clearSearchTerm = () => null,
      searchTerm = "",
      brands = [],
      selectedBrands = [],
      selectedSeller,
      measurementTypes,
      isSearching = false,
      isSearchDone = false,
      searchError = null,
      items = [],
      pastItems = [],
      wishList = [],
      skuItemIdsCurrentlyModifying = [],
      addSkuItemToList,
      changeSkuItemQuantityInList,
      toggleBrand = () => null,
      updateItem,
      openAddManualItemModal,
      addManualItemsToList = () => null,
      hideAddManually = false,
      sellers = [],
      hideSellerFilter = false,
      loadItems,
      endhasReachedFlag,
      hideBrands
    } = this.props;
    const { isBrandsPopupVisible, checkedBrands, checkedSellers } = this.state;
    // console.log("past items 2", pastItems);
    // console.log("items 2", items);
    // console.log("selectedCategoryIds 2", selectedCategoryIds);
    //console.log("active main category id 2", activeMainCategoryId);
    // console.log("measurementTypes 2", measurementTypes);
    // console.log("Brands___________", brands);
    const activeMainCategory = activeMainCategoryId
      ? mainCategories.find(
          mainCategory => mainCategory.id == activeMainCategoryId
        )
      : null;
    console.log("active main cat", activeMainCategory);
    const checkedBrandIds = checkedBrands.map(
      checkedBrand => checkedBrand.brand_id
    );
    const checkedSellerIds = checkedSellers.map(
      checkedSeller => checkedSeller.id
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

    const filteredItems = items
      .filter(item => {
        if (searchTerm && searchTerm.length > 3) {
          return item.title.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          return true;
        }
      })
      .sort((a, b) => {
        var nameA = a.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.title.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      })
      .sort((a, b) => {
        let cashbackOfA = 0;
        let cashbackOfB = 0;

        if (a.sku_measurements) {
          const skuMeasurement =
            a.sku_measurements[a.sku_measurements.length - 1];
          if (skuMeasurement) {
            cashbackOfA =
              (skuMeasurement.mrp * skuMeasurement.cashback_percent) / 100;
          }
        }

        if (b.sku_measurements) {
          const skuMeasurement =
            b.sku_measurements[b.sku_measurements.length - 1];
          if (skuMeasurement) {
            cashbackOfB =
              (skuMeasurement.mrp * skuMeasurement.cashback_percent) / 100;
          }
        }

        return cashbackOfB - cashbackOfA;
      });

    // let filteredMainCategories = mainCategories;
    // if (sellerMainCategories.length > 0) {
    //   const sellerMainCategoryIds = sellerMainCategories.map(
    //     mainCategory => mainCategory.main_category_id
    //   );
    //   filteredMainCategories = mainCategories.filter(mainCategory =>
    //     sellerMainCategoryIds.includes(mainCategory.id)
    //   );
    // }

    let filteredCategories = [];
    if (
      activeMainCategory &&
      activeMainCategory.categories &&
      activeMainCategory.categories.length > 0
    ) {
      if (sellerMainCategories.length == 0) {
        filteredCategories = activeMainCategory.categories;
      } else {
        // console.log("sellerMainCategories in search bar", sellerMainCategories);
        // console.log("activeMainCategory in search bar", activeMainCategory);
        const activeMainCategoryFromSellersMainCategories =
          sellerMainCategories.find(
            mainCategory => mainCategory.id == activeMainCategory.id
          ) || [];
        // console.log(
        //   "activeMainCategoryFromSellersMainCategories in Search Bar",
        //   activeMainCategoryFromSellersMainCategories
        // );
        filteredCategories =
          activeMainCategoryFromSellersMainCategories.categories;
        // console.log("get categories form parent is", sellerMainCategories);
        // filteredCategories = sellerCategoryIds;
        // activeMainCategoryFromSellersMainCategories.length > 0
        //   ? activeMainCategoryFromSellersMainCategories.categories.map(
        //       categoryBrand => categoryBrand.id
        //     )
        //   : [];
        // console.log("sellerCategoryIds in search bar", sellerCategoryIds);

        // filteredCategories = activeMainCategory.categories.filter(category =>
        //   sellerCategoryIds.includes(category.id)
        // );
      }
    }
    if (filteredCategories.length > 0) {
      filteredCategories = filteredCategories.filter(
        categorySkuCount => parseFloat(categorySkuCount.sku_counts) > 0
      );
    }
    console.log("filteredCategories_________________: ", filteredCategories);
    // console.log(
    //   "filteredMainCategories___________________: ",
    //   filteredMainCategories
    // );

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
              ref={node => {
                this.searchInput = node;
              }}
              style={{
                flex: 1,
                height: 36,
                padding: 10
              }}
              value={searchTerm}
              placeholder="Search"
              onFocus={() => {
                this.setState({ isBrandsPopupVisible: false });
              }}
              onChangeText={text => onSearchTextChange(text)}
              returnKeyType="search"
              onSubmitEditing={this.startSearch}
              underlineColorAndroid="transparent"
            />
            {/* {filteredItems.length == 0 &&
            searchTerm.length > 2 &&
            !isSearching &&
            !hideAddManually ? (
              <TouchableOpacity
                onPress={this.addManualItem}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10
                }}
              >
                <Icon name="md-add" size={25} color={colors.pinkishOrange} />
              </TouchableOpacity>
            ) : (
              <View />
            )} */}

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
            onPress={() => {
              this.toggleBrandsPopup();
              // this.toggleSellersPopup();
            }}
            disabled={
              (brands && brands.length == 0) ||
              ((activeMainCategoryId == 0 ||
                activeMainCategoryId ==
                  MAIN_CATEGORY_IDS_SHOP_N_EARN.FRUIT_N_VEG) &&
                searchTerm.length < 3)

              // activeMainCategoryId ==
              //   MAIN_CATEGORY_IDS_SHOP_N_EARN.FRUIT_N_VEG ||
              //   searchTerm.length < 3
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              padding: 10,
              marginRight: 5
            }}
          >
            <Icon
              name="md-options"
              size={25}
              color={
                (brands && brands.length == 0) ||
                ((activeMainCategoryId == 0 ||
                  activeMainCategoryId ==
                    MAIN_CATEGORY_IDS_SHOP_N_EARN.FRUIT_N_VEG) &&
                  searchTerm.length < 3) // ||
                  ? // (activeMainCategoryId ==
                    //   MAIN_CATEGORY_IDS_SHOP_N_EARN.FRUIT_N_VEG ||
                    //   searchTerm.length < 3)
                    colors.lighterText
                  : colors.mainText
              }
            />
            {selectedBrands && selectedBrands.length > 0 ? (
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

        {filteredCategories && filteredCategories.length > 0 && !searchTerm && (
          <View style={{ height: 34, paddingHorizontal: 5, marginBottom: 7 }}>
            <ScrollView
              ref={node => {
                this.categoryScrollView = node;
              }}
              horizontal
              style={{}}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{}}
            >
              {filteredCategories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => {
                    updateCategoryIdInParent(category.id);
                  }}
                  style={{
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    height: 24,
                    margin: 5,
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: selectedCategoryIds.includes(category.id)
                      ? colors.pinkishOrange
                      : "#fff",
                    borderColor: colors.pinkishOrange,
                    borderWidth: 1
                  }}
                >
                  <Text
                    weight="Medium"
                    style={{
                      fontSize: 12,
                      color: selectedCategoryIds.includes(category.id)
                        ? "#fff"
                        : "#777777",
                      ...Platform.select({
                        android: {
                          marginTop: -2
                        }
                      })
                    }}
                    numberOfLines={1}
                  >
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            borderTopColor: "#cee9f6",
            borderTopWidth: 2
          }}
        >
          {sellerMainCategories &&
          sellerMainCategories.length > 0 &&
          !searchTerm ? (
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRightColor: "#cee9f6",
                borderRightWidth: 2,
                height: "100%"
              }}
            >
              <FlatList
                data={sellerMainCategories}
                extraData={activeMainCategoryId}
                renderItem={({ item }) => {
                  // console.log(
                  //   "URL____________",
                  //   API_BASE_URL + `/categories/${item.id}/images/1/thumbnail`
                  // );
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.changeMainCategory(item.id);
                      }}
                      style={{
                        flexDirection: "column",
                        paddingHorizontal: 10,
                        paddingVertical: 14,
                        borderBottomWidth: 2,
                        borderBottomColor: "#cee9f6",
                        backgroundColor:
                          item.id == activeMainCategoryId
                            ? "#d8edf7"
                            : "transparent"
                      }}
                    >
                      <View
                        style={{
                          flex: 2,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Image
                          style={{
                            height: 70,
                            width: "100%"
                            // padding: 5,
                            // borderBottomWidth: 2,
                            // borderRadius: 20,
                            // borderBottomColor: "#cee9f6"
                          }}
                          resizeMode="contain"
                          source={
                            item.title == "Past Items"
                              ? require("../../images/past_items.png")
                              : item.title == "SHOPPING LIST"
                              ? require("../../images/shopping_list.png")
                              : {
                                  uri:
                                    API_BASE_URL +
                                    `/categories/${item.id}/images/1/thumbnail`
                                }
                          }
                          //source={require("../../images/binbill_logo.png")}
                        />
                      </View>
                      <View
                        style={{
                          flex: 3,
                          // marginTop: 2,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Text
                          weight="Medium"
                          style={{
                            fontSize: 12,
                            marginTop: 5,
                            textTransform: "capitalize",
                            textAlign: "center"
                          }}
                          numberOfLines={3}
                        >
                          {item.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          ) : (
            <View />
          )}

          <View style={{ flex: 2, height: "100%" }}>
            <FlatList
              onEndReachedThreshold={0.5}
              onEndReached={this.loadNextItems}
              style={{ marginTop: 4 }}
              data={items}
              renderItem={({ item }) => (
                <SkuItem
                  measurementTypes={measurementTypes}
                  item={item}
                  wishList={wishList}
                  isSearchDone={isSearchDone}
                  skuItemIdsCurrentlyModifying={skuItemIdsCurrentlyModifying}
                  addSkuItemToList={addSkuItemToList}
                  changeSkuItemQuantityInList={changeSkuItemQuantityInList}
                  selectActiveSkuMeasurementId={selectActiveSkuMeasurementId}
                />
              )}
              ListEmptyComponent={() => {
                if (items && items.length == 0 && isSearchDone) {
                  return (
                    <View style={{ padding: 20, alignItems: "center" }}>
                      {searchTerm ? (
                        <Text style={{ textAlign: "center" }}>
                          Sorry we couldn't find any items
                          {searchTerm ? ` for "${searchTerm}"` : ""}
                          {/* {!hideAddManually
                          ? ", please use '+' to add manually."
                          : ""} */}
                        </Text>
                      ) : null}
                      {/* {searchTerm && !hideAddManually ? (
                        <Button
                          onPress={openAddManualItemModal}
                          style={{ height: 40, width: 180, marginTop: 15 }}
                          text="Add Manually"
                          color="secondary"
                        />
                      ) : null} */}
                    </View>
                  );
                } else if (items && items.length == 0 && !isSearchDone) {
                  return (
                    <View style={{ paddingLeft: 10 }}>
                      <Text style={{ color: colors.secondaryText }}>
                        {searchTerm && searchTerm.length < 3
                          ? "Enter atleast 3 characters"
                          : ""}
                      </Text>
                    </View>
                  );
                }
                return null;
              }}
              extraData={{ wishList, items }}
              keyExtractor={(item, index) => item.id + "-" + index}
            />
          </View>
        </View>
        {isBrandsPopupVisible ? this.filterModal.show() : <View />}
        <FilterModal
          ref={node => {
            this.filterModal = node;
          }}
          brands={brands}
          sellers={sellers}
          wishList={wishList}
          checkedBrandIds={checkedBrandIds}
          checkedSellerIds={checkedSellerIds}
          toggleBrandSelection={this.toggleBrandSelection}
          toggleSellerSelection={this.toggleSellerSelection}
          applyBrandsFilter={this.applyBrandsFilter}
          applySellersFilter={this.applySellersFilter}
          resetBrandsFilter={this.resetBrandsFilter}
          hideFilter={this.hideFilter}
          hideSellerFilter={hideSellerFilter}
          hideBrands={hideBrands}
        />

        <LoadingOverlay visible={isSearching} />
      </View>
    );
  }
}
