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
  addSkuItemToWishList
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
      skuItemIdsCurrentlyModifying: []
    };
  }
  componentDidMount() {
    // Analytics.logEvent(Analytics.EVENTS.CLICK_DEALS);
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.fetchWishlist();
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

  render() {
    const {
      activeTabIndex,
      selectedAccessoryCategoryIds,
      accessoryCategories,
      selectedOfferCategory,
      showFilter,
      wishList,
      selectedSeller
    } = this.state;
    const collectAtStoreFlag = this.props.navigation.getParam(
      "collectAtStoreFlag",
      false
    );
    console.log("Seller in Offers_________", selectedSeller);
    return (
      <TabsScreenContainer
        navigation={this.props.navigation}
        scrollableTabViewRef={ref => {
          this.scrollableTabView = ref;
        }}
        iconSource={offersIcon}
        title="Offers"
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
