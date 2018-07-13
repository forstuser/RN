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
  Dimensions
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

const ehomeIcon = require("../../images/ehome.png");

const SCREEN_WIDTH = Dimensions.get("window").width;

class EhomeScreen extends Component {
  static navigationOptions = {
    navBarHidden: true
  };

  tabIndex = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
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
          selectedCategoryIds: []
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
          selectedCategoryIds: []
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
          selectedCategoryIds: []
        }
      ]
    };
  }

  componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.OPEN_EHOME);
    this.getProductsFirstPage(0);
    this.getProductsFirstPage(1);
    this.getProductsFirstPage(2);
  }

  updateTab = (index, newState) => {
    const { tabs } = this.state;
    tabs[index] = { ...tabs[index], ...newState };
    this.setState(() => ({ tabs }));
  };

  onTabChange = ({ i }) => {
    this.setState({ activeTabIndex: i });
  };

  getProductsFirstPage = tabIndex => {
    this.updateTab(tabIndex, {
      endHasReached: false,
      isLoadingFirstPage: true
    });
    this.getProducts(tabIndex, true);
  };

  getProducts = async (tabIndex, isFirstPage = false) => {
    this.updateTab(tabIndex, {
      error: null,
      isLoading: true
    });

    try {
      const { tabs } = this.state;
      const tab = tabs[tabIndex];
      const products = isFirstPage ? [] : tab.products;
      const res = await getEhomeProducts({
        type: tab.type,
        categoryIds: tab.selectedCategoryIds,
        offset: products.length
      });

      const newState = { products: [...products, ...res.productList] };
      if (res.productList.length == 0) {
        newState.endHasReached = true;
      }
      if (tab.selectedCategoryIds.length == 0) {
        newState.mainCategories = res.filterData;
      }
      this.updateTab(tabIndex, newState);
    } catch (error) {
      console.log("error: ", error);
      this.updateTab(tabIndex, { error });
    } finally {
      this.updateTab(tabIndex, { isLoadingFirstPage: false, isLoading: false });
    }
  };

  applyFilter = selectedCategoryIds => {
    const { activeTabIndex } = this.state;
    this.updateTab(activeTabIndex, { selectedCategoryIds });
    this.getProductsFirstPage(activeTabIndex);
  };

  render() {
    const { activeTabIndex, tabs } = this.state;

    return (
      <TabsScreenContainer
        iconSource={ehomeIcon}
        title="eHome"
        onTabChange={this.onTabChange}
        headerRight={
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                this.props.navigation.navigate(SCREENS.SEARCH_SCREEN);
              }}
            >
              <Icon name="md-search" color="#fff" size={28} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.filterModal.show({
                  selectedCategoryIds: tabs[activeTabIndex].selectedCategoryIds
                })
              }
              style={{ marginLeft: 15, paddingHorizontal: 2 }}
            >
              <Icon name="md-options" color="#fff" size={30} />
              <SmallDot
                visible={tabs[activeTabIndex].selectedCategoryIds.length > 0}
              />
            </TouchableOpacity>
          </View>
        }
        tabs={tabs.map((tab, index) => (
          <ProductsList
            key={tab.type}
            type={tab.type}
            tabLabel={tab.name}
            onRefresh={() => this.getProductsFirstPage(index)}
            isLoadingFirstPage={tab.isLoadingFirstPage}
            isLoading={tab.isLoading}
            products={tab.products}
            navigation={this.props.navigation}
            error={tab.error}
            onEndReached={() => this.getProducts(index)}
            endHasReached={tab.endHasReached}
          />
        ))}
      >
        <FilterModal
          ref={node => {
            this.filterModal = node;
          }}
          mainCategories={tabs[activeTabIndex].mainCategories}
          applyFilter={this.applyFilter}
        />
      </TabsScreenContainer>
    );
  }
}

const styles = StyleSheet.create({});

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
