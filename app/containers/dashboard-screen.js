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
import moment from "moment";
import { consumerGetDashboard } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import BlankDashboard from "../components/blank-dashboard";
import SearchHeader from "../components/search-header";
import InsightChart from "../components/insight-chart";
import UpcomingServicesList from "../components/upcoming-services-list";
import UploadBillOptions from "../components/upload-bill-options";
import { colors } from "../theme";

const uploadFabIcon = require("../images/ic_upload_fab.png");

class DashboardScreen extends React.Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      showDashboard: true,
      upcomingServices: [],
      insightChartProps: {},
      notificationCount: 0,
      recentSearches: [],
      showUploadOptions: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.fetchDashboardData();
        break;
    }
  };

  fetchDashboardData = async () => {
    try {
      const dashboardData = await consumerGetDashboard();

      const insight = dashboardData.insight;
      const insightChartProps = {
        timeSpanText:
          moment(insight.startDate).format("MMM DD") +
          " - " +
          moment(insight.endDate).format("MMM DD"),
        filterText: "Last 7 Days",
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
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  showUploadOptions = () => {
    this.setState({
      showUploadOptions: true
    });
  };

  insightScreen = () => {
    this.props.navigator.push({
      screen: "InsightScreen"
    });
  };

  render() {
    const { showDashboard, notificationCount, recentSearches } = this.state;
    const SectionHeader = ({ text }) => (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderTopBorder} />
        <Text weight={"Bold"} style={styles.sectionHeaderText}>
          {text}
        </Text>
      </View>
    );
    return (
      <ScreenContainer style={{ padding: 0 }}>
        {showDashboard && (
          <View>
            <SearchHeader
              screen="dashboard"
              notificationCount={notificationCount}
              recentSearches={recentSearches}
              navigator={this.props.navigator}
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled>
              <View style={{ flex: 1, marginBottom: 150 }}>
                {this.state.upcomingServices.length > 0 && (
                  <View>
                    <SectionHeader text={`WHAT'S COMING UP`} />
                    <UpcomingServicesList
                      upcomingServices={this.state.upcomingServices}
                      navigator={this.props.navigator}
                    />
                  </View>
                )}
                <SectionHeader text={`EHOME INSIGHTS`} />
                <View style={{ paddingHorizontal: 16 }}>
                  <InsightChart {...this.state.insightChartProps} />
                  <TouchableOpacity
                    onPress={this.insightScreen}
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
            onUploadButtonClick={() => this.uploadBillOptions.show()}
          />
        )}
        {showDashboard && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => this.uploadBillOptions.show()}
          >
            <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
          </TouchableOpacity>
        )}
        <UploadBillOptions
          ref={ref => (this.uploadBillOptions = ref)}
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
