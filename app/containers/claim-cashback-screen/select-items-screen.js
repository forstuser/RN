import React from "react";
import { View, SectionList, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import Modal from "react-native-modal";

import {
  getSkuReferenceData,
  getSkuItems,
  getSkuWishList,
  addSkuItemToPastList,
  clearWishList
} from "../../api";

import BarcodeScanner from "../create-shopping-list-screen/barcode-scanner";
import LoadingOverlay from "../../components/loading-overlay";

import { Text, Button } from "../../elements";
import SearchBar from "../create-shopping-list-screen/search-bar";
import SelectedItemsList from "../my-shopping-list-screen/selected-items-list";
import { defaultStyles, colors } from "../../theme";
import { SCREENS } from "../../constants";

import QuantityPlusMinus from "../../components/quantity-plus-minus";

import { showSnackbar } from "../../utils/snackbar";

export default class SelectCashbackItems extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { onBarcodeBtnPress } = navigation.state.params;
    return {
      title: "Select Cashback Items in Bill",
      headerRight: (
        <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={onBarcodeBtnPress}
        >
          <Icon
            style={{ marginTop: 1 }}
            name="ios-barcode-outline"
            size={30}
            color={colors.pinkishOrange}
          />
        </TouchableOpacity>
      )
    };
  };

  state = {
    isBarcodeScannerVisible: false,
    isSelectedItemsModalVisible: false,
    searchTerm: "",
    lastSearchTerm3Characters: "",
    brands: [],
    selectedBrands: [],
    isSearchDone: false,
    searchError: null,
    items: [],
    selectedItems: [],
    skuItemIdsCurrentlyModifying: [],
    isSearching: false,
    mainCategories: [],
    activeMainCategoryId: null,
    activeCategoryId: null,
    selectedCategoryIds: [],
    measurementTypes: {},
    isLoading: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      onBarcodeBtnPress: this.onBarcodeBtnPress
    });
    this.loadReferenceData();

    const wishlist = navigation.getParam("wishlist", []);
    this.setState({ selectedItems: wishlist });
  }

  onBarcodeBtnPress = () => {
    this.setState({ isBarcodeScannerVisible: true });
  };

  loadReferenceData = async () => {
    const { navigation } = this.props;
    const wishlist = navigation.getParam("wishlist", []);
    const pastItems = navigation.getParam("pastItems", []);

    this.setState({ isLoading: true, referenceDataError: null });
    try {
      const res = await getSkuReferenceData();
      let measurementTypes = {};
      res.result.measurement_types.forEach(measurementType => {
        measurementTypes[measurementType.id] = measurementType;
      });

      const newState = {
        measurementTypes
      };

      let mainCategories = [];
      if (wishlist.length > 0) {
        mainCategories.push({ id: -1, title: "SHOPPING LIST" });
        newState.activeMainCategoryId = -1;
      }

      if (pastItems.length > 0) {
        mainCategories.push({ id: 0, title: "PAST ITEMS" });
        if (wishlist.length == 0) {
          newState.activeMainCategoryId = 0;
        }
      }

      newState.mainCategories = [
        ...mainCategories,
        ...res.result.main_categories
      ];

      if (newState.activeMainCategoryId === undefined) {
        newState.activeMainCategoryId = newState.mainCategories[0].id;
        newState.selectedCategoryIds = [];
      }

      if (wishlist.length > 0) {
        newState.items = wishlist;
      } else if (pastItems.length > 0) {
        newState.items = pastItems;
      }

      this.setState(newState, () => {
        if (wishlist.length == 0 && pastItems.length == 0) {
          this.loadItems();
        }
      });
    } catch (referenceDataError) {
      console.log("referenceDataError: ", referenceDataError);
      this.setState({ referenceDataError });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadItems = async () => {
    this.setState({
      isSearching: true,
      isSearchDone: false,
      searchError: null,
      items: []
    });
    const {
      activeMainCategoryId,
      selectedCategoryIds,
      searchTerm,
      selectedBrands
    } = this.state;
    try {
      const res = await getSkuItems({
        mainCategoryId: activeMainCategoryId,
        categoryIds: !searchTerm ? selectedCategoryIds : undefined,
        searchTerm: searchTerm || undefined,
        brandIds: selectedBrands.map(brand => brand.id)
      });
      this.setState({
        isSearching: false,
        isSearchDone: true,
        items: res.result.sku_items,
        brands: res.result.brands
      });
    } catch (error) {
      console.log(error);
      this.setState({ isSearching: false, searchError: error });
    }
  };

  updateStateMainCategoryId = activeMainCategoryId => {
    const { navigation } = this.props;
    const wishlist = navigation.getParam("wishlist", []);
    const pastItems = navigation.getParam("pastItems", []);

    const { mainCategories } = this.state;
    const mainCategory = mainCategories.find(
      mainCategoryItem => mainCategoryItem.id == activeMainCategoryId
    );
    const newState = {
      activeMainCategoryId,
      selectedBrands: [],
      selectedCategoryIds: []
    };
    if (activeMainCategoryId > 0) {
      newState.activeCategoryId = mainCategory.categories[0].id;
    } else if (activeMainCategoryId == -1) {
      newState.items = wishlist;
      newState.selectedBrands = [];
      newState.brands = [];
    } else if (activeMainCategoryId == 0) {
      newState.items = pastItems;
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
    // const selectedCategoryIds = [...this.state.selectedCategoryIds];
    // const idx = selectedCategoryIds.findIndex(
    //   category => category.id == categoryId
    // );
    // if (idx > -1) {
    //   selectedCategoryIds.splice(idx, 1);
    // } else {
    //   selectedCategoryIds.push(categoryId);
    // }
    this.setState(
      { selectedCategoryIds: [categoryId], selectedBrands: [] },
      () => {
        this.loadItems();
      }
    );
  };

  updateItem = (index, data) => {
    const items = [...this.state.items];
    items[index] = { ...items[index], ...data };
    this.setState(() => ({ items }));
  };

  updateSearchTerm = searchTerm => {
    const newState = {
      searchTerm
    };

    if (searchTerm.length < 3) {
      newState.items = [];
      newState.isSearchDone = false;
      newState.lastSearchTerm3Characters = "";
      newState.selectedBrands = [];
      newState.brands = [];
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

  setSelectedBrands = selectedBrands => {
    this.setState({ selectedBrands }, () => {
      this.loadItems();
    });
  };

  hideWishlistAndPastItemsView = () => {
    Animated.timing(this.wishlistAndPastItemsViewPosition, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  showWishlistAndPastItemsView = () => {
    Animated.timing(this.wishlistAndPastItemsViewPosition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  toggleItemSelection = item => {
    const selectedItems = [...this.state.selectedItems];
    const idx = selectedItems.findIndex(
      listItem =>
        listItem.id == item.id &&
        listItem.sku_measurement.id == item.sku_measurement.id
    );
    if (idx == -1) {
      this.addSkuItemToList(item);
    } else {
      this.changeSkuItemQuantityInList(item.sku_measurement.id, 0);
    }
  };

  addSkuItemToList = async item => {
    const selectedItems = [...this.state.selectedItems];

    console.log("item: ", item);
    console.log("selectedItems: ", selectedItems);

    if (!item.added_date) {
      item.added_date = moment().toISOString();
    }
    if (
      selectedItems.findIndex(
        listItem =>
          listItem.id == item.id &&
          listItem.sku_measurement.id == item.sku_measurement.id
      ) === -1
    ) {
      item.quantity = 1;
      selectedItems.push(item);
      this.setState({ selectedItems });
    }
    try {
      await addSkuItemToPastList(item);
    } catch (e) {
      console.log(e);
    }
  };

  changeSkuItemQuantityInList = async (skuMeasurementId, quantity) => {
    const selectedItems = [...this.state.selectedItems];
    const idxOfItem = selectedItems.findIndex(
      listItem =>
        listItem.sku_measurement &&
        listItem.sku_measurement.id == skuMeasurementId
    );

    this.changeIndexQuantity(idxOfItem, quantity);
  };

  changeIndexQuantity = async (index, quantity, callBack = () => null) => {
    const selectedItems = [...this.state.selectedItems];

    const skuItemIdsCurrentlyModifying = [
      ...this.state.skuItemIdsCurrentlyModifying
    ];

    const item = { ...selectedItems[index] };

    delete item.sku_measurements;

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
    callBack({ selectedItems, skuItemIdsCurrentlyModifying });
    try {
      await addSkuItemToPastList(item);
      if (quantity <= 0) {
        selectedItems.splice(index, 1);
      } else {
        selectedItems[index].quantity = quantity;
      }
      this.setState({ selectedItems }, () => {
        if (this.state.selectedItems.length == 0) {
          this.hideSelectedItemsModalVisible();
        }
      });

      callBack({ selectedItems, skuItemIdsCurrentlyModifying });
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
        callBack({ selectedItems, skuItemIdsCurrentlyModifying });
      }
    }
  };

  proceedToSellersScreen = () => {
    const { navigation } = this.props;
    const product = navigation.getParam("product", null);
    const cashbackJob = navigation.getParam("cashbackJob", null);
    const copies = navigation.getParam("copies", []);
    const purchaseDate = navigation.getParam("purchaseDate", null);
    const amount = navigation.getParam("amount", null);
    const isDigitallyVerified = navigation.getParam(
      "isDigitallyVerified",
      false
    );

    const { selectedItems } = this.state;

    // if (selectedItems.length == 0) {
    //   return showSnackbar({ text: "Please select some items first" });
    // }

    this.props.navigation.push(SCREENS.CLAIM_CASHBACK_SELECT_SELLER_SCREEN, {
      product,
      cashbackJob,
      copies,
      purchaseDate,
      amount,
      selectedItems,
      isDigitallyVerified
    });
  };

  showSelectedItemsModalVisible = () => {
    if (this.state.selectedItems.length == 0) return;
    this.setState({ isSelectedItemsModalVisible: true });
  };

  hideSelectedItemsModalVisible = () => {
    this.setState({ isSelectedItemsModalVisible: false });
  };

  render() {
    const { navigation } = this.props;
    const wishlist = navigation.getParam("wishlist", []);

    const {
      isBarcodeScannerVisible,
      isSelectedItemsModalVisible,
      searchTerm,
      brands,
      selectedBrands,
      isSearchDone,
      searchError,
      items,
      selectedItems = [],
      skuItemIdsCurrentlyModifying = [],
      isSearching,
      activeMainCategoryId,
      activeCategoryId,
      measurementTypes,
      mainCategories,
      isLoading
    } = this.state;

    const selectedIds = selectedItems.map(selectedItem => selectedItem.id);

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1 }}>
          <SearchBar
            activeMainCategoryId={activeMainCategoryId}
            activeCategoryId={activeCategoryId}
            updateMainCategoryIdInParent={activeMainCategoryId =>
              this.updateStateMainCategoryId(activeMainCategoryId)
            }
            updateCategoryIdInParent={activeCategoryId =>
              this.updateStateCategoryId(activeCategoryId)
            }
            mainCategories={mainCategories}
            searchTerm={searchTerm}
            loadItems={this.loadItems}
            onSearchTextChange={this.updateSearchTerm}
            clearSearchTerm={this.clearSearchTerm}
            brands={brands}
            selectedBrands={selectedBrands}
            setSelectedBrands={this.setSelectedBrands}
            isSearchDone={isSearchDone}
            searchError={searchError}
            items={items}
            isSearching={isSearching}
            measurementTypes={measurementTypes}
            wishList={selectedItems}
            skuItemIdsCurrentlyModifying={skuItemIdsCurrentlyModifying}
            addSkuItemToList={this.addSkuItemToList}
            changeSkuItemQuantityInList={this.changeSkuItemQuantityInList}
            updateItem={this.updateItem}
            hideAddManually={true}
          />
        </View>

        <View
          style={{
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            marginTop: 0,
            borderTopColor: "#eee",
            borderTopWidth: 1,
            elevation: 3,
            backgroundColor: "#fff"
          }}
        >
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={this.showSelectedItemsModalVisible}
          >
            <Text
              weight="Bold"
              style={{ fontSize: 12, flex: 1, color: colors.mainBlue }}
            >
              {selectedItems.length} Items Selected
            </Text>
          </TouchableOpacity>
          <Button
            onPress={this.proceedToSellersScreen}
            text="Next"
            color="secondary"
            style={{ height: 32, width: 85 }}
          />
        </View>
        <LoadingOverlay visible={isLoading} />
        <Modal
          isVisible={isSelectedItemsModalVisible}
          useNativeDriver
          onBackButtonPress={this.hideSelectedItemsModalVisible}
          onBackdropPress={this.hideSelectedItemsModalVisible}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 5,
              overflow: "hidden",
              marginVertical: 50
            }}
          >
            <SelectedItemsList
              selectedItems={selectedItems}
              skuItemIdsCurrentlyModifying={skuItemIdsCurrentlyModifying}
              measurementTypes={measurementTypes}
              changeIndexQuantity={this.changeIndexQuantity}
            />
          </View>
        </Modal>

        <BarcodeScanner
          visible={isBarcodeScannerVisible}
          onSelectItem={this.addSkuItemToList}
          onClosePress={() => this.setState({ isBarcodeScannerVisible: false })}
          measurementTypes={measurementTypes}
          wishList={selectedItems}
          addSkuItemToList={this.addSkuItemToList}
          changeSkuItemQuantityInList={this.changeSkuItemQuantityInList}
          updateItem={this.updateItem}
        />
      </View>
    );
  }
}
