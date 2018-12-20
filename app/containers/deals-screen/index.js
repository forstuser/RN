import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import I18n from "../../i18n";
import Tour from "../../components/app-tour";
import {
  API_BASE_URL,
  getAccessoriesCategory,
  getSkuWishList,
  addSkuItemToWishList,
  fetchOfferCategories,
  fetchCategoryOffers,
  getSellerOffers,
  getOffers
} from "../../api";
import { actions as uiActions } from "../../modules/ui";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import Analytics from "../../analytics";
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import TabsScreenContainer from "../../components/tabs-screen-container";
import OffersTab from "./offers-tabs";
import AccessoriesTab from "./accessories-tab";
import AccessoryCategoriesFilterModal from "./accessory-categories-filter-modal";
import { showSnackbar } from "../../utils/snackbar";
const offersIcon = require("../../images/deals.png");

const SCREEN_WIDTH = Dimensions.get("window").width;

class DealsScreen extends Component {
  static navigationOptions = {
    navBarHidden: true
  };

  tabIndex = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
      accessoryCategories: [],
      selectedAccessoryCategoryIds: [],
      selectedOfferCategory: null,
      showFilter: true,
      wishList: [],
      selectedSeller: [],
      skuItemIdsCurrentlyModifying: [],

      showFilterOffers: false,

      emptyMessage: null,
      categories: [],
      isLoading: false,
      error: null,
      selectedCategory: null,
      newProducts: [],
      discountOffers: [],
      bogo: [],
      extraQuantity: [],
      generalOffers: [],
      headerTitle: "Offers"
    };
  }
  componentDidMount() {
    // Analytics.logEvent(Analytics.EVENTS.CLICK_DEALS);
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.fetchWishlist();
        this.fetchCategories();
      }
    );
    this.handleDeeplink(this.props);
  }
  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  fetchWishlist = async () => {
    const defaultSeller = JSON.parse(
      await AsyncStorage.getItem("defaultSeller")
    );
    this.setState({ selectedSeller: defaultSeller });
    try {
      const res = await getSkuWishList();
      this.setState({ wishList: res.result.wishlist_items });
    } catch (wishListError) {
      console.log("wishListError: ", wishListError);
      //this.setState({ wishListError });
    } finally {
      this.setState({
        wishList: res.result.wishlist_items
      });
    }
  };

  componentWillReceiveProps(newProps) {
    this.handleDeeplink(newProps);
  }
  handleDeeplink = props => {
    const { navigation } = props;
    console.log("navigation: ", navigation);
    if (navigation.state.params) {
      console.log("navigation.state.params: ", navigation.state.params);
      const {
        defaultTab,
        categoryId,
        productId,
        accessoryId
      } = navigation.state.params;

      if (defaultTab == "accessories") {
        setTimeout(() => {
          this.scrollableTabView.goToPage(1);
          this.accessoriesTab.setDefaultValues({
            categoryId,
            productId,
            accessoryId
          });
        });
      }
    }
  };

  onTabChange = ({ i }) => {
    this.setState({ activeTabIndex: i });
  };

  setSelectedAccessoryCategoryIds = ids => {
    console.log("id is", ids);
    this.setState(
      {
        selectedAccessoryCategoryIds: ids
      },
      () => {
        this.accessoriesTab.getAccessoriesFirstPage();
      }
    );
  };

  showDealsTour = () => {
    if (!this.props.hasDealsFilterTooltipShown) {
      this.dealsTour.startTour();
      this.props.setUiHasDealsFilterTooltipShown(true);
    }
  };

  hideFilter = () => {
    this.setState({
      showFilter: false
    });
  };

  showFilter = () => {
    this.setState({
      showFilter: true
    });
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

  fetchCategories = async () => {
    this.setState({
      isLoading: true,
      error: null,
      selectedCategory: null,
      newProducts: [],
      discountOffers: [],
      bogo: [],
      extraQuantity: [],
      generalOffers: []
    });

    //
    const defaultSellerIdFromNotifications = this.props.navigation.getParam(
      "defaultSellerIdFromNotifications",
      null
    );
    //

    try {
      const defaultSeller = JSON.parse(
        await AsyncStorage.getItem("defaultSeller")
      );
      const result1 = await getSellerOffers();
      console.log("Seller Offer API result: ", result1);
      let resCategories = result1.result;
      const categories = resCategories.map(seller => ({
        ...seller,
        name: seller.name,
        imageUrl: `/consumer/sellers/${seller.id}/upload/1/images/0`
      }));
      this.setState({ emptyMessage: result1.message });
      let sellerIndex = 0;
      if (defaultSeller) {
        sellerIndex = categories.findIndex(
          category => category.id == defaultSeller.id
        );
      }

      //
      if (defaultSellerIdFromNotifications) {
        sellerIndex = categories.findIndex(
          category => category.id == defaultSellerIdFromNotifications
        );
      }
      //

      this.setState(
        {
          categories,
          selectedCategory:
            sellerIndex > -1 ? result1.result[sellerIndex] : result1.result[0]
        },

        () => {
          if (this.state.categories.length > 0) {
            this.fetchOffersType_0();
            this.fetchOffersType_1();
            this.fetchOffersType_2();
            this.fetchOffersType_3();
            this.fetchOffersType_4();
          }
        }
      );
    } catch (error) {
      console.log("ERROR IN SELLER OFFERS API: ", error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fetchOffersType_0 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 0);
      this.setState({ newProducts: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  fetchOffersType_1 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 1);
      this.setState({ discountOffers: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  fetchOffersType_2 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 2);
      this.setState({ bogo: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  fetchOffersType_3 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 3);
      this.setState({ extraQuantity: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  fetchOffersType_4 = async () => {
    const { selectedCategory } = this.state;
    try {
      const res = await getOffers(selectedCategory.id, 4);
      this.setState({ generalOffers: res.result });
      //console.log("RESULT IN OFFER FETCH API: ", res);
    } catch (error) {
      console.log("ERROR IN OFFER FETCH API", error);
    } finally {
      console.log("done");
    }
  };

  onCategorySelect = category => {
    this.setState({ isLoading: true });
    this.fetchWishlist();
    this.setState(
      {
        selectedCategory: category
      },
      () => {
        this.fetchOffersType_0();
        this.fetchOffersType_1();
        this.fetchOffersType_2();
        this.fetchOffersType_3();
        this.fetchOffersType_4();
      }
    );
    this.setState({ isLoading: false });
  };

  hideOfferFilter = () => {
    this.setState({ showFilterOffers: false });
  };

  showOfferFilter = () => {
    alert("Filter in Offers");
  };

  render() {
    const {
      activeTabIndex,
      selectedAccessoryCategoryIds,
      accessoryCategories,
      selectedOfferCategory,
      showFilter,
      wishList,
      selectedSeller,
      categories: [],
      isLoading,
      categories,
      error,
      emptyMessage,
      selectedCategory,
      newProducts,
      discountOffers,
      bogo,
      extraQuantity,
      headerTitle,
      generalOffers
    } = this.state;
    const collectAtStoreFlag = this.props.navigation.getParam(
      "collectAtStoreFlag",
      false
    );
    return (
      <TabsScreenContainer
        navigation={this.props.navigation}
        scrollableTabViewRef={ref => {
          this.scrollableTabView = ref;
        }}
        iconSource={offersIcon}
        title={headerTitle}
        onTabChange={this.onTabChange}
        headerRight={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 7
            }}
          >
            <TouchableOpacity
              onPress={this.showOfferFilter}
              style={{
                paddingHorizontal: 5,
                marginHorizontal: 5,
                flexDirection: "row",
                alignItems: "center"
                //borderTopRightRadius: 5,
                //borderBottomRightRadius: 5,
                //padding: 10,
                //marginRight: 5
              }}
            >
              <Icon name="md-options" size={25} color="#fff" />
              {/* {selectedBrands && selectedBrands.length > 0 ? (
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
              ) : null} */}
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingHorizontal: 5, marginHorizontal: 5 }}
              onPress={() => {
                Analytics.logEvent(Analytics.EVENTS.OPEN_CART_SHOPPING_LIST);
                this.props.navigation.push(
                  SCREENS.SHOPPING_LIST_OFFERS_SCREEN,
                  {
                    wishList,
                    selectedSeller,
                    collectAtStoreFlag: collectAtStoreFlag,
                    changeIndexQuantity: this.changeIndexQuantity
                  }
                );
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
        // headerRight={
        //   <View style={{ flexDirection: "row" }}>
        //     {activeTabIndex == 1 ? (
        //       <TouchableOpacity
        //         onPress={() => {
        //           this.props.navigation.navigate(SCREENS.ORDER_HISTORY_SCREEN);
        //         }}
        //       >
        //         <Image
        //           resizeMode="contain"
        //           style={{ width: 25, height: 25, tintColor: "#fff" }}
        //           source={require("../../images/accessory_orders_icon.png")}
        //         />
        //       </TouchableOpacity>
        //     ) : (
        //       <View />
        //     )}
        //     {(activeTabIndex == 0 && selectedOfferCategory) ||
        //     (activeTabIndex == 1 &&
        //       accessoryCategories &&
        //       accessoryCategories.length > 0 &&
        //       showFilter) ? (
        //       <TouchableOpacity
        //         ref={node => (this.filterIconRef = node)}
        //         onLayout={this.showDealsTour}
        //         style={{ marginLeft: 15, paddingHorizontal: 2 }}
        //         onPress={() =>
        //           activeTabIndex == 0
        //             ? this.offersFilterModalRef.show()
        //             : this.accessoryCategoriesFilterModal.show(
        //                 selectedAccessoryCategoryIds
        //               )
        //         }
        //       >
        //         <Icon name="md-options" color="#fff" size={30} />
        //       </TouchableOpacity>
        //     ) : (
        //       <View />
        //     )}
        //   </View>
        // }
        showNoTabs={true}
        tabs={[
          <OffersTab
            //tabLabel=""
            setOffersFilterModalRef={ref => {
              this.offersFilterModalRef = ref;
            }}
            setSelectedOfferCategory={selectedOfferCategory => {
              this.setState({ selectedOfferCategory });
            }}
            navigation={this.props.navigation}
            wishList={wishList}
            getWishList={this.fetchWishlist}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
            categories={categories}
            selectedCategory={selectedCategory}
            newProducts={newProducts}
            discountOffers={discountOffers}
            bogo={bogo}
            extraQuantity={extraQuantity}
            generalOffers={generalOffers}
            onCategorySelect={this.onCategorySelect}
          />
          // <AccessoriesTab
          //   accessoriesTabRef={ref => {
          //     this.accessoriesTab = ref;
          //   }}
          //   tabLabel="Accessories"
          //   hideFilter={this.hideFilter}
          //   showFilter={this.showFilter}
          //   ref={ref => (this.accessoriesTab = ref)}
          //   setAccessoryCategories={accessoryCategories =>
          //     this.setState({
          //       accessoryCategories,
          //       selectedAccessoryCategoryIds: []
          //     })
          //   }
          //   selectedAccessoryCategoryIds={selectedAccessoryCategoryIds}
          // />
        ]}
      >
        <AccessoryCategoriesFilterModal
          ref={ref => {
            this.accessoryCategoriesFilterModal = ref;
          }}
          accessoryCategories={accessoryCategories}
          setSelectedAccessoryCategoryIds={this.setSelectedAccessoryCategoryIds}
        />
        <Tour
          ref={ref => (this.dealsTour = ref)}
          enabled={true}
          steps={[
            { ref: this.filterIconRef, text: I18n.t("deals_filter_tip") }
          ]}
        />
      </TabsScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
    // backgroundColor: colors.pinkishOrange
  },
  header: {
    paddingBottom: 0,
    width: "100%",
    height: 110,
    zIndex: 2,
    ...Platform.select({
      ios: { height: 110, paddingTop: 20 },
      android: { height: 90, paddingTop: 0 }
    })
  },
  headerUpperHalf: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  offersIconWrapper: {
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    padding: 2,
    borderRadius: 2,
    marginRight: 5
  },
  offersIcon: {
    width: "100%",
    height: "100%",
    tintColor: colors.mainBlue
  },
  title: {
    fontSize: 18,
    color: "#fff"
  },
  subTitle: {
    fontSize: 9,
    color: "#fff"
  },
  headerLowerHalf: {
    height: 40,
    flexDirection: "row"
  },
  tab: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent"
  },
  tabUnderline: {
    backgroundColor: colors.mainBlue,
    height: 3,
    width: "50%",
    position: "absolute",
    left: 0,
    bottom: 0
  },
  tabText: {
    fontSize: 18,
    color: "#fff"
  },
  pages: {
    flex: 1,
    width: SCREEN_WIDTH * 2,
    flexDirection: "row"
  },
  page: {
    width: SCREEN_WIDTH,
    flexDirection: "row"
  }
});

const mapStateToProps = state => {
  return {
    hasDealsFilterTooltipShown: state.ui.hasDealsFilterTooltipShown
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUiHasDealsFilterTooltipShown: newValue => {
      dispatch(uiActions.setUiHasDealsFilterTooltipShown(newValue));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DealsScreen);
