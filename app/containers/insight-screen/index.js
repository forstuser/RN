import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import moment from "moment";
import { API_BASE_URL, getInsightData } from "../../api";
import ActionSheet from "react-native-actionsheet";
import { Text, Button, ScreenContainer } from "../../elements";
import Collapsible from "../../components/collapsible";
import SectionHeading from "../../components/section-heading";
import { colors } from "../../theme";
import LoadingOverlay from "../../components/loading-overlay";
import I18n from "../../i18n";

const dropdownIcon = require("../../images/ic_dropdown_arrow.png");

const legendColors = [
  "#00B7FF",
  "#695FF8",
  "#CE2BF9",
  "#FF31E2",
  "#FF4F53",
  "#FFD300",
  "#A1F200",
  "#00E2B8",
  "#212900",
  "#356F53",
  "#224986",
  "#886CD3"
];

import ExpensesChart from "./expenses-chart";
import { SCREENS } from "../../constants";

class InsightScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      isFetchingData: true,
      weeklyData: {
        index: 0,
        timeSpanText: "",
        filterText: "Last 7 Days",
        totalSpend: 0,
        totalTaxes: 0,
        categories: []
      },
      monthlyData: {
        index: 1,
        timeSpanText: "",
        filterText: "Current Month",
        totalSpend: 0,
        totalTaxes: 0,
        categories: []
      },
      yearlyData: {
        index: 2,
        timeSpanText: "For Aug 2017",
        filterText: "Current Year",
        totalSpend: 0,
        totalTaxes: 0,
        categories: []
      },
      overallData: {
        index: 3,
        timeSpanText: "Lifetime",
        filterText: "Lifetime",
        totalSpend: 0,
        totalTaxes: 0,
        categories: []
      },
      activeData: {
        index: 0,
        timeSpanText: "For Aug 2017",
        filterText: "Last 7 Days",
        totalSpend: 0,
        totalTaxes: 0,
        categories: []
      },
      chartData: []
    };
  }

  async componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("insights_screen_title")
    });

    try {
      const res = await getInsightData();
      const weeklyData = {
        index: 0,
        timeSpanText:
          "For " +
          moment(res.weekStartDate).format("DD MMM") +
          " - " +
          moment(res.weekEndDate).format("DD MMM"),
        filterText: I18n.t("insights_screen_filter_last_7_days"),
        totalSpend: res.totalWeeklySpend,
        totalTaxes: res.totalWeeklyTaxes,
        categories: res.categoryData.weeklyData
      };
      const monthlyData = {
        index: 1,
        timeSpanText: "For " + moment(res.monthStartDate).format("MMM YYYY"),
        filterText: I18n.t("insights_screen_filter_current_month"),
        totalSpend: res.totalMonthlySpend,
        totalTaxes: res.totalMonthlyTaxes,
        categories: res.categoryData.monthlyData
      };
      const yearlyData = {
        index: 2,
        timeSpanText: "For " + moment(res.yearStartDate).format("YYYY"),
        filterText: I18n.t("insights_screen_filter_current_year"),
        totalSpend: res.totalYearlySpend,
        totalTaxes: res.totalYearlyTaxes,
        categories: res.categoryData.yearlyData
      };

      const overallData = {
        index: 2,
        timeSpanText: "Lifetime",
        filterText: I18n.t("insights_screen_filter_overall"),
        totalSpend: res.totalOverallSpend,
        totalTaxes: res.totalOverallTaxes,
        categories: res.categoryData.overallData
      };

      const screenOpts = this.props.screenOpts || {};
      this.setState(
        {
          weeklyData,
          monthlyData,
          yearlyData,
          overallData
        },
        () => {
          this.handleFilterOptionPress(screenOpts.initialFilterIndex || 0);
        }
      );
    } catch (e) {}
  }

  openTaxPaidScreen = () => {
    this.props.navigator.push({
      screen: SCREENS.TOTAL_TAX_SCREEN,
      passProps: {
        weeklyData: this.state.weeklyData,
        monthlyData: this.state.monthlyData,
        yearlyData: this.state.yearlyData,
        overallData: this.state.overallData,
        index: this.state.activeData.index
      }
    });
  };

  handleFilterOptionPress = index => {
    let activeData;
    switch (index) {
      case 0:
        activeData = this.state.weeklyData;
        break;
      case 1:
        activeData = this.state.monthlyData;
        break;
      case 2:
        activeData = this.state.yearlyData;
        break;
      case 3:
        activeData = this.state.overallData;
        break;
      default:
        activeData = this.state.weeklyData;
    }

    let chartData = activeData.categories.map(category => {
      return {
        x: category.cName,
        y: +category.totalAmount
      };
    });
    this.setState({
      isFetchingData: false,
      activeData,
      chartData
    });
  };

  openTransactionsScreen = ({ category, color }) => {
    this.props.navigator.push({
      screen: SCREENS.TRANSACTIONS_SCREEN,
      passProps: {
        index: this.state.activeData.index,
        category,
        color
      }
    });
  };

  render() {
    const {
      timeSpanText,
      filterText,
      totalTaxes,
      totalSpend,
      categories
    } = this.state.activeData;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={this.state.isFetchingData} />
        <ScrollView>
          <View style={styles.filterHeader}>
            <Text weight="Bold" style={styles.timeSpan}>
              {timeSpanText}
            </Text>
            <TouchableOpacity
              onPress={() => this.filterOptions.show()}
              style={styles.filter}
            >
              <Text weight="Bold" style={styles.filterText}>
                {filterText}
              </Text>
              <Image style={styles.filterDropdown} source={dropdownIcon} />
            </TouchableOpacity>
            <ActionSheet
              onPress={this.handleFilterOptionPress}
              ref={o => (this.filterOptions = o)}
              title={I18n.t("insights_screen_filter_options_title")}
              cancelButtonIndex={4}
              options={[
                I18n.t("insights_screen_filter_last_7_days"),
                I18n.t("insights_screen_filter_current_month"),
                I18n.t("insights_screen_filter_current_year"),
                I18n.t("insights_screen_filter_overall"),
                I18n.t("insights_screen_filter_close")
              ]}
            />
          </View>

          {/*<View style={styles.totalTax}>
            <View
              style={{
                flexDirection: "row"
              }}
            >
              <View>
                <Image
                  style={{ width: 90, height: 82 }}
                  // source={require("../../images/ic_insight_tax_gradient.png")}
                />
              </View>

              <Image
                style={{
                  position: "absolute",
                  top: 10,
                  left: 20,
                  width: 50,
                  height: 50,
                  backgroundColor: "white",
                  borderColor: "#e6e6e6",
                  borderRadius: 6,
                  borderWidth: 1,
                  margin: 5
                }}
                // source={require("../../images/ic_insight_tax.png")}
              />
              <View style={{ paddingTop: 20 }}>
                <Text
                  style={{ fontSize: 14, color: "#4a4a4a" }}
                  weight="Medium"
                >
                  {I18n.t("insights_screen_total_tax_paid")}
                </Text>
                <Text style={{ fontSize: 20, color: "#4a4a4a" }} weight="Bold">
                  ₹ {totalTaxes}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                borderColor: "#ececec",
                borderTopWidth: 1
              }}
            >
              <Text
                onPress={this.openTaxPaidScreen}
                style={{
                  color: "#ff732e",
                  padding: 10
                }}
                weight="Bold"
              >
                {I18n.t("insights_screen_tax_see_details")}
              </Text>
            </View>
              </View>*/}

          <SectionHeading
            text={I18n.t("insights_screen_section_heading_expenses")}
          />

          {totalSpend > 0 && (
            <ExpensesChart
              colors={legendColors}
              chartData={this.state.chartData}
            />
          )}
          {totalSpend == 0 && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{
                  width: 170,
                  height: 170
                }}
                source={require("../../images/no_bills.png")}
              />
              {/* <Text style={{ textAlign: "center" }}>No Expenses</Text> */}
            </View>
          )}
          <View style={styles.spends}>
            <Text style={{ fontSize: 24, color: "#9c9c9c" }} weight="Regular">
              {I18n.t("insights_screen_total_spends")}
            </Text>
            <Text style={{ fontSize: 24, color: "#3b3b3b" }} weight="Medium">
              ₹ {totalSpend}
            </Text>
          </View>

          <View>
            {categories.map((category, index) => (
              <TouchableOpacity
                onPress={() =>
                  this.openTransactionsScreen({
                    category: category,
                    color: legendColors[index]
                  })
                }
                key={category.cName}
                style={styles.item}
              >
                <View
                  style={[
                    styles.itemColorDot,
                    { backgroundColor: legendColors[index] }
                  ]}
                />
                <View style={styles.texts}>
                  <Text style={styles.categoryName} weight="Medium">
                    {category.cName}
                  </Text>
                  <Text style={styles.categorySpend} weight="Regular">
                    ₹ {category.totalAmount}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#fafafa"
  },
  filterHeader: {
    backgroundColor: "#3b3b3b",
    paddingHorizontal: 15,
    flexDirection: "row",
    height: 54,
    alignItems: "center"
  },
  timeSpan: {
    flex: 1,
    color: colors.secondaryText,
    fontSize: 16
  },
  filter: {
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 15,
    height: 30,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  filterDropdown: {
    width: 24,
    height: 24,
    tintColor: "#fff"
  },
  filterText: {
    fontSize: 14,
    color: "#fff"
  },
  totalTax: {
    margin: 20,
    borderRadius: 6,
    borderColor: "#ececec",
    borderWidth: 1,
    overflow: "hidden"
  },
  spends: {
    alignItems: "center",
    marginBottom: 20
  },
  item: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
    borderColor: "#efefef",
    borderWidth: 1
  },
  itemColorDot: {
    backgroundColor: "red",
    height: 20,
    width: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 18
  },
  texts: {
    flex: 1
  },
  categorySpend: {
    fontSize: 12
  }
});
export default InsightScreen;
