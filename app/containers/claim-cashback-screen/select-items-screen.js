import React from "react";
import { View, SectionList, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import {
  getSkuReferenceData,
  getSkuItems,
  getSkuWishList,
  addSkuItemToWishList,
  clearWishList
} from "../../api";

import BarcodeScanner from "../create-shopping-list-screen/barcode-scanner";

import { Text, Button } from "../../elements";
import SearchBar from "../create-shopping-list-screen/search-bar";
import { defaultStyles, colors } from "../../theme";
import { SCREENS } from "../../constants";

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

  wishlistAndPastItemsViewPosition = new Animated.Value(0);

  state = {
    isBarcodeScannerVisible: false,
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

  componentDidMount() {
    this.props.navigation.setParams({
      onBarcodeBtnPress: this.onBarcodeBtnPress
    });
    this.loadReferenceData();
  }

  onBarcodeBtnPress = () => {
    this.setState({ isBarcodeScannerVisible: true });
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

      this.setState(
        {
          measurementTypes
        },
        () => {
          this.loadItems();
        }
      );
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
      searchError: null
    });
    try {
      const res = await getSkuItems({
        categoryId: this.state.activeCategoryId,
        // searchTerm: this.state.searchTerm,
        brandIds: this.state.selectedBrands.map(brand => brand.id)
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

  updateItem = (index, data) => {
    const items = [...this.state.items];
    items[index] = { ...items[index], ...data };
    this.setState(() => ({ items }));
  };

  updateSearchTerm = searchTerm => {
    this.setState(
      {
        searchTerm,
        isSearchDone: false,
        selectedBrands: [],
        brands: [],
        items: []
      },
      () => {
        if (!searchTerm) {
          this.loadItems();
        }
      }
    );
  };

  clearSearchTerm = () => {
    this.updateSearchTerm("");
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
      selectedItem => selectedItem.id == item.id
    );
    if (idx == -1) {
      selectedItems.push(item);
    } else {
      selectedItems.splice(idx, 1);
    }
    this.setState({ selectedItems });
  };

  addSkuItemToList = async item => {
    const selectedItems = [...this.state.selectedItems];
    if (
      selectedItems.findIndex(
        listItem =>
          listItem.id == item.id &&
          listItem.sku_measurement.id == item.sku_measurement.id
      ) === -1
    ) {
      selectedItems.push(item);
      try {
        await addSkuItemToWishList(item);
      } catch (e) {
        console.log(e);
      }
      this.setState({ selectedItems });
    }
  };

  changeSkuItemQuantityInList = async (skuMeasurementId, quantity) => {
    const selectedItems = [...this.state.selectedItems];
    const idxOfItem = selectedItems.findIndex(
      listItem =>
        listItem.sku_measurement &&
        listItem.sku_measurement.id == skuMeasurementId
    );
    const item = selectedItems[idxOfItem];
    if (quantity <= 0) {
      selectedItems.splice(idxOfItem, 1);
      item.quantity = 0;
    } else {
      selectedItems[idxOfItem].quantity = quantity;
      item.quantity = quantity;
    }
    try {
      await addSkuItemToWishList(item);
    } catch (e) {
      console.log(e);
    }
    this.setState({ selectedItems });
  };

  proceedToSellersScreen = () => {
    const { navigation } = this.props;
    const product = navigation.getParam("product", null);
    const cashbackJob = navigation.getParam("cashbackJob", null);
    const copies = navigation.getParam("copies", []);
    const purchaseDate = navigation.getParam("purchaseDate", null);
    const amount = navigation.getParam("amount", null);

    const { selectedItems } = this.state;
    this.props.navigation.push(SCREENS.CLAIM_CASHBACK_SELECT_SELLER_SCREEN, {
      product,
      cashbackJob,
      copies,
      purchaseDate,
      amount,
      selectedItems
    });
  };

  render() {
    const { navigation } = this.props;
    const wishlist = navigation.getParam("wishlist", []);
    const pastItems = navigation.getParam("pastItems", []);

    const {
      isBarcodeScannerVisible,
      searchTerm,
      brands,
      selectedBrands,
      isSearchDone,
      searchError,
      items,
      selectedItems = [],
      isSearching,
      measurementTypes
    } = this.state;

    const selectedIds = selectedItems.map(selectedItem => selectedItem.id);
    let sections = [];
    if (wishlist.length > 0) {
      sections.push({ title: "From Shopping List", data: wishlist });
    }
    sections.push({ title: "From Past Selections", data: pastItems });

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
            wishList={selectedItems}
            addSkuItemToList={this.addSkuItemToList}
            changeSkuItemQuantityInList={this.changeSkuItemQuantityInList}
            updateItem={this.updateItem}
          />
        </View>

        <Animated.View
          style={[
            {
              position: "absolute",
              height: 70,
              bottom: 0,
              left: 0,
              right: 0
            },
            {
              transform: [
                {
                  translateY: this.wishlistAndPastItemsViewPosition.interpolate(
                    {
                      inputRange: [0, 1],
                      outputRange: [60, 0]
                    }
                  )
                }
              ]
            }
          ]}
        >
          <TouchableOpacity
            onPress={this.showWishlistAndPastItemsView}
            style={{
              width: 38,
              height: 38,
              alignSelf: "center",
              ...defaultStyles.card,
              borderRadius: 19,
              alignItems: "center"
            }}
          >
            <Icon name="ios-arrow-up" size={28} color={colors.pinkishOrange} />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              marginTop: -16,
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              ...defaultStyles.card
            }}
          >
            <Text weight="Bold" style={{ fontSize: 10, flex: 1 }}>
              {selectedItems.length} Items Selected
            </Text>
            <Button
              onPress={this.proceedToSellersScreen}
              text="Next"
              color="secondary"
              style={{ height: 32, width: 85 }}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            },
            {
              transform: [
                {
                  translateY: this.wishlistAndPastItemsViewPosition.interpolate(
                    {
                      inputRange: [0, 1],
                      outputRange: [0, 1000]
                    }
                  )
                }
              ]
            }
          ]}
        >
          <TouchableOpacity
            onPress={this.hideWishlistAndPastItemsView}
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
          </TouchableOpacity>
          <View style={{ flex: 1, ...defaultStyles.card, marginTop: -16 }}>
            <Text
              weight="Bold"
              style={{ textAlign: "center", fontSize: 10, marginVertical: 8 }}
            >
              {selectedItems.length} Items Selected
            </Text>
            <SectionList
              renderItem={({ item, index }) => {
                let cashback = 0;
                if (
                  item.sku_measurement &&
                  item.sku_measurement.cashback_percent
                ) {
                  cashback =
                    (item.mrp * item.sku_measurement.cashback_percent) / 100;
                }

                const isItemSelected = selectedIds.includes(item.id);

                return (
                  <TouchableOpacity
                    onPress={() => this.toggleItemSelection(item)}
                    style={{
                      flexDirection: "row",
                      padding: 10,
                      height: 60
                    }}
                  >
                    <View style={{ marginRight: 5 }}>
                      <View
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isItemSelected
                            ? colors.success
                            : "transparent"
                        }}
                      >
                        {isItemSelected ? (
                          <Icon name="md-checkmark" size={12} color="#fff" />
                        ) : (
                          <View />
                        )}
                      </View>
                    </View>
                    <View style={{ flex: 1, paddingTop: 2 }}>
                      <Text weight="Medium" style={{ fontSize: 10 }}>
                        {item.title}
                      </Text>
                      {cashback ? (
                        <Text
                          weight="Medium"
                          style={{
                            fontSize: 10,
                            color: colors.mainBlue,
                            marginTop: 10
                          }}
                        >
                          You get back ₹ {cashback}
                        </Text>
                      ) : (
                        <View />
                      )}
                    </View>
                    <View style={{ alignItems: "flex-end", width: 50 }}>
                      <Text>{item.quantity}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    backgroundColor: "#efefef",
                    height: 1,
                    marginHorizontal: 10
                  }}
                />
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View
                  style={{
                    backgroundColor: "#e0e0e0",
                    height: 24,
                    paddingHorizontal: 12,
                    justifyContent: "center"
                  }}
                >
                  <Text weight="Medium" style={{ fontSize: 9 }}>
                    {title}
                  </Text>
                </View>
              )}
              sections={sections}
              extraData={selectedIds}
              keyExtractor={(item, index) => item.title + index}
            />
          </View>
          <Button
            onPress={this.hideWishlistAndPastItemsView}
            text="Next"
            color="secondary"
            borderRadius={0}
          />
        </Animated.View>
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
