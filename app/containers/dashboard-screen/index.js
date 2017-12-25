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
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";

import moment from "moment";
import { openAddProductsScreen } from "../../navigation";
import { consumerGetDashboard } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import BlankDashboard from "./blank-dashboard";
import SearchHeader from "../../components/search-header";
import InsightChart from "../../components/insight-chart";
import UpcomingServicesList from "../../components/upcoming-services-list";
import UploadBillOptions from "../../components/upload-bill-options";
import AddExpenseOptions from "../../components/add-expense-options";
import { colors } from "../../theme";
import I18n from "../../i18n";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import SectionHeading from "../../components/section-heading";
import { SCREENS } from "../../constants";

const uploadFabIcon = require("../../images/ic_upload_fab.png");

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
      insightChartProps: {},
      notificationCount: 0,
      recentSearches: [],
      showUploadOptions: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
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
            screen: "AddProductScreen"
          });
          break;
      }
    }
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
        return openAddProductsScreen();
      }
      const insight = dashboardData.insight;
      const insightChartProps = {
        timeSpanText:
          moment(insight.startDate).format("MMM DD") +
          " - " +
          moment(insight.endDate).format("MMM DD"),
        filterText: I18n.t("dashboard_screen_chart_last_7_days"),
        totalSpend: insight.totalSpend,
        chartData: insight.insightData.map(item => {
          return {
            x: moment(item.purchaseDate).format("MMM DD"),
            y: item.value
          };
        })
      };

      this.setState({
        notificationCount: dashboardData.notificationCount,
        recentSearches: dashboardData.recentSearches,
        showDashboard: dashboardData.showDashboard,
        upcomingServices: dashboardData.upcomingServices,
        insightChartProps: insightChartProps
      });
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
                      text={I18n.t("dashboard_screen_whats_coming_up")}
                    />
                    <UpcomingServicesList
                      upcomingServices={this.state.upcomingServices}
                      navigator={this.props.navigator}
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
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        )}
        {!showDashboard && (
          <BlankDashboard
            onUploadButtonClick={() => this.addExpenseOptions.show()}
          />
        )}
        {showDashboard && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => this.addExpenseOptions.show()}
          >
            <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
          </TouchableOpacity>
        )}
        <AddExpenseOptions
          ref={ref => (this.addExpenseOptions = ref)}
          navigator={this.props.navigator}
        />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  sectionHeader: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10
  },
  sectionHeaderTopBorder: {
    width: 40,
    height: 2,
    backgroundColor: "#e6e6e6"
  },
  sectionHeaderText: {
    padding: 10,
    fontSize: 12
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
    width: 30,
    height: 30
  }
});

export default DashboardScreen;
