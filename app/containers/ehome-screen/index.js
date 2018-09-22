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
  ScrollView
} from "react-native";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";
import I18n from "../../i18n";
import ProductsList from "../../components/products-list";
import Tour from "../../components/app-tour";
import { API_BASE_URL, getEhomeProducts } from "../../api";
import { actions as uiActions } from "../../modules/ui";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import TabSearchHeader from "../../components/tab-screen-header";
import Analytics from "../../analytics";
import { SCREENS, PRODUCT_TYPES } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import FilterModal from "./filter-modal";
import SmallDot from "../../components/small-dot";
import TabsScreenContainer from "../../components/tabs-screen-container";
import Tag from "../../components/tag";
import CalendarContent from "../my-calendar-screen";

const ehomeIcon = require("../../images/ehome.png");
const uploadFabIcon = require("../../images/ic_upload_fabs.png");

const SCREEN_WIDTH = Dimensions.get("window").width;

class EhomeScreen extends Component {
  static navigationOptions = {
    navBarHidden: true
  };

  tabIndex = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      recentSearches: [],
      activeTabIndex: 0,
      tabs: [
        {
          type: PRODUCT_TYPES.PRODUCT,
          name: "Products",
          products: [],
          isLoadingFirstPage: false,
          isLoading: false,
          error: null,
          endHasReached: false,
          mainCategories: [],
          selectedCategories: [],
          showEndReachedMsg: false
        },
        {
          type: PRODUCT_TYPES.EXPENSE,
          name: "Expenses",
          products: [],
          isLoadingFirstPage: false,
          isLoading: false,
          error: null,
          endHasReached: false,
          mainCategories: [],
          selectedCategories: [],
          showEndReachedMsg: false
        },
        {
          type: PRODUCT_TYPES.DOCUMENT,
          name: "Documents",
          products: [],
          isLoadingFirstPage: false,
          isLoading: false,
          error: null,
          endHasReached: false,
          mainCategories: [],
          selectedCategories: [],
          showEndReachedMsg: false
        }
      ]
    };
  }

  componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.OPEN_EHOME);

    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.getProductsFirstPage(0);
        this.getProductsFirstPage(1);
        this.getProductsFirstPage(2);
        this.calendarContent.fetchItems();
      }
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  updateTab = (index, newState) => {
    const { tabs } = this.state;
    tabs[index] = { ...tabs[index], ...newState };
    this.setState(() => ({ tabs }));
  };

  onTabChange = ({ i }) => {
    if (i > 0) this.setState({ activeTabIndex: i - 1 });
  };

  getProductsFirstPage = tabIndex => {
    this.updateTab(tabIndex, {
      endHasReached: false,
      showEndReachedMsg: false,
      isLoadingFirstPage: true
    });
    this.getProducts(tabIndex, true);
  };

  getProducts = async (tabIndex, isFirstPage = false) => {
    const { tabs } = this.state;

    if (tabs[tabIndex].isLoading) return;

    this.updateTab(tabIndex, {
      error: null,
      isLoading: true
    });

    try {
      const tab = tabs[tabIndex];
      const products = isFirstPage ? [] : tab.products;
      const res = await getEhomeProducts({
        type: tab.type,
        categoryIds: tab.selectedCategories.map(
          selectedCategory => selectedCategory.id
        ),
        offset: products.length
      });

      const newState = { products: [...products, ...res.productList] };
      if (res.productList.length < 10) {
        newState.endHasReached = true;
      }
      if (tab.selectedCategories.length == 0) {
        newState.mainCategories = res.filterData;
      }
      this.updateTab(tabIndex, newState);
      this.setState({ recentSearches: res.recentSearches });
    } catch (error) {
      console.log("error: ", error);
      this.updateTab(tabIndex, { error });
    } finally {
      this.updateTab(tabIndex, { isLoadingFirstPage: false, isLoading: false });
    }
  };

  applyFilter = selectedCategories => {
    const { activeTabIndex } = this.state;
    this.updateTab(activeTabIndex, { selectedCategories });
    this.getProductsFirstPage(activeTabIndex);
  };

  onListScroll = tabIndex => {
    this.updateTab(tabIndex, { showEndReachedMsg: true });
  };
  render() {
    const { recentSearches, activeTabIndex, tabs } = this.state;

    return (
      <TabsScreenContainer
        iconSource={ehomeIcon}
        navigation={this.props.navigation}
        title="eHome"
        onTabChange={this.onTabChange}
        headerRight={
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(SCREENS.SEARCH_SCREEN, {
                  recentSearches
                });
              }}
            >
              <Icon name="md-search" color="#fff" size={28} />
            </TouchableOpacity>

            {tabs[activeTabIndex] &&
            tabs[activeTabIndex].products.length > 0 ? (
              <TouchableOpacity
                onPress={() =>
                  this.filterModal.show({
                    selectedCategories: tabs[activeTabIndex].selectedCategories
                  })
                }
                style={{ marginLeft: 15, paddingHorizontal: 2 }}
              >
                <Icon name="md-options" color="#fff" size={30} />
                <SmallDot
                  visible={tabs[activeTabIndex].selectedCategories.length > 0}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        }
        tabs={[
          <View style={{ flex: 1 }} tabLabel="Attendance">
            <CalendarContent
              ref={node => {
                this.calendarContent = node;
              }}
              navigation={this.props.navigation}
            />
          </View>,
          ...tabs.map((tab, index) => (
            <View key={tab.type} tabLabel={tab.name} style={{ flex: 1 }}>
              {tab.selectedCategories.length > 0 ? (
                <View
                  style={{
                    height: 36,
                    paddingVertical: 5,
                    backgroundColor: "#fff"
                  }}
                >
                  <ScrollView horizontal>
                    {tab.selectedCategories.map(category => (
                      <Tag
                        key={category.name}
                        text={category.name}
                        onPressClose={() =>
                          this.filterModal.toggleCategoryAndApplyFilter(
                            category
                          )
                        }
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <View />
              )}
              <ProductsList
                type={tab.type}
                onRefresh={() => this.getProductsFirstPage(index)}
                isLoadingFirstPage={tab.isLoadingFirstPage}
                isLoading={tab.isLoading}
                products={tab.products}
                navigation={this.props.navigation}
                error={tab.error}
                onEndReached={() => this.getProducts(index)}
                endHasReached={tab.endHasReached}
                showEndReachedMsg={tab.showEndReachedMsg}
                onListScroll={() => this.onListScroll(index)}
              />
            </View>
          ))
        ]}
      >
        <FilterModal
          ref={node => {
            this.filterModal = node;
          }}
          mainCategories={
            tabs[activeTabIndex] ? tabs[activeTabIndex].mainCategories : []
          }
          applyFilter={this.applyFilter}
        />
      </TabsScreenContainer>
    );
  }
}

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
)(EhomeScreen);
