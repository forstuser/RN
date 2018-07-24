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
import Tour from "../../components/app-tour";
import { API_BASE_URL, getAccessoriesCategory } from "../../api";
import { actions as uiActions } from "../../modules/ui";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import Analytics from "../../analytics";
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import TabsScreenContainer from "../../components/tabs-screen-container";
import OffersTab from "./offers-tab";
import AccessoriesTab from "./accessories-tab";
import AccessoryCategoriesFilterModal from "./accessory-categories-filter-modal";

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
      selectedOfferCategory: null
    };
  }
  componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.CLICK_DEALS);
    this.handleDeeplink(this.props);
  }

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
    i == 0
      ? Analytics.logEvent(Analytics.EVENTS.CLICK_OFFERS)
      : Analytics.logEvent(Analytics.EVENTS.CLICK_ACCESSORIES);
    this.setState({ activeTabIndex: i });
  };

  setSelectedAccessoryCategoryIds = ids => {
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

  render() {
    const {
      activeTabIndex,
      selectedAccessoryCategoryIds,
      accessoryCategories,
      selectedOfferCategory
    } = this.state;

    return (
      <TabsScreenContainer
        scrollableTabViewRef={ref => {
          this.scrollableTabView = ref;
        }}
        iconSource={offersIcon}
        title="Offers & Accessories"
        onTabChange={this.onTabChange}
        headerRight={
          <View style={{ flexDirection: "row" }}>
            {activeTabIndex == 1 ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate(SCREENS.ORDER_HISTORY_SCREEN);
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{ width: 25, height: 25, tintColor: "#fff" }}
                  source={require("../../images/orders_icon.png")}
                />
              </TouchableOpacity>
            ) : (
              <View />
            )}
            {(activeTabIndex == 0 && selectedOfferCategory) ||
            (activeTabIndex == 1 && accessoryCategories.length > 0) ? (
              <TouchableOpacity
                ref={node => (this.filterIconRef = node)}
                onLayout={this.showDealsTour}
                style={{ marginLeft: 15, paddingHorizontal: 2 }}
                onPress={() =>
                  activeTabIndex == 0
                    ? this.offersFilterModalRef.show()
                    : this.accessoryCategoriesFilterModal.show(
                        selectedAccessoryCategoryIds
                      )
                }
              >
                <Icon name="md-options" color="#fff" size={30} />
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
        }
        tabs={[
          <OffersTab
            tabLabel="Offers"
            setOffersFilterModalRef={ref => {
              this.offersFilterModalRef = ref;
            }}
            setSelectedOfferCategory={selectedOfferCategory => {
              this.setState({ selectedOfferCategory });
            }}
          />,
          <AccessoriesTab
            accessoriesTabRef={ref => {
              this.accessoriesTab = ref;
            }}
            tabLabel="Accessories"
            ref={ref => (this.accessoriesTab = ref)}
            setAccessoryCategories={accessoryCategories =>
              this.setState({
                accessoryCategories,
                selectedAccessoryCategoryIds: []
              })
            }
            selectedAccessoryCategoryIds={selectedAccessoryCategoryIds}
          />
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
