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

import BlueGradientBG from "../../components/blue-gradient-bg";

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
      products: [],
      isLoadingProducts: false,
      productsError: null,
      expenses: [],
      isLoadingExpenses: false,
      expensesError: null,
      documents: [],
      isLoadingDocuments: false,
      documentsError: null
    };
  }

  componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.OPEN_EHOME);
    this.getProductsFirstPage(0);
    this.getProductsFirstPage(1);
    this.getProductsFirstPage(2);
  }

  onTabChange = ({ i }) => {
    this.setState({ activeTabIndex: i });
  };

  getProductsFirstPage = tabIndex => {
    const newState = {
      products: this.state.products,
      expenses: this.state.expenses,
      documents: this.state.documents
    };
    switch (tabIndex) {
      case 0:
        newState.products = [];
        break;
      case 1:
        newState.expenses = [];
        break;
      case 2:
        newState.documents = [];
        break;
    }

    this.setState(newState, () => {
      this.getProducts(tabIndex);
    });
  };
  getProducts = async tabIndex => {
    const { products, expenses, documents } = this.state;
    try {
      switch (tabIndex) {
        case 0:
          this.setState({
            productsError: null,
            isLoadingProducts: true
          });
          break;
        case 1:
          this.setState({
            expensesError: null,
            isLoadingExpenses: true
          });
          break;
        case 2:
          this.setState({
            documentsError: null,
            isLoadingDocuments: true
          });
          break;
      }
      const res = await getEhomeProducts({ type: tabIndex + 1 });
      switch (tabIndex) {
        case 0:
          this.setState({
            products: [...products, ...res.productList]
          });
          break;
        case 1:
          this.setState({
            expenses: [...expenses, ...res.productList]
          });
          break;
        case 2:
          this.setState({
            documents: [...documents, ...res.productList]
          });
          break;
      }
    } catch (e) {
      console.log("e: ", e);
      switch (tabIndex) {
        case 0:
          this.setState({
            productsError: e
          });
          break;
        case 1:
          this.setState({
            expensesError: e
          });
          break;
        case 2:
          this.setState({
            documentsError: e
          });
          break;
      }
    } finally {
      switch (tabIndex) {
        case 0:
          this.setState({
            isLoadingProducts: false
          });
          break;
        case 1:
          this.setState({
            isLoadingExpenses: false
          });
          break;
        case 2:
          this.setState({
            isLoadingDocuments: false
          });
          break;
      }
    }
  };

  render() {
    const {
      activeTabIndex,
      products,
      expenses,
      documents,
      isLoadingProducts,
      isLoadingExpenses,
      isLoadingDocuments,
      productsError,
      expensesError,
      documentsError
    } = this.state;

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
              onPress={() => {
                this.props.navigation.navigate(SCREENS.SEARCH_SCREEN);
              }}
            >
              <Image
                resizeMode="contain"
                style={{ width: 25, height: 25, tintColor: "#fff" }}
                source={require("../../images/ic_top_search.png")}
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
            <ProductsList
              type={PRODUCT_TYPES.PRODUCT}
              tabLabel="Products"
              onRefresh={() => this.getProductsFirstPage(0)}
              isLoading={isLoadingProducts}
              products={products}
              navigation={this.props.navigation}
              error={productsError}
            />
            <ProductsList
              type={PRODUCT_TYPES.EXPENSE}
              tabLabel="Expenses"
              onRefresh={() => this.getProductsFirstPage(1)}
              isLoading={isLoadingExpenses}
              products={expenses}
              navigation={this.props.navigation}
              error={expensesError}
            />
            <ProductsList
              type={PRODUCT_TYPES.DOCUMENT}
              tabLabel="Documents"
              onRefresh={() => this.getProductsFirstPage(2)}
              isLoading={isLoadingDocuments}
              products={documents}
              navigation={this.props.navigation}
              error={documentsError}
            />
          </ScrollableTabView>
        </View>
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
