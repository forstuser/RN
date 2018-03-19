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
import { colors } from "../../theme";
import I18n from "../../i18n";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import SectionHeading from "../../components/section-heading";
import { SCREENS } from "../../constants";

import ProductListItem from "../../components/product-list-item";

import { actions as uiActions } from "../../modules/ui";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";

const chartIcon = require("../../images/ic_bar_chart.png");
const dashBoardIcon = require("../../images/ic_nav_dashboard_off.png");
const uploadFabIcon = require("../../images/ic_upload_fabs.png");

class DashboardScreen extends React.Component {
  static HAS_OPENED_ADD_PRODUCTS_SCREEN_ONCE = false;
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: false
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingData: true,
      showDashboard: true,
      upcomingServices: [],
      recentActivitiesProduct: null,
      insightChartProps: {},
      notificationCount: 0,
      recentSearches: [],
      showUploadOptions: false,
      showAddProductOptionsScreenOnAppear: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    const { rateUsDialogTimestamp } = this.props;

    if (
      !rateUsDialogTimestamp ||
      moment().diff(moment(rateUsDialogTimestamp).startOf("day"), "days") > 7
    ) {
      this.props.navigator.showModal({
        screen: SCREENS.RATE_US_SCREEN,
        animationType: "none"
      });
    }

    if (this.props.screenOpts) {
      const screenOpts = this.props.screenOpts;
      switch (screenOpts.startScreen) {
        case SCREENS.MAILBOX_SCREEN:
          this.refs.tabSearchHeader.openMailboxScreen();
          break;
        case SCREENS.INSIGHTS_SCREEN:
          this.openInsightScreen({ screenOpts: screenOpts });
          break;
        case SCREENS.ADD_PRODUCT_SCREEN:
          this.props.navigator.push({
            screen: SCREENS.ADD_PRODUCT_SCREEN
          });
          break;
        case SCREENS.DIRECT_UPLOAD_DOCUMENT_SCREEN:
          this.props.navigator.push({
            screen: SCREENS.DIRECT_UPLOAD_DOCUMENT_SCREEN,
            passProps: {
              showAddProductOptionsScreenOnAppear: this
                .showAddProductOptionsScreenOnAppear
            }
          });
          break;
        case SCREENS.TIPS_SCREEN:
          this.props.navigator.push({
            screen: SCREENS.TIPS_SCREEN
          });
          break;
      }
    }

    const r = await getProfileDetail();
    const user = r.userProfile;
    this.props.setLoggedInUser({
      id: user.id,
      name: user.name,
      phone: user.mobile_no
    });
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.screenHasDisappeared = false;
        if (this.state.showAddProductOptionsScreenOnAppear) {
          this.showAddProductOptionsScreen();
        }
        this.fetchDashboardData();
        break;
      case "didDisappear":
        this.screenHasDisappeared = true;
        break;
    }
  };

  fetchDashboardData = async () => {
    this.setState({
      error: null,
      isFetchingData: true
    });
    try {
      const dashboardData = await consumerGetDashboard();
      if (
        dashboardData.hasProducts === false &&
        !DashboardScreen.HAS_OPENED_ADD_PRODUCTS_SCREEN_ONCE
      ) {
        DashboardScreen.HAS_OPENED_ADD_PRODUCTS_SCREEN_ONCE = true;
        return this.showAddProductOptionsScreen();
      }
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
          recentActivitiesProduct: dashboardData.product,
          insightChartProps: insightChartProps,
          isFetchingData: false
        },
        () => {
          if (this.state.showDashboard && !this.props.hasDashboardTourShown) {
            setTimeout(() => {
              if (!this.screenHasDisappeared) {
                this.dashboardTour.startTour();
                this.props.setUiHasDashboardTourShown(true);
              }
            }, 1000);
          }
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

  showAddProductOptionsScreenOnAppear = () => {
    this.setState({
      showAddProductOptionsScreenOnAppear: true
    });
  };

  showAddProductOptionsScreen = () => {
    this.setState({
      showAddProductOptionsScreenOnAppear: false
    });
    Analytics.logEvent(Analytics.EVENTS.CLICK_PLUS_ICON);
    this.props.navigator.showModal({
      screen: SCREENS.ADD_PRODUCT_OPTIONS_SCREEN
    });
  };

  openInsightScreen = props => {
    this.props.navigator.push({
      screen: SCREENS.INSIGHTS_SCREEN,
      passProps: props || {}
    });
  };

  openMyCalendarScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.MY_CALENDAR_SCREEN
    });
  };

  render() {
    const {
      error,
      showDashboard,
      notificationCount,
      recentSearches,
      isFetchingData
    } = this.state;

    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#FAFAFA" }}>
        {showDashboard && (
          <View>
            <TabSearchHeader
              ref="tabSearchHeader"
              title={I18n.t("dashboard_screen_title")}
              icon={dashBoardIcon}
              notificationCount={notificationCount}
              recentSearches={recentSearches}
              navigator={this.props.navigator}
            />
            <ScrollView>
              <View style={{ flex: 1, marginBottom: 150 }}>
                <TouchableOpacity onPress={this.openMyCalendarScreen}>
                  <Text style={{ paddingTop: 20, textAlign: "center" }}>
                    My Calendar
                  </Text>
                </TouchableOpacity>
                {this.state.upcomingServices.length > 0 && (
                  <View>
                    <SectionHeading
                      setRef={ref => (this.comingUpRef = ref)}
                      text={I18n.t("dashboard_screen_whats_coming_up")}
                    />
                    <UpcomingServicesList
                      upcomingServices={this.state.upcomingServices}
                      navigator={this.props.navigator}
                    />
                  </View>
                )}
                {this.state.recentActivitiesProduct && (
                  <View>
                    <SectionHeading
                      text={I18n.t("dashboard_screen_recent_activity")}
                    />
                    <ProductListItem
                      product={this.state.recentActivitiesProduct}
                      navigator={this.props.navigator}
                      hideViewBillBtn={true}
                      hideDirectionsAndCallBtns={true}
                    />
                  </View>
                )}
                <SectionHeading
                  text={I18n.t("dashboard_screen_ehome_insights")}
                />

                <TouchableOpacity
                  onPress={() => this.openInsightScreen()}
                  style={styles.expenseInsight}
                >
                  <Image
                    style={styles.expenseInsightImage}
                    source={chartIcon}
                    resizeMode="contain"
                  />
                  <View style={styles.expenseInsightTitles}>
                    <Text weight="Bold" style={styles.expenseInsightTitle}>
                      {I18n.t("dashboard_screen_total_spends")}
                    </Text>
                    <Text style={styles.expenseInsightSubTitle}>
                      {I18n.t("dashboard_screen_this_month")}
                    </Text>
                  </View>
                  <View style={styles.expenseInsightDetails}>
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
              </View>
            </ScrollView>
          </View>
        )}
        {!showDashboard && (
          <BlankDashboard
            onUploadButtonClick={() => this.showAddProductOptionsScreen()}
          />
        )}
        {showDashboard && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => this.showAddProductOptionsScreen()}
          >
            <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
          </TouchableOpacity>
        )}
        <ErrorOverlay error={error} onRetryPress={this.fetchDashboardData} />
        <LoadingOverlay visible={isFetchingData} />
        <Tour
          ref={ref => (this.dashboardTour = ref)}
          enabled={true}
          steps={[
            { ref: this.ehomeTabItemRef, text: I18n.t("app_tour_tips_2") },
            { ref: this.ascTabItemRef, text: I18n.t("app_tour_tips_3") },
            { ref: this.comingUpRef, text: I18n.t("app_tour_tips_6") }
          ]}
        />
        <View style={styles.dummiesForTooltips}>
          <View style={styles.dummyForTooltip} />
          <View
            ref={ref => (this.ehomeTabItemRef = ref)}
            style={styles.dummyForTooltip}
          />
          <View
            ref={ref => (this.ascTabItemRef = ref)}
            style={styles.dummyForTooltip}
          />
          <View style={styles.dummyForTooltip} />
          <View style={styles.dummyForTooltip} />
        </View>
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  expenseInsight: {
    backgroundColor: "#fff",
    borderColor: "#eaeaea",
    borderWidth: 1,
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
    hasDashboardTourShown: state.ui.hasDashboardTourShown,
    rateUsDialogTimestamp: state.ui.rateUsDialogTimestamp
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUiHasDashboardTourShown: newValue => {
      dispatch(uiActions.setUiHasDashboardTourShown(newValue));
    },
    setLoggedInUser: user => {
      dispatch(loggedInUserActions.setLoggedInUser(user));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
