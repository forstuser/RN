import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Picker,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import _ from "lodash";
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
import { colors, defaultStyles } from "../../theme";
import CheckBox from "../../components/checkbox";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { showSnackbar } from "../../utils/snackbar";
import SearchBar from "./search-bar";
import BarcodeScanner from "./barcode-scanner";
import AddManualItemModal from "./add-manual-item-modal";
import ClearOrContinuePreviousListModal from "./clear-or-continue-previous-list-modal";
import FilterModal from "./filter-modal";
import WishListLimitModal from "./wishlist-limit-modal";
import {
  SCREENS,
  LOCATIONS,
  MAIN_CATEGORY_IDS_SHOP_N_EARN
} from "../../constants";
import Analytics from "../../analytics";
import Modal from "../../components/modal";

class ShoppingListScreen extends React.Component {
  state = {
    maxLimit: null,
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
    offset: 0,
    endhasReachedFlag: false,
    isVisibleCashbackModal: false,
    neverShowCashbackModal: false,
    collectAtStoreFlag: false,
    hideBrands: false,
    sellerIdFromOffers: null
  };

  componentWillMount() {}

  componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.OPEN_SHOP_N_EARN);

    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.setState(
          {
            maxLimit: null,
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
            offset: 0,
            endhasReachedFlag: false,
            isVisibleCashbackModal: false,
            neverShowCashbackModal: false,
            collectAtStoreFlag: false,
            sellerIdFromOffers: null
          },
          () => {
            this.modalShow();
            this.loadSkuWishList();
            // this.getMySellers();
            // this.fromSellers();
          }
        );
      }
    );
  }

  componentWillUnmount() {}

  // handleBackPress = () => {
  //   if (this.state.searchTerm.length > 0) {
  //     this.setState(
  //       {
  //         maxLimit: null,
  //         isLoading: false,
  //         isLoadingWishList: false,
  //         referenceDataError: null,
  //         wishListError: null,
  //         measurementTypes: {},
  //         mainCategories: [],
  //         sellerMainCategories: [],
  //         activeMainCategoryId: null,
  //         activeCategoryId: null,
  //         selectedCategoryIds: [],
  //         isBarcodeScannerVisible: false,
  //         pastItems: [],
  //         wishList: [],
  //         skuItemIdsCurrentlyModifying: [],
  //         isSearching: false,
  //         isSearchDone: false,
  //         searchError: null,
  //         searchTerm: "",
  //         lastSearchTerm3Characters: "",
  //         items: [],
  //         brands: [],
  //         selectedBrands: [],
  //         sellers: [],
  //         selectedSeller: null,
  //         isWishListLimit: false,
  //         offset: 0,
  //         endhasReachedFlag: false,
  //         isVisibleCashbackModal: false,
  //         neverShowCashbackModal: false,
  //         sellerIdFromOffers: null
  //       },
  //       () => {
  //         this.modalShow();
  //         this.getMySellers();
  //         this.loadSkuWishList();
  //         this.fromSellers();
  //       }
  //     );
  //     return true;
  //   }
  // };

  modalShow = async () => {
    const neverShowCashback = Boolean(await AsyncStorage.getItem("neverShow"));
    if (!neverShowCashback && this.props.userLocation != LOCATIONS.OTHER) {
      this.setState({ isVisibleCashbackModal: true });
    }
  };
  loadSkuWishList = async () => {
    this.setState({ isLoadingWishList: true, wishListError: null });
    try {
      const res = await getSkuWishList();
      this.setState({ wishList: res.result.wishlist_items });
      console.log("Wishlist in Shop and Earn", res.result.wishlist_items);
      // if (res.result.wishlist_items.length > 0) {
      //   this.clearOrContinuePreviousListModal.show();
      // }
      if (res.result.wishlist_items.length > 0) {
        this.setState({
          sellerIdFromOffers: res.result.wishlist_items[0].seller_id
        });
      }
      // const pastItems = res.result.past_selections;
      // if (pastItems.length > 0 && !this.state.selectedSeller) {
      //   this.setState(() => ({ pastItems }));
      // }
      this.loadReferenceData();
    } catch (wishListError) {
      console.log("wishListError: ", wishListError);
      this.setState({ wishListError });
    } finally {
      this.setState({ isLoadingWishList: false });
    }
  };

  loadReferenceData = async () => {
    const { pastItems, sellerIdFromOffers } = this.state;
    this.setState({ isLoading: true, referenceDataError: null });
    try {
      const res = await getSkuReferenceData();
      let measurementTypes = {};
      res.result.measurement_types.forEach(measurementType => {
        measurementTypes[measurementType.id] = measurementType;
      });
      let mainCategories =
        pastItems.length > 0 ? [{ id: 0, title: "Past Items" }] : [];
      mainCategories = [...mainCategories, ...res.result.main_categories];
      // let mainCategories = [...res.result.main_categories];
      const categories = [];
      res.result.main_categories.forEach(category =>
        categories.push(...category.categories)
      );
      let brandsList = [];
      categories &&
        categories
          .filter(category => category.brands)
          .forEach(category => brandsList.push(...category.brands));
      brandsList = _.uniqBy(brandsList, "brand_id");

      this.setState(() => ({
        mainCategories,
        measurementTypes,
        // activeMainCategoryId: pastItems.length > 0 ? 0 : mainCategories[0].id,
        activeMainCategoryId: pastItems.length > 0 ? 0 : null,
        selectedCategoryIds: [],
        items: pastItems,
        brands: brandsList,
        sellers: res.seller_list
      }));
      this.setDefaultSeller();
      // if (pastItems.length == 0 || this.state.selectedSeller) {
      //   this.loadItemsFirstPage();
      // }
      console.log("selllers", res.seller_list);
    } catch (referenceDataError) {
      this.setState({ referenceDataError });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  setDefaultSeller = async () => {
    console.log("this state", this.state.sellers[0]);
    let seller = this.state.sellers[0] || null;
    const defaultSeller = await AsyncStorage.getItem("defaultSeller");
    if (defaultSeller == null) {
      // set default Seller in storage
      AsyncStorage.setItem("defaultSeller", JSON.stringify(seller));
      this.setSelectedSellers(seller ? [{ ...seller }] : []);
    } else {
      seller = JSON.parse(defaultSeller);
      this.setSelectedSellers(seller ? [{ ...seller }] : []);
      console.log("this.mainCategories", this.state.mainCategories);
      // this.setState(
      //   { activeMainCategoryId: this.state.mainCategories[0].id }
      //   // () => {
      //   //   this.setState({ hideBrands: true });
      //   // }
      // );
    }
    console.log("from asynch storeage", defaultSeller);
  };

  setSelectedSellers = async selectedSellers => {
    const { selectedSeller } = this.state;

    if (selectedSellers.length > 0) {
      this.setState({
        selectedSeller: selectedSellers[0],
        activeMainCategoryId: null,
        activeCategoryId: null
      });
      AsyncStorage.setItem("defaultSeller", JSON.stringify(selectedSellers[0]));
      try {
        this.setState({ isSearching: true });
        const res = await getSellerSkuCategories({
          sellerId: selectedSellers[0].id
        });
        console.log("get seller categories for selected seller", res.result);
        if (res.result.length > 0) {
          // filter categories foe selected seller
          const filteredMainCategories = this.state.mainCategories.filter(
            el => {
              return res.result.some(f => {
                return f.main_category_id === el.id;
              });
            }
          );
          this.setState(
            {
              sellerMainCategories: filteredMainCategories
              // activeMainCategoryId: res.result[0].main_category_id
            },
            () => {
              this.loadItemsFirstPage();
            }
          );
          console.log("final main categories", this.state.sellerMainCategories);
        }
      } catch (e) {
        showSnackbar({ text: e.message });
        this.setState({ isSearching: false });
      } finally {
        this.setState({ isSearching: false });
      }
    } else {
      this.setState(
        {
          selectedSeller: null,
          sellerMainCategories: []
        },
        () => {
          this.setState({ isSearching: false });
          // this.loadReferenceData();
          // this.clearWishList();
        }
      );
    }
  };
  closeCashbackModal = () => {
    this.setState({ isVisibleCashbackModal: false });
  };

  toggleNeverShowCashbackModal = async () => {
    this.setState({
      neverShowCashbackModal: !this.state.neverShowCashbackModal
    });
    try {
      await AsyncStorage.setItem(
        "neverShow",
        String(!this.state.neverShowCashbackModal)
      );
    } catch (e) {}
  };

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps");
  }

  // fromSellers = () => {
  //   const seller = this.props.navigation.getParam("seller", null);
  //   const collectAtStoreFlagFromSeller = this.props.navigation.getParam(
  //     "collectAtStoreFlag",
  //     false
  //   );
  //   this.setState({ collectAtStoreFlag: collectAtStoreFlagFromSeller });
  //   console.log("selected seller is ", seller);
  //   if (seller) {
  //     this.setSelectedSellers(seller ? [{ ...seller }] : []);
  //     this.setState(
  //       { activeMainCategoryId: MAIN_CATEGORY_IDS_SHOP_N_EARN.FRUIT_N_VEG },
  //       () => {
  //         this.setState({ hideBrands: true });
  //       }
  //     );
  //     this.props.navigation.setParams({
  //       seller: null,
  //       collectAtStoreFlag: false
  //     });
  //   }
  // };

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  updateStateMainCategoryId = activeMainCategoryId => {
    if (activeMainCategoryId === 194) {
      this.setState({ hideBrands: true });
    } else {
      this.setState({ hideBrands: false });
    }
    const { mainCategories } = this.state;
    const mainCategory = mainCategories.find(
      mainCategoryItem => mainCategoryItem.id == activeMainCategoryId
    );
    const brands =
      mainCategory.categories &&
      mainCategory.categories.map(category => category.brands);
    let listBrands = [];
    brands && brands.forEach(brand => listBrands.push(...brand));
    listBrands = _.uniqBy(listBrands, "brand_id");
    const newState = { activeMainCategoryId, selectedBrands: [] };

    if (activeMainCategoryId > 0 && mainCategory.categories.length > 0) {
      newState.selectedCategoryIds = [];
      newState.brands = listBrands;
    } else {
      newState.items = this.state.pastItems;
      newState.selectedBrands = [];
      newState.brands = [];
    }
    this.setState(newState, () => {
      if (activeMainCategoryId > 0) {
        this.loadItemsFirstPage();
      }
    });
  };

  updateStateCategoryId = categoryId => {
    let selectedCategoryIds = [...this.state.selectedCategoryIds];
    if (selectedCategoryIds.includes(categoryId)) {
      selectedCategoryIds = [];
    } else {
      selectedCategoryIds = [categoryId];
    }

    this.setState({ selectedCategoryIds, selectedBrands: [] }, () => {
      this.loadItemsFirstPage();
    });
  };

  updateItem = (index, data) => {
    const items = [...this.state.items];
    items[index] = { ...items[index], ...data };
    this.setState(() => ({ items }));
  };

  addSkuItemToList = async item => {
    const wishList = [...this.state.wishList];
    if (wishList.length > 19) {
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
    if (searchTerm.length == 0) {
      this.loadItemsFirstPage();
    }
    const newState = {
      searchTerm
    };

    if (searchTerm.length < 3) {
      newState.items = [];
      newState.isSearchDone = false;
      newState.lastSearchTerm3Characters = "";
    }

    this.setState(newState, () => {
      console.log("search term", searchTerm);
      console.log("length of search term", searchTerm.length);
      if (
        !searchTerm ||
        (searchTerm.length >= 3 &&
          searchTerm != this.state.lastSearchTerm3Characters)
      ) {
        if (this.state.timeout) clearTimeout(this.state.timeout);
        this.setState({
          timeout: setTimeout(() => {
            this.loadItemsFirstPage();
            console.log("Search Term after timeout____________", searchTerm);
          }, 700)
        });
      }
      if (searchTerm.length == 3) {
        this.setState({ lastSearchTerm3Characters: searchTerm });
      }
    });
  };

  clearSearchTerm = () => {
    this.updateSearchTerm("");
    this.loadReferenceData();
  };

  loadItemsFirstPage = () => {
    this.setState({ items: [], endhasReachedFlag: false }, () => {
      this.loadItems();
    });
  };

  loadItems = async (offset = 0) => {
    const { items } = this.state;
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
      selectedSeller
    } = this.state;
    try {
      const data = {
        mainCategoryId: activeMainCategoryId ? activeMainCategoryId : undefined,
        categoryIds: !searchTerm ? selectedCategoryIds : undefined,
        searchTerm: searchTerm.replace(/ /g, "%") || undefined,
        brandIds: selectedBrands.map(brand => brand.id),
        sellerId: selectedSeller ? selectedSeller.id : undefined,
        offset: items.length
      };
      const res = await getSkuItems(data);
      //console.log("Sellers list in shop and earn: ", res.seller_list);
      if (res.result.sku_items.length === 0) {
        this.setState({ endhasReachedFlag: true });
      }
      const newState = {
        isSearching: false,
        isSearchDone: true,
        items: [...items, ...res.result.sku_items],
        //brands: res.result.brands,
        sellers: res.seller_list,
        maxLimit: res.max_wish_list_items
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
        this.loadItemsFirstPage();
      }
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

  updatePastItems = pastItems => {
    this.setState({ pastItems });
  };
  showAddProductOptionsScreen = () => {
    this.props.navigation.push(SCREENS.CLAIM_CASHBACK_SCREEN);
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
      selectedSeller,
      endhasReachedFlag,
      isVisibleCashbackModal,
      neverShowCashbackModal,
      collectAtStoreFlag,
      hideBrands
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
        title={selectedSeller ? null : "Create Shopping List"}
        titleComponent={
          <View
            style={{
              justifyContent: "center",
              height: 25,
              backgroundColor: "#fff",
              borderRadius: 10
            }}
          >
            <Picker
              mode="dropdown"
              selectedValue={selectedSeller ? selectedSeller.seller_name : null}
              style={{
                height: 40,
                width: 160,
                alignSelf: "stretch",
                alignItems: "center",
                justifyContent: "center",
                color: colors.pinkishOrange
              }}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ selectedSeller: itemValue });
                this.setSelectedSellers([itemValue]);
              }}
            >
              <Picker.Item
                label={
                  selectedSeller
                    ? selectedSeller.seller_name
                      ? selectedSeller.seller_name
                      : selectedSeller.name
                    : "Select Seller"
                }
                value={selectedSeller ? selectedSeller : "Select Seller"}
              />
              {sellers.map((seller, index) => (
                <Picker.Item
                  key={index}
                  label={seller.seller_name}
                  value={seller}
                />
              ))}
            </Picker>
          </View>
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
                size={37.5}
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
                  selectedSeller: selectedSeller,
                  collectAtStoreFlag
                });
              }}
            >
              <Image
                tintColor="#fff"
                style={{ width: 25, height: 25 }}
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
            loadItemsFirstPage={this.loadItemsFirstPage}
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
            pastItems={pastItems}
            endhasReachedFlag={endhasReachedFlag}
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
            addManualItemsToList={this.addManualItemsToList}
            hideBrands={hideBrands}
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
        <Modal
          isVisible={isVisibleCashbackModal}
          title="Shop & Earn Paytm Cashback"
          style={{
            height: 375,
            ...defaultStyles.card
          }}
          onClosePress={this.closeCashbackModal}
        >
          <View
            style={{
              flex: 1,
              padding: 5,
              justifyContent: "flex-start"
            }}
          >
            {/* <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10
              }}
            >
              <Image
                style={{ width: 90, height: 90 }}
                source={require("../../images/happiness.png")}
              />
            </View> */}

            <View style={{ padding: 10 }}>
              <Text
                weight="Bold"
                style={{
                  padding: 10,
                  paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 14
                }}
              >
                Route A:
              </Text>
              <Text weight="Light" style={{ padding: 5, fontSize: 14 }}>
                (i) Create Shopping List
              </Text>
              <Text weight="Light" style={{ padding: 5, fontSize: 14 }}>
                (ii) Shop with your List anywhere
              </Text>
              <Text weight="Light" style={{ padding: 5, fontSize: 14 }}>
                (iii) Upload valid Bill & Get Cashback
              </Text>
            </View>
            <View style={{ padding: 10 }}>
              <Text
                weight="Bold"
                style={{
                  padding: 10,
                  paddingLeft: 5,
                  paddingBottom: 5,
                  fontSize: 14
                }}
              >
                Route B:
              </Text>

              <Text weight="Light" style={{ padding: 5, fontSize: 14 }}>
                (i) Order Online on BinBill Store
              </Text>
              <Text weight="Light" style={{ padding: 5, fontSize: 14 }}>
                (ii) Pay for your Order & Get Cashback
              </Text>
            </View>
            <TouchableOpacity
              onPress={this.toggleNeverShowCashbackModal}
              style={{ flexDirection: "row", padding: 15, marginTop: 10 }}
            >
              <CheckBox isChecked={neverShowCashbackModal} />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 10,
                  marginTop: 3
                }}
              >
                Don’t show this message again
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
        <TouchableOpacity
          ref={node => (this.addProductBtnRef = node)}
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            width: 58,
            height: 58,
            zIndex: 2,
            backgroundColor: colors.tomato,
            borderRadius: 32,
            alignItems: "center",
            justifyContent: "center",
            elevation: 3
          }}
          onPress={() => this.showAddProductOptionsScreen()}
        >
          <Icon name="md-camera" color="#fff" size={28} />
          <Text weight="Bold" style={{ color: "#fff", fontSize: 10 }}>
            Claim
          </Text>
        </TouchableOpacity>
      </DrawerScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    userLocation: state.loggedInUser.location
  };
};

export default connect(
  mapStateToProps,
  null
)(ShoppingListScreen);
