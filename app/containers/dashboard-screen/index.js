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
import SearchHeader from "../../components/search-header";
import InsightChart from "../../components/insight-chart";
import UpcomingServicesList from "../../components/upcoming-services-list";
import UploadBillOptions from "../../components/upload-bill-options";
import AddExpenseModal from "../../components/add-expense-modal";
import { colors } from "../../theme";
import I18n from "../../i18n";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import SectionHeading from "../../components/section-heading";
import { SCREENS } from "../../constants";

import ProductListItem from "../../components/product-list-item";

import { actions as uiActions } from "../../modules/ui";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";

const uploadFabIcon = require("../../images/ic_upload_fabs.png");

class DashboardScreen extends React.Component {
  static HAS_OPENED_ADD_PRODUCTS_SCREEN_ONCE = false;
  static navigatorStyle = {
    navBarHidden: true
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
      showUploadOptions: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    if (this.props.screenOpts) {
      const screenOpts = this.props.screenOpts;
      switch (screenOpts.startScreen) {
        case SCREENS.MAILBOX_SCREEN:
          this.refs.searchHeader.openMailboxScreen();
          break;
        case SCREENS.INSIGHTS_SCREEN:
          this.openInsightScreen({ screenOpts: screenOpts });
          break;
        case SCREENS.ADD_PRODUCT_SCREEN:
          this.props.navigator.push({
            screen: SCREENS.ADD_PRODUCT_SCREEN
          });
          break;
        case SCREENS.UPLOAD_DOCUMENT_SCREEN:
          this.props.navigator.push({
            screen: SCREENS.UPLOAD_DOCUMENT_SCREEN
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
        this.fetchDashboardData();
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
        !dashboardData.hasProducts &&
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
          insightChartProps: insightChartProps
        },
        () => {
          if (this.state.showDashboard && !this.props.hasDashboardTourShown) {
            setTimeout(() => this.dashboardTour.startTour(), 1000);
            this.props.setUiHasDashboardTourShown(true);
          }
          // if(insight.totalSpend==0){

          // }
        }
      );
    } catch (error) {
      this.setState({
        error
      });
    }
    this.setState({
      isFetchingData: false
    });
  };

  showUploadOptions = () => {
    this.setState({
      showUploadOptions: true
    });
  };

  showAddProductOptionsScreen = () => {
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

  render() {
    const {
      error,
      showDashboard,
      notificationCount,
      recentSearches,
      isFetchingData
    } = this.state;

    return (
      <ScreenContainer style={{ padding: 0 }}>
        <ErrorOverlay error={error} onRetryPress={this.fetchDashboardData} />
        <LoadingOverlay visible={isFetchingData} />
        {showDashboard && (
          <View>
            <SearchHeader
              ref="searchHeader"
              screen="dashboard"
              notificationCount={notificationCount}
              recentSearches={recentSearches}
              navigator={this.props.navigator}
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled>
              <View style={{ flex: 1, marginBottom: 150 }}>
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
                <View style={{ paddingHorizontal: 16 }}>
                  <InsightChart {...this.state.insightChartProps} />
                  <TouchableOpacity
                    onPress={() => this.openInsightScreen()}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 16,
                      bottom: 0,
                      right: 16
                    }}
                  />
                </View>
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

        <AddExpenseModal
          ref={ref => (this.addExpenseModal = ref)}
          navigator={this.props.navigator}
        />

        <Tour
          ref={ref => (this.dashboardTour = ref)}
          enabled={true}
          steps={[
            { ref: this.comingUpRef, text: I18n.t("app_tour_tips_6") },
            { ref: this.ehomeTabItemRef, text: I18n.t("app_tour_tips_2") },
            { ref: this.ascTabItemRef, text: I18n.t("app_tour_tips_3") }
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
        </View>
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
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
    bottom: -48,
    height: 48,
    flexDirection: "row"
  },
  dummyForTooltip: {
    flex: 1
  }
});

const mapStateToProps = state => {
  return {
    hasDashboardTourShown: state.ui.hasDashboardTourShown
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
