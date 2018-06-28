import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  FlatList
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
import CircularTabs from "../../components/circular-tabs";
import TabSearchHeader from "../../components/tab-screen-header2";
import InsightChart from "../../components/insight-chart";
import UpcomingServiceItem from "./upcoming-service-item";
import UpcomingServiceItems from "./upcoming-services-list";
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
import AscContent from "./asc-content";
import ExpenseInsightsContent from "./expense-insights-content";

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
      recentSearches: []
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

      this.setState(
        {
          notificationCount: dashboardData.notificationCount,
          recentSearches: dashboardData.recentSearches,
          showDashboard: dashboardData.showDashboard,
          upcomingServices: dashboardData.upcomingServices,
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
              // this.dashboardTour.startTour();
              // this.props.setUiHasDashboardTourShown(true);
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
      upcomingServices,
      isFetchingData
    } = this.state;

    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fff" }}>
        <TabSearchHeader
          showSearchInput={false}
          ref="tabSearchHeader"
          title={I18n.t("dashboard_screen_title")}
          icon={dashBoardIcon}
          notificationCount={notificationCount}
          recentSearches={recentSearches}
          navigation={this.props.navigation}
        />
        <View style={styles.container}>
          <CircularTabs
            tabs={[
              {
                title: "What’s Coming",
                imageSource: whatsComingIcon,
                content:
                  upcomingServices.length == 0 ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <View
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: "#EAF6FC"
                          }}
                        />
                        {/* <Icon
                          name="ios-notifications-outline"
                          color="#D3D3D3"
                          size={100}
                          style={{ marginTop: -65 }}
                        /> */}
                        <Image
                          style={{ width: 80, height: 90, marginTop: -65 }}
                          source={require("../../images/bell.png")}
                          resizeMode="contain"
                        />
                      </View>
                      <Text
                        weight="Bold"
                        style={{ fontSize: 16, color: "#c2c2c2" }}
                      >
                        Nothing due in upcoming period
                      </Text>
                    </View>
                  ) : (
                    <FlatList
                      data={upcomingServices}
                      renderItem={item => (
                        <UpcomingServiceItem
                          item={item.item}
                          navigation={this.props.navigation}
                        />
                      )}
                      keyExtractor={(item, index) => index}
                    />
                  )
              },
              {
                title: "Expense Insights",
                imageSource: require("../../images/bar_chart_icon.png"),
                content: (
                  <ExpenseInsightsContent navigation={this.props.navigation} />
                )
              },
              {
                title: "Authorised Service Centres",
                imageSource: require("../../images/asc_icon.png"),
                content: <AscContent navigation={this.props.navigation} />
              }
            ]}
          />
        </View>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => this.showAddProductOptionsScreen()}
        >
          <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
        </TouchableOpacity>

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
            { ref: this.insightsRef, text: I18n.t("app_tour_tips_4") }
          ]}
        />
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
      android: { top: 55 },
      ios: { top: 75 }
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
  fab: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 64,
    height: 64,
    zIndex: 2,
    backgroundColor: colors.tomato,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3
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
