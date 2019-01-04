import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  BackHandler
} from "react-native";

import { connect } from "react-redux";

import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

import Tour from "../../components/app-tour";
import Analytics from "../../analytics";
import { openAddProductsScreen } from "../../navigation";
import { consumerGetDashboard, getProfileDetail } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
//import BlankDashboard from "./blank-dashboard";
import CircularTabs from "../../components/circular-tabs";
import TabSearchHeader from "../../components/tab-screen-header2";
import InsightChart from "../../components/insight-chart";
import UpcomingServiceItem from "./upcoming-service-item";
import UpcomingServiceContent from "./upcoming-services-content";
import UploadBillOptions from "../../components/upload-bill-options";
import { colors, defaultStyles } from "../../theme";
import I18n from "../../i18n";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import SectionHeading from "../../components/section-heading";
import Title from "./chamfered-background-title";
import RecentProducts from "./recent-products";
import RateUsDialog from "./rate-us-dialog";

import { SCREENS, GLOBAL_VARIABLES, LOCATIONS } from "../../constants";

import ProductListItem from "../../components/product-list-item";

import { actions as uiActions } from "../../modules/ui";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";
import RecentCalenderItems from "./recent-calender-items";
import AscContent from "./asc-content";
import ExpenseInsightsContent from "./expense-insights-content";
import CalendarContent from "../my-calendar-screen";
import ActiveOrdersScreen from "../active-orders-screen";
import store from "../../store";
import Modal from "../../components/modal";

const ascIcon = require("../../images/ic_nav_asc_on.png");
const chartIcon = require("../../images/ic_bars_chart.png");
const dashBoardIcon = require("../../images/ic_nav_dashboard_off.png");
const uploadFabIcon = require("../../images/ic_upload_fabs.png");

const whatsComingIcon = require("../../images/bullhorn.png");

class DashboardScreen extends React.Component {
  static HAS_OPENED_ADD_PRODUCTS_SCREEN_ONCE = false;
  static navigationOptions = {};

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingData: true,
      showDashboard: true,
      upcomingServices: [],
      notificationCount: 0,
      recentSearches: [],
      activeTabIndex: 0,
      isVisibleShopAndEarnModal: false,
      modalTitle: "",
      modalContent: ""
    };
  }

  async componentWillMount() {
    // const r = await getProfileDetail();
    // const user = r.userProfile;
    // //const user = store.getState().loggedInUser;
    // //console.log("USER ON START_____________", user);
    // //console.log("LOCATION ON START_____________", user.location);
    // if (user.location == LOCATIONS.GURGAON) {
    //   this.props.setUiHasDashboardTourShown(true);
    //   this.props.navigation.navigate(SCREENS.MY_SELLERS_SCREEN);
    // }
  }

  async componentDidMount() {
    // const user = store.getState().loggedInUser;
    // if (user.location == LOCATIONS.GURGAON) {
    //   this.props.setUiHasDashboardTourShown(true);
    //   this.props.navigation.navigate(SCREENS.MY_SELLERS_SCREEN);
    // }
    // this.props.navigation.navigate(SCREENS.REGISTRATION_DETAILS_SCREEN);
    // BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    // this.didFocusSubscription = this.props.navigation.addListener(
    //   "didFocus",
    //   () => {
    this.screenHasDisappeared = false;
    this.fetchDashboardData();
    this.expenseInsightContent.fetchCategories();
    this.activeOrdersContent.fetchActiveOrders();
    //this.ascContent.fetchProducts();
    //this.calendarContent.fetchItems();
    //
    // this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
    //   orderId: 29
    // });
    //this.setState({ isVisibleShopAndEarnModal: true });
    // }
    // );

    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      () => {
        this.screenHasDisappeared = true;
      }
    );
    // this.fetchDashboardData();
  }

  componentWillReceiveProps() {
    // alert("dashboard will recieve props");
    this.screenHasDisappeared = false;
    this.fetchDashboardData();
    this.expenseInsightContent.fetchCategories();
    this.activeOrdersContent.fetchActiveOrders();
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
    this.willBlurSubscription.remove();
    // BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  // handleBackPress = () => {
  //   BackHandler.exitApp();
  // };
  closeShopAndEarnModal = () => {
    this.setState({ isVisibleShopAndEarnModal: false });
  };

  onPressShopAndEarn = () => {
    this.setState({ isVisibleShopAndEarnModal: false });
    this.props.navigation.navigate(SCREENS.CREATE_SHOPPING_LIST_SCREEN);
  };

  fetchDashboardData = async () => {
    this.setState({
      error: null
    });
    try {
      const dashboardData = await consumerGetDashboard();
      console.log("Dashboard Data____________________:", dashboardData);
      this.setState(
        {
          modalTitle: dashboardData.pop_up_title,
          modalContent: dashboardData.pop_up_content
        },
        () => {
          const { userLocation } = this.props;
          // if (
          //   dashboardData.current_counter <= dashboardData.pop_up_counter &&
          //   userLocation != LOCATIONS.OTHER
          // ) {
          //   this.setState({ isVisibleShopAndEarnModal: true });
          // }
        }
      );

      this.setState(
        {
          notificationCount: dashboardData.notificationCount,
          recentSearches: dashboardData.recentSearches,
          upcomingServices: dashboardData.upcomingServices,
          isFetchingData: false
        },
        () => {
          const { rateUsDialogTimestamp } = this.props;
          setTimeout(() => {
            if (
              !this.props.hasDashboardTourShown &&
              !this.screenHasDisappeared &&
              this.comingUpRef &&
              this.dashboardTour
            ) {
              this.dashboardTour.startTour();
              this.props.setUiHasDashboardTourShown(true);
            } else if (
              this.props.appOpenCount > 6 &&
              (!rateUsDialogTimestamp ||
                moment().diff(
                  moment(rateUsDialogTimestamp).startOf("day"),
                  "days"
                ) > 7)
            ) {
              this.rateUsDialog.show();
            }
          }, 1000);
        }
      );
    } catch (error) {
      console.log("error: ", error);
      this.setState({
        error,
        isFetchingData: false
      });
    }
  };

  showUploadOptions = () => {
    this.setState({
      showUploadOptions: true
    });
  };

  openInsightScreen = props => {
    // Analytics.logEvent(Analytics.EVENTS.CLICK_ON_EXPENSE_INSIGHT);
    this.props.navigation.navigate(SCREENS.INSIGHTS_SCREEN);
  };

  openAscScreen = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ASC);
    this.props.navigation.navigate(SCREENS.ASC_SCREEN);
  };

  onTabIndexChange = activeTabIndex => {
    this.setState({ activeTabIndex });
  };

  render() {
    const { userLocation } = this.props;

    const {
      error,
      showDashboard,
      notificationCount,
      recentSearches,
      upcomingServices,
      isFetchingData,
      activeTabIndex,
      isVisibleShopAndEarnModal
    } = this.state;

    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fff" }}>
        <TabSearchHeader
          showSearchInput={false}
          ref="tabSearchHeader"
          title={I18n.t("dashboard_screen_title")}
          // icon={dashBoardIcon}
          notificationCount={notificationCount}
          recentSearches={recentSearches}
          navigation={this.props.navigation}
          dykRef={ref => (this.dykIconref = ref)}
          mailboxRef={ref => (this.mailboxIconref = ref)}
        />
        <View style={styles.container}>
          <CircularTabs
            onTabIndexChange={this.onTabIndexChange}
            tabs={[
              {
                tabRef: ref => {
                  this.activeOrderRef = ref;
                },
                title: "Active Orders",
                imageSource: require("../../images/active_orders.png"),
                content: (
                  <ActiveOrdersScreen
                    ref={node => {
                      this.activeOrdersContent = node;
                    }}
                    navigation={this.props.navigation}
                  />
                )
              },
              {
                tabRef: ref => {
                  this.comingUpRef = ref;
                },
                title: "What’s Due",
                imageSource: whatsComingIcon,
                content: (
                  <UpcomingServiceContent
                    upcomingServices={upcomingServices}
                    navigation={this.props.navigation}
                  />
                )
              },
              {
                tabRef: ref => {
                  this.insightsRef = ref;
                },
                title: "Expense Insights",
                imageSource: require("../../images/bar_chart_icon.png"),
                content: (
                  <ExpenseInsightsContent
                    ref={node => {
                      this.expenseInsightContent = node;
                    }}
                    navigation={this.props.navigation}
                  />
                )
              }
              // {
              //   tabRef: ref => {
              //     this.ascRef = ref;
              //   },
              //   title: "Service Centres",
              //   imageSource: require("../../images/asc_icon.png"),
              //   content: (
              //     <AscContent
              //       ref={node => {
              //         this.ascContent = node;
              //       }}
              //       navigation={this.props.navigation}
              //     />
              //   )
              // }
            ]}
          />
        </View>

        <ErrorOverlay error={error} onRetryPress={this.fetchDashboardData} />
        <LoadingOverlay visible={isFetchingData} />
        <RateUsDialog
          ref={ref => (this.rateUsDialog = ref)}
          setRateUsDialogTimestamp={this.props.setRateUsDialogTimestamp}
        />
        <View collapsable={false} style={styles.dummiesForTooltips}>
          <View collapsable={false} style={styles.dummyForTooltip} />
          <View
            collapsable={false}
            ref={ref => (this.dealsTabItemRef = ref)}
            style={styles.dummyForTooltip}
          />
          <View
            collapsable={false}
            ref={ref => (this.shopAndEarn = ref)}
            style={styles.dummyForTooltip}
          />
          <View
            collapsable={false}
            style={styles.dummyForTooltip}
            ref={ref => (this.mySeller = ref)}
          />
          <View
            collapsable={false}
            ref={ref => (this.ehomeTabItemRef = ref)}
            style={styles.dummyForTooltip}
          />
        </View>
        <Tour
          ref={ref => (this.dashboardTour = ref)}
          enabled={true}
          steps={[
            { ref: this.dealsTabItemRef, text: I18n.t("deals_tip") },
            { ref: this.shopAndEarn, text: I18n.t("shop_n_earn") },
            { ref: this.mySeller, text: I18n.t("my_seller_tip") },
            { ref: this.ehomeTabItemRef, text: I18n.t("ehome_tip") },
            { ref: this.comingUpRef, text: I18n.t("coming_up_tip") },
            { ref: this.insightsRef, text: I18n.t("insights_tip") },
            { ref: this.dykIconref, text: I18n.t("do_you_know_tip") },
            { ref: this.mailboxIconref, text: I18n.t("mailbox_tip") },
            { ref: this.addProductBtnRef, text: I18n.t("plus_btn_tip") }
            //{ ref: this.calendarRef, text: I18n.t("attendance_tip") }
            //{ ref: this.ascRef, text: I18n.t("asc_tip") }
          ]}
        />
        <Modal
          isVisible={isVisibleShopAndEarnModal}
          title={this.state.modalTitle}
          style={{
            height: 350,
            ...defaultStyles.card
          }}
          onClosePress={this.closeShopAndEarnModal}
        >
          <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: "center"
            }}
          >
            <View
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
            </View>
            <Text
              weight="Light"
              style={{ fontSize: 14, textAlign: "center", padding: 10 }}
            >
              {this.state.modalContent}
            </Text>
            <Button
              text="Shop & Earn Now"
              onPress={this.onPressShopAndEarn}
              style={{
                width: 200,
                alignSelf: "center",
                marginTop: 15,
                height: 40
              }}
              color="secondary"
            />
          </View>
        </Modal>
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...defaultStyles.card,
    position: "absolute",

    left: 10,
    right: 10,
    bottom: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 2,
    ...Platform.select({
      android: { top: 48 },
      ios: { top: 68 }
    })
  },
  expenseInsight: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row"
  },
  expenseInsightImage: {
    height: 36,
    width: 36,
    marginRight: 20
  },
  expenseInsightTitles: {
    flex: 1
  },
  expenseInsightSubTitle: {
    fontSize: 12
  },
  expenseInsightDetailsText: {
    fontSize: 12,
    color: colors.pinkishOrange
  },
  uploadFabIcon: {
    width: 25,
    height: 25
  },
  dummiesForTooltips: {
    position: "absolute",
    width: "100%",
    bottom: -68,
    height: 68,
    flexDirection: "row",
    backgroundColor: "transparent"
  },
  dummyForTooltip: {
    flex: 1,
    height: "100%",
    opacity: 1
  }
});

const mapStateToProps = state => {
  return {
    userLocation: state.loggedInUser.location,
    hasDashboardTourShown: state.ui.hasDashboardTourShown,
    rateUsDialogTimestamp: state.ui.rateUsDialogTimestamp,
    appOpenCount: state.ui.appOpenCount
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRateUsDialogTimestamp: timestamp => {
      dispatch(uiActions.setRateUsDialogTimestamp(timestamp));
    },
    setUiHasDashboardTourShown: newValue => {
      dispatch(uiActions.setUiHasDashboardTourShown(newValue));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardScreen);
