import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import moment from "moment";
import ActionSheet from "react-native-actionsheet";
import { API_BASE_URL, getCategoryInsightData } from "../api";
import { Text, Button, ScreenContainer, Image } from "../elements";
import InsightChart from "../components/insight-chart";
import SectionHeading from "../components/section-heading";
import { colors } from "../theme";
import LoadingOverlay from "../components/loading-overlay";
import { openBillsPopUp } from "../navigation";
import I18n from "../i18n";

import { MAIN_CATEGORY_IDS, SCREENS } from "../constants";

const billIcon = require("../images/ic_comingup_bill.png");

class TransactionsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.category.cName
    };
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
      overallData: {
        timeSpanText: "",
        filterText: "Overall",
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
    try {
      const res = await getCategoryInsightData(
        this.props.navigation.state.params.category.id
      );
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
        products: res.productListMonthly,
        insightData: res.insight.insightMonthly
      };
      const overallData = {
        timeSpanText: "Lifetime",
        filterText: I18n.t("transactions_screen_filter_overall"),
        products: res.overallProductList,
        insightData: res.insight.overallInsight
      };
      this.setState(
        {
          isFetchingData: false,
          weeklyData,
          monthlyData,
          yearlyData,
          overallData
        },
        () => {
          this.handleFilterOptionPress(
            this.props.navigation.state.params.index
          );
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
      case 3:
        activeData = this.state.overallData;
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
      } else if (index == 3) {
        x = String(data.year);
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
      case 6:
        return ": PUC";
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
          <View collapsable={false} style={{ padding: 16 }}>
            <InsightChart
              onFiltersPress={() => this.filterOptions.show()}
              bgColors={[
                this.props.navigation.state.params.color,
                this.props.navigation.state.params.color
              ]}
              timeSpanText={timeSpanText}
              filterText={filterText}
              chartData={chartData}
            />
            <ActionSheet
              onPress={this.handleFilterOptionPress}
              ref={o => (this.filterOptions = o)}
              title={I18n.t("transactions_screen_filter_options_title")}
              cancelButtonIndex={4}
              options={[
                I18n.t("transactions_screen_filter_last_7_days"),
                I18n.t("transactions_screen_filter_current_month"),
                I18n.t("transactions_screen_filter_current_year"),
                I18n.t("transactions_screen_filter_overall"),
                I18n.t("transactions_screen_filter_close")
              ]}
            />
          </View>
          {this.state.activeData.products.length == 0 ? (
            <SectionHeading
              text={I18n.t("transactions_screen_no_transactions")}
            />
          ) : (
            <View collapsable={false}>
              <SectionHeading
                text={I18n.t("transactions_screen_transactions")}
              />
              <View collapsable={false}>
                {this.state.activeData.products.map((product, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate(
                        SCREENS.PRODUCT_DETAILS_SCREEN,
                        {
                          productId: product.productId || product.id
                        }
                      );
                    }}
                    style={styles.product}
                    key={index}
                  >
                    {product.dataIndex == 1 && (
                      <Image
                        style={styles.image}
                        source={{ uri: API_BASE_URL + product.cImageURL }}
                      />
                    )}
                    {product.dataIndex > 1 && (
                      <Image style={styles.image} source={billIcon} />
                    )}
                    <View collapsable={false} style={styles.texts}>
                      <View collapsable={false} style={styles.nameWrapper}>
                        <Text weight="Bold" style={styles.name}>
                          {product.productName || product.categoryName}
                        </Text>
                        <Text weight="Bold" style={styles.productType}>
                          {this.productType(product.dataIndex)}
                        </Text>
                      </View>
                      {product.sellers != null ? (
                        <Text style={styles.sellerName}>
                          {product.sellers.sellerName}
                        </Text>
                      ) : (
                        <View collapsable={false} />
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
