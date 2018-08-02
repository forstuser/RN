import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
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
  clearWishList
} from "../../api";
import LoadingOverlay from "../../components/loading-overlay";

import BlankShoppingList from "./blank-shopping-list";
import SearchBar from "./search-bar";
import TabContent from "./tab-content";
import BarcodeScanner from "./barcode-scanner";
import AddManualItemModal from "./add-manual-item-modal";
import ClearOrContinuePreviousListModal from "./clear-or-continue-previous-list-modal";
import PastItems from "./past-items";

import { colors } from "../../theme";
import { SCREENS } from "../../constants";

class ShoppingListScreen extends React.Component {
  state = {
    isLoading: false,
    measurementTypes: {},
    mainCategories: [],
    activeMainCategoryId: null,
    skuData: {},
    isBarcodeScannerVisible: false,
    pastItems: [],
    wishList: [],
    showWishlistClearOption: false,
    isSearching: false,
    isSearchDone: false,
    searchError: null,
    searchTerm: "",
    searchItems: [],
    brands: [],
    selectedBrands: []
  };

  componentDidMount() {
    this.loadSkuWishList();
    this.loadReferenceData();
  }

  updateStateMainCategory = (index, data) => {
    const mainCategories = [...this.state.mainCategories];
    mainCategories[index] = { ...mainCategories[index], ...data };
    this.setState(() => ({ mainCategories }));
  };

  updateCategorySkuData = (categoryId, data) => {
    let skuData = { ...this.state.skuData };
    skuData[categoryId] = { ...skuData[categoryId], ...data };
    this.setState(() => ({ skuData }));
  };

  loadSkuWishList = async () => {
    try {
      const res = await getSkuWishList();
      this.setState({ wishList: res.result.wishlist_items });
      if (res.result.wishlist_items.length > 0) {
        this.clearOrContinuePreviousListModal.show();
      }

      const pastItems = res.result.past_selections;
      if (pastItems.length > 0) {
        this.setState({ pastItems });
      }
    } catch (e) {
      console.log(e);
    }
  };

  loadReferenceData = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await getSkuReferenceData();
      let measurementTypes = {};
      res.result.measurement_types.forEach(measurementType => {
        measurementTypes[measurementType.id] = measurementType;
      });
      this.setState({
        mainCategories: res.result.main_categories,
        measurementTypes
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  updateStateSkuData = (categoryId, data) => {
    const skuData = [...this.state.skuData];
    if (!skuData[categoryId]) {
      skuData[categoryId] = data;
    } else {
      skuData[categoryId] = { ...skuData[categoryId], ...data };
    }

    this.setState(() => ({ skuData }));
  };

  updateSearchItem = (index, data) => {
    const searchItems = [...this.state.searchItems];
    searchItems[index] = { ...searchItems[index], ...data };
    this.setState(() => ({ searchItems }));
  };

  loadSkuItems = async ({ categoryId }) => {
    this.updateStateSkuData(categoryId, { isLoading: true, error: null });
    try {
      const res = await getSkuItems({ categoryId });
      this.updateStateSkuData(categoryId, {
        isLoading: false,
        items: res.result.sku_items
      });
    } catch (error) {
      console.log(error);
      this.updateStateSkuData(categoryId, { isLoading: false, error });
    }
  };

  onTabChange = ({ i }) => {
    this.setState({ activeMainCategoryId: this.state.mainCategories[i].id });
  };

  addSkuItemToList = async item => {
    const wishList = [...this.state.wishList];
    if (
      wishList.findIndex(
        listItem =>
          listItem.id == item.id &&
          listItem.sku_measurement.id == item.sku_measurement.id
      ) === -1
    ) {
      wishList.push(item);
      try {
        await addSkuItemToWishList(item);
      } catch (e) {
        console.log(e);
      }
      this.setState({ wishList });
    }
  };

  changeSkuItemQuantityInWishList = async (skuMeasurementId, quantity) => {
    const wishList = [...this.state.wishList];
    const idxOfItem = wishList.findIndex(
      listItem =>
        listItem.sku_measurement &&
        listItem.sku_measurement.id == skuMeasurementId
    );
    const item = wishList[idxOfItem];
    if (quantity <= 0) {
      wishList.splice(idxOfItem, 1);
      item.quantity = 0;
    } else {
      wishList[idxOfItem].quantity = quantity;
      item.quantity = quantity;
    }
    try {
      await addSkuItemToWishList(item);
    } catch (e) {
      console.log(e);
    }
    this.setState({ wishList });
  };

  updateSearchTerm = searchTerm => {
    this.setState({
      searchTerm,
      isSearchDone: false,
      selectedBrands: [],
      brands: [],
      searchItems: []
    });
  };

  clearSearchTerm = () => {
    this.updateSearchTerm("");
  };

  startSearch = async () => {
    this.setState({
      isSearching: true,
      isSearchDone: false,
      searchError: null
    });
    try {
      const res = await getSkuItems({
        searchTerm: this.state.searchTerm,
        brandIds: this.state.selectedBrands.map(brand => brand.id)
      });
      this.setState({
        isSearching: false,
        isSearchDone: true,
        searchItems: res.result.sku_items,
        brands: res.result.brands
      });
    } catch (error) {
      console.log(error);
      this.setState({ isSearching: false, searchError: error });
    }
  };

  toggleBrand = brand => {
    const selectedBrands = [...this.state.selectedBrands];
    const idx = selectedBrands.findIndex(brandItem => brandItem.id == brand.id);
    if (idx == -1) {
      selectedBrands.push(brand);
    } else {
      selectedBrands.splice(idx, 1);
    }
    this.setState({ selectedBrands }, () => {
      this.startSearch();
    });
  };

  clearWishList = async () => {
    try {
      await clearWishList();
      this.setState({ wishList: [] });
    } catch (e) {
      showSnackbar({ text: e.message });
    }
  };

  changeIndexQuantity = async (index, quantity) => {
    const wishList = [...this.state.wishList];
    const item = wishList[index];
    if (quantity <= 0) {
      wishList.splice(index, 1);
      item.quantity = 0;
    } else {
      wishList[index].quantity = quantity;
      item.quantity = quantity;
    }
    try {
      await addSkuItemToWishList(item);
    } catch (e) {
      console.log(e);
    }
    this.setState({ wishList });
  };

  render() {
    const { navigation } = this.props;
    const {
      isLoading,
      measurementTypes,
      mainCategories,
      skuData,
      isBarcodeScannerVisible,
      pastItems,
      wishList,
      searchTerm,
      searchItems,
      isSearching,
      isSearchDone,
      searchError,
      brands,
      selectedBrands
    } = this.state;

    return (
      <DrawerScreenContainer
        title="Create Shopping List"
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
              onPress={() => {
                navigation.navigate(SCREENS.MY_SHOPPING_LIST_SCREEN, {
                  wishList,
                  changeIndexQuantity: this.changeIndexQuantity
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
                    style={{ fontSize: 9, color: colors.mainBlue }}
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
            searchTerm={searchTerm}
            startSearch={this.startSearch}
            onSearchTextChange={this.updateSearchTerm}
            clearSearchTerm={this.clearSearchTerm}
            brands={brands}
            selectedBrands={selectedBrands}
            toggleBrand={this.toggleBrand}
            isSearchDone={isSearchDone}
            searchError={searchError}
            searchItems={searchItems}
            isSearching={isSearching}
            measurementTypes={measurementTypes}
            wishList={wishList}
            addSkuItemToList={this.addSkuItemToList}
            changeSkuItemQuantityInWishList={
              this.changeSkuItemQuantityInWishList
            }
            updateSearchItem={this.updateSearchItem}
            openAddManualItemModal={() => this.addManualItemModal.show()}
          />
          {!searchTerm ? (
            <ScrollableTabView
              locked={true}
              onChangeTab={this.onTabChange}
              renderTabBar={() => (
                <ScrollableTabBar
                  style={{ height: 30 }}
                  tabStyle={{ height: 30 }}
                />
              )}
              tabBarUnderlineStyle={{
                height: 0
              }}
              tabBarBackgroundColor={colors.lightBlue}
              tabBarActiveTextColor={colors.mainBlue}
              tabBarTextStyle={{
                fontSize: 10,
                fontFamily: `Quicksand-Regular`,
                padding: 0
              }}
            >
              {pastItems.length > 0 ? (
                <PastItems
                  key={"pastItems"}
                  tabLabel={"Past Items"}
                  measurementTypes={measurementTypes}
                  pastItems={pastItems}
                  wishList={wishList}
                  addSkuItemToList={this.addSkuItemToList}
                  changeSkuItemQuantityInWishList={
                    this.changeSkuItemQuantityInWishList
                  }
                />
              ) : null}
              {mainCategories.map((mainCategory, index) => (
                <TabContent
                  key={mainCategory.id}
                  tabLabel={mainCategory.title}
                  measurementTypes={measurementTypes}
                  mainCategory={mainCategory}
                  updateMainCategoryInParent={data =>
                    this.updateStateMainCategory(index, data)
                  }
                  updateCategorySkuData={this.updateCategorySkuData}
                  loadSkuItems={this.loadSkuItems}
                  skuData={skuData}
                  wishList={wishList}
                  addSkuItemToList={this.addSkuItemToList}
                  changeSkuItemQuantityInWishList={
                    this.changeSkuItemQuantityInWishList
                  }
                />
              ))}
            </ScrollableTabView>
          ) : (
            <View />
          )}
          <LoadingOverlay visible={isLoading} />
          <BarcodeScanner
            visible={isBarcodeScannerVisible}
            onSelectItem={this.addSkuItemToList}
            onClosePress={() =>
              this.setState({ isBarcodeScannerVisible: false })
            }
          />
          <AddManualItemModal
            ref={node => {
              this.addManualItemModal = node;
            }}
            addSkuItemToList={this.addSkuItemToList}
          />
          <ClearOrContinuePreviousListModal
            ref={node => {
              this.clearOrContinuePreviousListModal = node;
            }}
            clearWishList={this.clearWishList}
          />
        </View>
      </DrawerScreenContainer>
    );
  }
}

export default ShoppingListScreen;
