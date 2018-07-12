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
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
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
import BlueGradientBG from "../../components/blue-gradient-bg";
import SmallDot from "../../components/small-dot";

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
          isLoading: false,
          error: null,
          mainCategories: [],
          selectedCategoryIds: []
        },
        {
          type: PRODUCT_TYPES.EXPENSE,
          name: "Expenses",
          products: [],
          isLoading: false,
          error: null,
          mainCategories: [],
          selectedCategoryIds: []
        },
        {
          type: PRODUCT_TYPES.DOCUMENT,
          name: "Documents",
          products: [],
          isLoading: false,
          error: null,
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
      if (tab.selectedCategoryIds.length == 0) {
        newState.mainCategories = res.filterData;
      }
      this.updateTab(tabIndex, newState);
    } catch (error) {
      console.log("error: ", error);
      this.updateTab(tabIndex, { error });
    } finally {
      this.updateTab(tabIndex, { isLoading: false });
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
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <BlueGradientBG />
          <View style={styles.headerUpperHalf}>
            <View style={styles.ehomeIconWrapper}>
              <Image
                source={ehomeIcon}
                style={styles.ehomeIcon}
                resizeMode="contain"
              />
            </View>

            <View style={{ flex: 1, paddingRight: 20 }}>
              <Text weight="Medium" style={styles.title}>
                eHome
              </Text>
            </View>

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

          <View style={styles.headerLowerHalf} />
        </View>

        <View style={{ marginTop: -50, flex: 1 }}>
          <ScrollableTabView
            onChangeTab={this.onTabChange}
            renderTabBar={() => <DefaultTabBar />}
            tabBarUnderlineStyle={{
              backgroundColor: colors.mainBlue,
              height: 2
            }}
            tabBarBackgroundColor="transparent"
            tabBarTextStyle={{
              fontSize: 14,
              fontFamily: `Quicksand-Bold`,
              color: "#fff"
            }}
          >
            {tabs.map((tab, index) => (
              <ProductsList
                key={tab.type}
                type={tab.type}
                tabLabel={tab.name}
                onRefresh={() => this.getProductsFirstPage(index)}
                isLoading={tab.isLoading}
                products={tab.products}
                navigation={this.props.navigation}
                error={tab.error}
                onEndReached={() => this.getProducts(index)}
              />
            ))}
          </ScrollableTabView>
        </View>
        <FilterModal
          ref={node => {
            this.filterModal = node;
          }}
          mainCategories={tabs[activeTabIndex].mainCategories}
          applyFilter={this.applyFilter}
        />
      </ScreenContainer>
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
    height: 120,
    ...Platform.select({
      ios: { height: 120, paddingTop: 20 },
      android: { height: 100, paddingTop: 0 }
    })
  },
  headerUpperHalf: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  ehomeIconWrapper: {
    width: 24,
    height: 24,
    padding: 2,
    borderRadius: 2,
    marginRight: 5
  },
  ehomeIcon: {
    width: "100%",
    height: "100%",
    tintColor: "#fff",
    marginRight: 5
  },
  title: {
    fontSize: 18,
    color: "#fff"
  },

  headerLowerHalf: {
    height: 60,
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
    width: SCREEN_WIDTH / 3,
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
)(EhomeScreen);
