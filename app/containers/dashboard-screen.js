import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import moment from "moment";
import { consumerGetDashboard } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import BlankDashboard from "../components/blank-dashboard";
import SearchHeader from "../components/search-header";
import InsightChart from "../components/insight-chart";
import UpcomingServicesList from "../components/upcoming-services-list";

class DashboardScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      showDashboard: true,
      upcomingServices: [],
      insightChartProps: {},
      notificationCount: 0
    };
  }
  async componentDidMount() {
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
        showDashboard: dashboardData.showDashboard,
        upcomingServices: dashboardData.upcomingServices,
        insightChartProps: insightChartProps
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  render() {
    const { showDashboard, notificationCount } = this.state;
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
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0
                    }}
                    onPress={() => Alert.alert("insight page will open")}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        )}
        {!showDashboard && <BlankDashboard />}
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
  }
});

export default DashboardScreen;
