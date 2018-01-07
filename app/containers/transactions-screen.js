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
import ActionSheet from "react-native-actionsheet";
import { API_BASE_URL, getCategoryInsightData } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import InsightChart from "../components/insight-chart";
import SectionHeading from "../components/section-heading";
import { colors } from "../theme";
import LoadingOverlay from "../components/loading-overlay";
import { openBillsPopUp } from "../navigation";
import I18n from "../i18n";

import { MAIN_CATEGORY_IDS } from "../constants";

const billIcon = require("../images/ic_comingup_bill.png");

class TransactionsScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      isFetchingData: true,
      weeklyData: {
        timeSpanText: "",
        filterText: "Current Month",
        products: [],
        insightData: {}
      },
      monthlyData: {
        timeSpanText: "",
        filterText: "Current Month",
        products: [],
        insightData: {}
      },
      yearlyData: {
        timeSpanText: "",
        filterText: "Current Year",
        products: [],
        insightData: {}
      },
      activeData: {
        timeSpanText: "",
        filterText: "",
        products: [],
        insightData: {}
      },
      chartData: []
    };
  }

  async componentDidMount() {
    this.props.navigator.setTitle({
      title: this.props.category.cName
    });

    try {
      const res = await getCategoryInsightData(this.props.category.id);
      const weeklyData = {
        timeSpanText:
          "For " +
          moment(res.insight.startDate).format("DD MMM") +
          " - " +
          moment(res.insight.endDate).format("DD MMM"),
        filterText: I18n.t("transactions_screen_filter_last_7_days"),
        products: res.productList,
        insightData: res.insight.insightData
      };
      const monthlyData = {
        timeSpanText:
          "For " + moment(res.insight.monthStartDate).format("MMM YYYY"),
        filterText: I18n.t("transactions_screen_filter_current_month"),
        products: res.productListWeekly,
        insightData: res.insight.insightWeekly
      };
      const yearlyData = {
        timeSpanText: "For " + moment(res.insight.yearStartDate).format("YYYY"),
        filterText: I18n.t("transactions_screen_filter_current_year"),
        totalSpend: res.totalYearlySpend,
        products: res.productListMonthly,
        insightData: res.insight.insightMonthly
      };

      this.setState(
        {
          isFetchingData: false,
          weeklyData,
          monthlyData,
          yearlyData
        },
        () => {
          this.handleFilterOptionPress(this.props.index);
        }
      );
    } catch (e) {}
  }

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
      default:
        activeData = this.state.weeklyData;
    }

    let areAllValuesZero = true;
    let chartData = activeData.insightData.map(data => {
      if (areAllValuesZero && data.value > 0) {
        areAllValuesZero = false;
      }

      let x = "";
      if (index == 0) {
        x = moment(data.purchaseDate).format("DD MMM");
      } else if (index == 1) {
        x = "Week " + data.week;
      } else if (index == 2) {
        x = data.month;
      }
      return {
        x: x,
        y: data.value
      };
    });

    if (areAllValuesZero) {
      chartData = [];
    }

    this.setState({
      isFetchingData: false,
      activeData,
      chartData
    });
  };

  productType = dataIndex => {
    switch (dataIndex) {
      case 2:
        return ": AMC";
      case 3:
        return ": Insurance";
      case 4:
        return ": Repairs";
      case 5:
        return ": Warranty";
      default:
        return "";
    }
  };
  render() {
    const { timeSpanText, filterText } = this.state.activeData;
    const { isFetchingData, chartData } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isFetchingData} />
        <ScrollView>
          <View style={{ padding: 16 }}>
            <InsightChart
              onFiltersPress={() => this.filterOptions.show()}
              bgColors={[this.props.color, this.props.color]}
              timeSpanText={timeSpanText}
              filterText={filterText}
              chartData={chartData}
            />
            <ActionSheet
              onPress={this.handleFilterOptionPress}
              ref={o => (this.filterOptions = o)}
              title={I18n.t("transactions_screen_filter_options_title")}
              cancelButtonIndex={3}
              options={[
                I18n.t("transactions_screen_filter_last_7_days"),
                I18n.t("transactions_screen_filter_current_month"),
                I18n.t("transactions_screen_filter_current_year"),
                I18n.t("transactions_screen_filter_close")
              ]}
            />
          </View>
          {this.state.activeData.products.length == 0 && (
            <SectionHeading
              text={I18n.t("transactions_screen_no_transactions")}
            />
          )}
          {this.state.activeData.products.length > 0 && (
            <View>
              <SectionHeading
                text={I18n.t("transactions_screen_transactions")}
              />
              <View>
                {this.state.activeData.products.map((product, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        product.masterCategoryId ==
                          MAIN_CATEGORY_IDS.AUTOMOBILE ||
                        product.masterCategoryId ==
                          MAIN_CATEGORY_IDS.ELECTRONICS
                      ) {
                        this.props.navigator.push({
                          screen: "ProductDetailsScreen",
                          passProps: {
                            productId: product.productId || product.id
                          }
                        });
                      } else {
                        openBillsPopUp({
                          id: product.productName,
                          date: product.purchaseDate,
                          copies: product.copies
                        });
                      }
                    }}
                    style={styles.product}
                    key={index}
                  >
                    {product.dataIndex == 1 && (
                      <Image
                        style={styles.image}
                        source={{ uri: API_BASE_URL + product.cImageURL + "1" }}
                      />
                    )}
                    {product.dataIndex > 1 && (
                      <Image style={styles.image} source={billIcon} />
                    )}
                    <View style={styles.texts}>
                      <View style={styles.nameWrapper}>
                        <Text weight="Bold" style={styles.name}>
                          {product.productName}
                        </Text>
                        <Text weight="Bold" style={styles.productType}>
                          {this.productType(product.dataIndex)}
                        </Text>
                      </View>
                      {product.sellers != null && (
                        <Text style={styles.sellerName}>
                          {product.sellers.sellerName}
                        </Text>
                      )}
                      <Text weight="Medium" style={styles.purchaseDate}>
                        {moment(product.purchaseDate).format("MMM DD, YYYY")}
                      </Text>
                    </View>
                    <Text weight="Bold" style={styles.amount}>
                      ₹ {product.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  product: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    borderColor: "#ececec",
    borderWidth: 1,
    marginBottom: -1
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16
  },
  texts: {
    flex: 1
  },
  nameWrapper: {
    flexDirection: "row"
  },
  name: {
    fontSize: 14,
    color: colors.mainText
  },
  sellerName: {
    fontSize: 12,
    color: colors.mainText,
    marginVertical: 5
  },
  purchaseDate: {
    fontSize: 12,
    color: colors.secondaryText
  },
  amount: {
    marginTop: 20
  }
});

export default TransactionsScreen;
