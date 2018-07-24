import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";

import { connect } from "react-redux";

import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

import Tour from "../../components/app-tour";
import Analytics from "../../analytics";
import { openAddProductsScreen } from "../../navigation";
import { consumerGetDashboard, getProfileDetail } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import BlankDashboard from "./blank-dashboard";
import TabSearchHeader from "../../components/tab-screen-header";
import InsightChart from "../../components/insight-chart";
import UpcomingServicesList from "../../components/upcoming-services-list";
import UploadBillOptions from "../../components/upload-bill-options";
import { colors, defaultStyles } from "../../theme";
import I18n from "../../i18n";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import SectionHeading from "../../components/section-heading";
import Title from "./chamfered-background-title";
import RecentProducts from "./recent-products";
import RateUsDialog from "./rate-us-dialog";

import { SCREENS, GLOBAL_VARIABLES } from "../../constants";

import ProductListItem from "../../components/product-list-item";

import { actions as uiActions } from "../../modules/ui";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";
import RecentCalenderItems from "./recent-calender-items";

const ascIcon = require("../../images/ic_nav_asc_on.png");
const chartIcon = require("../../images/ic_bars_chart.png");
const dashBoardIcon = require("../../images/ic_nav_dashboard_off.png");
const uploadFabIcon = require("../../images/ic_upload_fabs.png");

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
      recentProducts: [],
      recentCalenderItems: [],
      insightChartProps: {},
      notificationCount: 0,
      recentSearches: [],
      totalCalendarItem: 0,
      calendarItemUpdatedAt: null,
      showUploadOptions: false
    };
  }

  async componentDidMount() {
    // this.props.navigation.navigate(SCREENS.REGISTRATION_DETAILS_SCREEN);
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.screenHasDisappeared = false;
        this.fetchDashboardData();
      }
    );

    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      () => {
        this.screenHasDisappeared = true;
      }
    );

    this.fetchDashboardData();
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
    this.willBlurSubscription.remove();
  }

  fetchDashboardData = async () => {
    this.setState({
      error: null
    });
    try {
      const dashboardData = await consumerGetDashboard();
      // console.log("Dashboard Data :", dashboardData);
      // if (
      //   dashboardData.hasProducts === false &&
      //   !DashboardScreen.HAS_OPENED_ADD_PRODUCTS_SCREEN_ONCE &&
      //   !global[GLOBAL_VARIABLES.IS_ENTER_PIN_SCREEN_VISIBLE]
      // ) {
      //   DashboardScreen.HAS_OPENED_ADD_PRODUCTS_SCREEN_ONCE = true;
      //   return this.showAddProductOptionsScreen();
      // }
      const insight = dashboardData.insight;
      const insightChartProps = {
        timeSpanText:
          moment(insight.startDate).format("MMM DD") +
          " - " +
          moment(insight.endDate).format("MMM DD"),
        hideFilterDropdownIcon: true,
        filterText: I18n.t("dashboard_screen_chart_last_7_days"),
        totalSpend: insight.totalSpend,
        chartData: insight.insightData.map(item => {
          return {
            x: moment(item.purchaseDate).format("MMM DD"),
            y: item.value
          };
        })
      };

      this.setState(
        {
          notificationCount: dashboardData.notificationCount,
          recentSearches: dashboardData.recentSearches,
          showDashboard: dashboardData.showDashboard,
          upcomingServices: dashboardData.upcomingServices,
          recentProducts: dashboardData.recent_products,
          recentCalenderItems: dashboardData.recent_calendar_item,
          insightChartProps: insightChartProps,
          totalCalendarItem: dashboardData.total_calendar_item,
          calendarItemUpdatedAt: dashboardData.calendar_item_updated_at,
          isFetchingData: false
        },
        () => {
          const { rateUsDialogTimestamp } = this.props;
          setTimeout(() => {
            if (
              this.state.showDashboard &&
              !this.props.hasDashboardTourShown &&
              !this.screenHasDisappeared &&
              this.comingUpRef &&
              this.dashboardTour
            ) {
              this.dashboardTour.startTour();
              this.props.setUiHasDashboardTourShown(true);
            } else if (
              (this.state.showDashboard ||
                dashboardData.hasEazyDayItems ||
                dashboardData.knowItemsLiked) &&
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

  showAddProductOptionsScreen = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_PLUS_ICON);
    //use push here so that we can use 'replace' later
    this.props.navigation.push(SCREENS.ADD_PRODUCT_SCREEN);
  };

  openInsightScreen = props => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_EXPENSE_INSIGHT);
    this.props.navigation.navigate(SCREENS.INSIGHTS_SCREEN);
  };

  openAscScreen = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ASC);
    this.props.navigation.navigate(SCREENS.ASC_SCREEN);
  };

  render() {
    const {
      error,
      showDashboard,
      notificationCount,
      recentSearches,
      totalCalendarItem,
      calendarItemUpdatedAt,
      isFetchingData
    } = this.state;

    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#FAFAFA" }}>
        {showDashboard && (
          <View collapsable={false}>
            <TabSearchHeader
              ref="tabSearchHeader"
              title={I18n.t("dashboard_screen_title")}
              icon={dashBoardIcon}
              notificationCount={notificationCount}
              recentSearches={recentSearches}
              navigation={this.props.navigation}
            />
            <ScrollView>
              <View
                collapsable={false}
                style={{ flex: 1, marginBottom: 150, padding: 10 }}
              >
                {this.state.upcomingServices.length > 0 ? (
                  // what's coming up
                  <View collapsable={false}>
                    <Title
                      setRef={ref => (this.comingUpRef = ref)}
                      text={I18n.t("dashboard_screen_whats_coming_up")}
                    />
                    <View collapsable={false}>
                      <UpcomingServicesList
                        upcomingServices={this.state.upcomingServices}
                        navigation={this.props.navigation}
                      />
                    </View>
                  </View>
                ) : (
                  <View collapsable={false} />
                )}
                {this.state.recentProducts.length > 0 ? (
                  // recent activity
                  <View collapsable={false}>
                    <Title
                      gradientColors={["#007bce", "#00c6ff"]}
                      text={I18n.t("dashboard_screen_recent_activity")}
                    />
                    <RecentProducts
                      products={this.state.recentProducts}
                      navigation={this.props.navigation}
                    />
                  </View>
                ) : (
                  <View collapsable={false} />
                )}
                {this.state.recentCalenderItems.length > 0 ? (
                  // Calender
                  <View collapsable={false}>
                    <Title
                      gradientColors={["#429321", "#b4ec51"]}
                      text={I18n.t("my_calendar")}
                    />
                    <RecentCalenderItems
                      items={this.state.recentCalenderItems}
                      navigation={this.props.navigation}
                    />
                  </View>
                ) : (
                  <View collapsable={false} />
                )}
                {/* Expense Insights */}
                <Title
                  gradientColors={["#242841", "#707c93"]}
                  text={I18n.t("dashboard_screen_ehome_insights")}
                />
                <TouchableOpacity
                  ref={ref => (this.insightsRef = ref)}
                  onPress={() => this.openInsightScreen()}
                  style={[
                    defaultStyles.card,
                    styles.expenseInsight,
                    { marginBottom: 20 }
                  ]}
                >
                  <Image
                    style={styles.expenseInsightImage}
                    source={chartIcon}
                    resizeMode="contain"
                  />
                  <View collapsable={false} style={styles.expenseInsightTitles}>
                    <Text weight="Bold" style={styles.expenseInsightTitle}>
                      {I18n.t("dashboard_screen_total_spends")}
                    </Text>
                    <Text style={styles.expenseInsightSubTitle}>
                      {I18n.t("dashboard_screen_this_month")}
                    </Text>
                  </View>
                  <View
                    collapsable={false}
                    style={styles.expenseInsightDetails}
                  >
                    <Text weight="Bold" style={styles.expenseInsightAmount}>
                      ₹ {this.state.insightChartProps.totalSpend}
                    </Text>
                    <Text
                      weight="Medium"
                      style={styles.expenseInsightDetailsText}
                    >
                      {I18n.t("dashboard_screen_see_details")}
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* Authorised Service Centres */}

                <TouchableOpacity
                  onPress={this.openAscScreen}
                  style={[
                    defaultStyles.card,
                    styles.expenseInsight,
                    { marginBottom: 120 }
                  ]}
                >
                  <Image
                    style={[
                      styles.expenseInsightImage,
                      { tintColor: "#d20505" }
                    ]}
                    source={ascIcon}
                    resizeMode="contain"
                  />
                  <View collapsable={false} style={styles.expenseInsightTitles}>
                    <Text weight="Bold" style={[styles.expenseInsightTitle]}>
                      {I18n.t("asc_screen_title")}
                    </Text>
                    <Text style={[styles.expenseInsightSubTitle]}>
                      Find ASC for your products with one click
                    </Text>
                  </View>
                  <View
                    collapsable={false}
                    style={styles.expenseInsightDetails}
                  >
                    <Icon name="ios-arrow-forward" size={30} />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
        {!showDashboard ? (
          <BlankDashboard
            onUploadButtonClick={() => this.showAddProductOptionsScreen()}
          />
        ) : (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => this.showAddProductOptionsScreen()}
          >
            <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
          </TouchableOpacity>
        )}

        <ErrorOverlay error={error} onRetryPress={this.fetchDashboardData} />
        <LoadingOverlay visible={isFetchingData} />
        <RateUsDialog
          ref={ref => (this.rateUsDialog = ref)}
          setRateUsDialogTimestamp={this.props.setRateUsDialogTimestamp}
        />
        <Tour
          ref={ref => (this.dashboardTour = ref)}
          enabled={true}
          steps={[
            { ref: this.comingUpRef, text: I18n.t("coming_up_tip") },
            { ref: this.insightsRef, text: I18n.t("insights_tip") }
          ]}
        />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
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
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    zIndex: 2,
    backgroundColor: colors.tomato,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  uploadFabIcon: {
    width: 25,
    height: 25
  }
});

const mapStateToProps = state => {
  return {
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
    },
    setLoggedInUser: user => {
      dispatch(loggedInUserActions.setLoggedInUser(user));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardScreen);
