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
import { API_BASE_URL, getInsightData } from "../api";
import ActionSheet from "react-native-actionsheet";
import { Text, Button, ScreenContainer } from "../elements";
import { colors } from "../theme";
import InsightChart from "../components/insight-chart";
import I18n from "../i18n";

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

class TotalTaxScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      activeData: {
        index: 0,
        timeSpanText: "",
        filterText: "Last 7 Days",
        totalSpend: 0,
        totalTaxes: 0,
        categories: []
      }
    };
  }

  async componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("total_tax_screen_title")
    });

    this.handleFilterOptionPress(this.props.index);
  }

  handleFilterOptionPress = index => {
    let activeData;
    switch (index) {
      case 0:
        activeData = this.props.weeklyData;
        break;
      case 1:
        activeData = this.props.monthlyData;
        break;
      case 2:
        activeData = this.props.yearlyData;
        break;
      case 3:
        activeData = this.props.overallData;
        break;
      default:
        return;
    }

    let chartData = activeData.categories.map((category, index) => {
      return {
        x: category.cName,
        y: +category.totalTax,
        fill: legendColors[index]
      };
    });

    this.setState({
      activeData,
      chartData
    });
  };

  render() {
    const {
      timeSpanText,
      filterText,
      totalTaxes,
      categories
    } = this.state.activeData;
    const { chartData } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <ScrollView style={styles.container}>
          <View collapsable={false}  style={styles.chartWrapper}>
            <InsightChart
              textColor="#000"
              onFiltersPress={() => this.filterOptions.show()}
              bgColors={["#fff", "#fff"]}
              timeSpanText={timeSpanText}
              filterText={filterText}
              chartData={chartData}
            />
            <ActionSheet
              onPress={this.handleFilterOptionPress}
              ref={o => (this.filterOptions = o)}
              title={I18n.t("total_tax_screen_filter_options_title")}
              cancelButtonIndex={4}
              options={[
                I18n.t("total_tax_screen_filter_last_7_days"),
                I18n.t("total_tax_screen_filter_current_month"),
                I18n.t("total_tax_screen_filter_current_year"),
                I18n.t("total_tax_screen_filter_lifetime"),
                I18n.t("total_tax_screen_filter_close")
              ]}
            />
          </View>

          <View collapsable={false}  style={styles.spends}>
            <Text style={{ fontSize: 24, color: "#9c9c9c" }} weight="Regular">
              {I18n.t("total_tax_screen_total")}
            </Text>
            <Text style={{ fontSize: 24, color: "#3b3b3b" }} weight="Medium">
              ₹ {totalTaxes}
            </Text>
          </View>

          <View collapsable={false} >
            {categories.map((category, index) => (
              <View collapsable={false}  key={category.cName} style={styles.item}>
                <View collapsable={false} 
                  style={[
                    styles.itemColorDot,
                    { backgroundColor: legendColors[index] }
                  ]}
                />
                <View collapsable={false}  style={styles.texts}>
                  <Text style={styles.categoryName} weight="Medium">
                    {category.cName}
                  </Text>
                  <Text style={styles.categorySpend} weight="Regular">
                    ₹ {category.totalTax}
                  </Text>
                </View>
              </View>
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
  chartWrapper: {
    margin: 16,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 6
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
export default TotalTaxScreen;
