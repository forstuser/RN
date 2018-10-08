import React from "react";
import { StyleSheet, View, TouchableOpacity, Picker } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

import { Text, Image } from "../../elements";
import DrawerScreenContainer from "../../components/drawer-screen-container";

import {
  getSkuReferenceData,
  getSkuItems,
  getSkuWishList,
  addSkuItemToWishList,
  clearWishList,
  getMySellers,
  getSellerSkuCategories
} from "../../api";

import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { showSnackbar } from "../../utils/snackbar";

import BlankShoppingList from "./blank-shopping-list";
import SearchBar from "./search-bar";
import TabContent from "./tab-content";
import BarcodeScanner from "./barcode-scanner";
import AddManualItemModal from "./add-manual-item-modal";
import ClearOrContinuePreviousListModal from "./clear-or-continue-previous-list-modal";
import PastItems from "./past-items";
import FilterModal from "./filter-modal";
import WishListLimitModal from "./wishlist-limit-modal";
import { colors } from "../../theme";
import { SCREENS } from "../../constants";
import Analytics from "../../analytics";
import DropDownSellers from "./drop-down-sellers";

class ShoppingListScreen extends React.Component {
  state = {
    isLoading: false,
    isLoadingWishList: false,
    referenceDataError: null,
    wishListError: null,
    measurementTypes: {},
    mainCategories: [],
    sellerMainCategories: [],
    activeMainCategoryId: null,
    activeCategoryId: null,
    selectedCategoryIds: [],
    isBarcodeScannerVisible: false,
    pastItems: [],
    wishList: [],
    skuItemIdsCurrentlyModifying: [],
    isSearching: false,
    isSearchDone: false,
    searchError: null,
    searchTerm: "",
    lastSearchTerm3Characters: "",
    items: [],
    brands: [],
    selectedBrands: [],
    sellers: [],
    selectedSeller: null,
    isWishListLimit: false,
    offset: 0
  };

  componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.OPEN_SHOP_N_EARN);
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.loadSkuWishList();
      }
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  loadSkuWishList = async () => {
    this.setState({ isLoadingWishList: true, wishListError: null });
    try {
      const res = await getSkuWishList();
      this.setState({ wishList: res.result.wishlist_items });
      // if (res.result.wishlist_items.length > 0) {
      //   this.clearOrContinuePreviousListModal.show();
      // }

      const pastItems = res.result.past_selections;
      if (pastItems.length > 0) {
        this.setState(() => ({ pastItems }));
      }

      this.loadReferenceData();
    } catch (wishListError) {
      console.log("wishListError: ", wishListError);
      this.setState({ wishListError });
    } finally {
      this.setState({ isLoadingWishList: false });
    }
  };

  loadReferenceData = async () => {
    const { pastItems } = this.state;
    this.setState({ isLoading: true, referenceDataError: null });
    try {
      const res = await getSkuReferenceData();
      let measurementTypes = {};
      res.result.measurement_types.forEach(measurementType => {
        measurementTypes[measurementType.id] = measurementType;
      });

      let mainCategories =
        pastItems.length > 0 ? [{ id: 0, title: "PAST ITEMS" }] : [];

      mainCategories = [...mainCategories, ...res.result.main_categories];

      this.setState(() => ({
        mainCategories,
        measurementTypes,
        activeMainCategoryId: pastItems.length > 0 ? 0 : mainCategories[0].id,
        selectedCategoryIds: [],
        items: pastItems
      }));

      if (pastItems.length == 0) {
        this.loadItems();
      }
    } catch (referenceDataError) {
      console.log("referenceDataError: ", referenceDataError);
      this.setState({ referenceDataError });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  updateStateMainCategoryId = activeMainCategoryId => {
    const { mainCategories } = this.state;
    const mainCategory = mainCategories.find(
      mainCategoryItem => mainCategoryItem.id == activeMainCategoryId
    );
    const newState = { activeMainCategoryId, selectedBrands: [] };

    if (activeMainCategoryId > 0 && mainCategory.categories.length > 0) {
      newState.selectedCategoryIds = [];
    } else {
      newState.items = this.state.pastItems;
      newState.selectedBrands = [];
      newState.brands = [];
    }
    this.setState(newState, () => {
      if (activeMainCategoryId > 0) {
        this.loadItems();
      }
    });
  };

  updateStateCategoryId = categoryId => {
    let selectedCategoryIds = [...this.state.selectedCategoryIds];
    // const idx = selectedCategoryIds.findIndex(
    //   categoryItemId => categoryItemId == categoryId
    // );

    // if (idx > -1) {
    //   selectedCategoryIds.splice(idx, 1);
    // } else {
    //   selectedCategoryIds.push(categoryId);
    // }

    if (selectedCategoryIds.includes(categoryId)) {
      selectedCategoryIds = [];
    } else {
      selectedCategoryIds = [categoryId];
    }

    this.setState({ selectedCategoryIds, selectedBrands: [] }, () => {
      this.loadItems();
    });
  };

  updateItem = (index, data) => {
    const items = [...this.state.items];
    items[index] = { ...items[index], ...data };
    this.setState(() => ({ items }));
  };

  addSkuItemToList = async item => {
    const wishList = [...this.state.wishList];
    if (wishList.length > 14) {
      return this.limitModal.show();
    }
    if (
      wishList.findIndex(listItem => {
        if (listItem.id && item.id && listItem.id == item.id) {
          if (listItem.sku_measurement) {
            return listItem.sku_measurement.id == item.sku_measurement.id;
          }
        }
        return false;
      }) === -1
    ) {
      wishList.push(item);
      this.setState({ wishList });
      try {
        await addSkuItemToWishList(item);
      } catch (e) {
        console.log(e);
      }
    }
  };

  addManualItemsToList = items => {
    this.setState({ wishList: [...this.state.wishList, ...items] });
    items.map(async item => {
      try {
        await addSkuItemToWishList(item);
      } catch (e) {
        console.log(e);
      }
    });
  };

  changeSkuItemQuantityInList = async (skuMeasurementId, quantity) => {
    const wishList = [...this.state.wishList];
    const idxOfItem = wishList.findIndex(
      listItem =>
        listItem.sku_measurement &&
        listItem.sku_measurement.id == skuMeasurementId
    );

    this.changeIndexQuantity(idxOfItem, quantity);
  };

  changeIndexQuantity = async (index, quantity, callBack = () => null) => {
    const wishList = [...this.state.wishList];

    const skuItemIdsCurrentlyModifying = [
      ...this.state.skuItemIdsCurrentlyModifying
    ];

    const item = { ...wishList[index] };

    if (
      item.sku_measurement &&
      !skuItemIdsCurrentlyModifying.includes(item.sku_measurement.id)
    ) {
      skuItemIdsCurrentlyModifying.push(item.sku_measurement.id);
    }
    if (quantity <= 0) {
      item.quantity = 0;
    } else {
      item.quantity = quantity;
    }
    this.setState({ skuItemIdsCurrentlyModifying });
    callBack({ wishList, skuItemIdsCurrentlyModifying });
    try {
      await addSkuItemToWishList(item);
      if (quantity <= 0) {
        wishList.splice(index, 1);
      } else {
        wishList[index].quantity = quantity;
      }
      this.setState({ wishList });
      callBack({ wishList, skuItemIdsCurrentlyModifying });
    } catch (e) {
      console.log("wishlist error: ", e);
      showSnackbar({ text: e.message });
    } finally {
      if (item.sku_measurement) {
        const idx = skuItemIdsCurrentlyModifying.findIndex(
          id => id == item.sku_measurement.id
        );
        skuItemIdsCurrentlyModifying.splice(idx, 1);
        this.setState({ skuItemIdsCurrentlyModifying });
        callBack({ wishList, skuItemIdsCurrentlyModifying });
      }
    }
  };

  updateSearchTerm = searchTerm => {
    const newState = {
      searchTerm
    };

    if (searchTerm.length < 3) {
      newState.items = [];
      newState.isSearchDone = false;
      newState.lastSearchTerm3Characters = "";
    }

    this.setState(newState, () => {
      if (
        !searchTerm ||
        (searchTerm.length == 3 &&
          searchTerm != this.state.lastSearchTerm3Characters)
      ) {
        this.loadItems();
      }
      if (searchTerm.length == 3) {
        this.setState({ lastSearchTerm3Characters: searchTerm });
      }
    });
  };

  clearSearchTerm = () => {
    this.updateSearchTerm("");
  };

  // laodMoreItems = index => {
  //   this.setState({
  //     offset: index
  //   });
  //   this.loadItems();
  // };

  loadItems = async () => {
    this.setState({
      isSearching: true,
      isSearchDone: false,
      searchError: null
    });

    const {
      activeMainCategoryId,
      selectedCategoryIds,
      searchTerm,
      selectedBrands,
      selectedSeller,
      offset
    } = this.state;

    try {
      const data = {
        mainCategoryId: activeMainCategoryId ? activeMainCategoryId : undefined,
        categoryIds: !searchTerm ? selectedCategoryIds : undefined,
        searchTerm: searchTerm || undefined,
        brandIds: selectedBrands.map(brand => brand.id),
        sellerId: selectedSeller ? selectedSeller.id : undefined,
        offset: offset || 0
      };

      const res = await getSkuItems(data);
      //console.log("Sellers list in shop and earn: ", res.seller_list);
      const newState = {
        isSearching: false,
        isSearchDone: true,
        items: res.result.sku_items,
        brands: res.result.brands,
        sellers: res.seller_list
      };

      this.setState(newState);
    } catch (error) {
      console.log(error);
      this.setState({ isSearching: false, searchError: error });
    }
  };

  setSelectedBrands = (selectedBrands, stopItemLoad = false) => {
    this.setState({ selectedBrands }, () => {
      if (!stopItemLoad) {
        this.loadItems();
      }
    });
  };

  setSelectedSellers = async selectedSellers => {
    const { selectedSeller } = this.state;

    if (selectedSellers.length > 0) {
      this.setState({
        selectedSeller: selectedSellers[0],
        activeMainCategoryId: null,
        activeCategoryId: null
      });
      try {
        this.setState({ isSearching: true });
        const res = await getSellerSkuCategories({
          sellerId: selectedSellers[0].id
        });
        this.setState(
          {
            sellerMainCategories: res.result
          },
          () => {
            this.loadItems();
            this.clearWishList();
          }
        );
      } catch (e) {
        showSnackbar({ text: e.message });
        this.setState({ isSearching: false });
      }
    } else {
      this.setState(
        {
          selectedSeller: null,
          sellerMainCategories: []
        },
        () => {
          this.loadReferenceData();
          this.clearWishList();
        }
      );
    }
  };

  clearWishList = async () => {
    try {
      await clearWishList();
      this.setState({ wishList: [] });
    } catch (e) {
      showSnackbar({ text: e.message });
    }
  };

  updatePastItems = pastItems => {
    this.setState({ pastItems });
  };

  render() {
    const { navigation } = this.props;
    const {
      activeMainCategoryId,
      selectedCategoryIds,
      isLoading,
      isLoadingWishList,
      referenceDataError,
      wishListError,
      measurementTypes,
      mainCategories,
      sellerMainCategories,
      skuData,
      isBarcodeScannerVisible,
      pastItems,
      wishList,
      skuItemIdsCurrentlyModifying,
      searchTerm,
      items,
      isSearching,
      isSearchDone,
      searchError,
      brands,
      selectedBrands,
      sellers,
      selectedSeller
    } = this.state;

    if (referenceDataError || wishListError) {
      return (
        <ErrorOverlay
          error={referenceDataError || wishListError}
          onRetryPress={this.loadSkuWishList}
        />
      );
    }

    return (
      <DrawerScreenContainer
        title={
          selectedSeller ? selectedSeller.seller_name : "Create Shopping List"
        }
        navigation={navigation}
        headerRight={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{ paddingHorizontal: 5 }}
              onPress={() => this.setState({ isBarcodeScannerVisible: true })}
            >
              <Icon
                style={{ marginTop: 1 }}
                name="ios-barcode-outline"
                size={30}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingHorizontal: 5, marginHorizontal: 5 }}
              disabled={isLoading === true}
              onPress={() => {
                Analytics.logEvent(Analytics.EVENTS.OPEN_CART_SHOPPING_LIST);
                navigation.push(SCREENS.MY_SHOPPING_LIST_SCREEN, {
                  measurementTypes: measurementTypes,
                  wishList,
                  changeIndexQuantity: this.changeIndexQuantity,
                  selectedSeller: selectedSeller
                });
              }}
            >
              <Image
                tintColor="#fff"
                style={{ width: 20, height: 20 }}
                source={require("../../images/blank_shopping_list.png")}
              />
              {wishList.length > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "#fff",
                    top: 0,
                    right: 0,
                    width: 15,
                    height: 15,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    weight="Medium"
                    style={{ fontSize: 9, color: colors.pinkishOrange }}
                  >
                    {wishList.length}
                  </Text>
                </View>
              ) : (
                <View />
              )}
            </TouchableOpacity>
          </View>
        }
      >
        {/* <BlankShoppingList navigation={navigation} /> */}
        <View style={{ flex: 1 }}>
          <SearchBar
            mainCategories={mainCategories}
            sellerMainCategories={sellerMainCategories}
            activeMainCategoryId={activeMainCategoryId}
            selectedCategoryIds={selectedCategoryIds}
            updateMainCategoryIdInParent={activeMainCategoryId =>
              this.updateStateMainCategoryId(activeMainCategoryId)
            }
            updateCategoryIdInParent={categoryId =>
              this.updateStateCategoryId(categoryId)
            }
            searchTerm={searchTerm}
            loadItems={this.loadItems}
            onSearchTextChange={this.updateSearchTerm}
            clearSearchTerm={this.clearSearchTerm}
            brands={brands}
            sellers={sellers}
            selectedBrands={selectedBrands}
            selectedSeller={selectedSeller}
            setSelectedBrands={this.setSelectedBrands}
            setSelectedSellers={this.setSelectedSellers}
            isSearchDone={isSearchDone}
            searchError={searchError}
            items={items}
            isSearching={isSearching}
            measurementTypes={measurementTypes}
            wishList={wishList}
            skuItemIdsCurrentlyModifying={skuItemIdsCurrentlyModifying}
            addSkuItemToList={this.addSkuItemToList}
            changeSkuItemQuantityInList={this.changeSkuItemQuantityInList}
            updateItem={this.updateItem}
            openAddManualItemModal={() =>
              this.addManualItemModal.show(searchTerm)
            }
            // onEndReached={() => this.laodMoreItems(100)}
            addManualItemsToList={this.addManualItemsToList}
          />
          <LoadingOverlay visible={isLoading || isLoadingWishList} />
          <BarcodeScanner
            visible={isBarcodeScannerVisible}
            onSelectItem={this.addSkuItemToList}
            onClosePress={() =>
              this.setState({ isBarcodeScannerVisible: false })
            }
            measurementTypes={measurementTypes}
            wishList={wishList}
            addSkuItemToList={this.addSkuItemToList}
            changeSkuItemQuantityInList={this.changeSkuItemQuantityInList}
            updateItem={this.updateItem}
          />
          <AddManualItemModal
            ref={node => {
              this.addManualItemModal = node;
            }}
            addManualItemsToList={this.addManualItemsToList}
          />
          <ClearOrContinuePreviousListModal
            ref={node => {
              this.clearOrContinuePreviousListModal = node;
            }}
            clearWishList={this.clearWishList}
          />
        </View>
        <FilterModal
          ref={node => {
            this.filterModal = node;
          }}
        />
        <WishListLimitModal
          ref={node => {
            this.limitModal = node;
          }}
        />
      </DrawerScreenContainer>
    );
  }
}

export default ShoppingListScreen;

//(
// <DropDownSellers
//   sellerName={selectedSeller.seller_name}
//   sellerList={sellers}
//   onDropDownChange={this.onDropDownChange}
// />

// <View>
//   <Picker
//     mode="dropdown"
//     //selectedValue={selectedSeller.seller_name}
//     style={{ height: 50, width: 100 }}
//     // onValueChange={(itemValue, itemIndex) =>
//     //   this.setState({ selectedSeller: itemValue })
//     // }
//   >
//     <Picker.Item label="Huzaifa Shop" value="java" />
//     <Picker.Item label="Zop" value="js" />
//   </Picker>
// </View>
