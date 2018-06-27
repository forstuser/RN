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
import Icon from "react-native-vector-icons/Ionicons";
import ActionSheet from "react-native-actionsheet";
import { API_BASE_URL, getCategoryInsightData } from "../api";
import { Text, Button, ScreenContainer, Image } from "../elements";
import SectionHeading from "../components/section-heading";
import { colors } from "../theme";
import LoadingOverlay from "../components/loading-overlay";
import ErrorOverlay from "../components/error-overlay";
import { openBillsPopUp } from "../navigation";
import I18n from "../i18n";

import { MAIN_CATEGORY_IDS, SCREENS } from "../constants";

const billIcon = require("../images/ic_comingup_bill.png");

class TransactionsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const category = navigation.getParam("category", {});
    return {
      title: category.cName
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingData: true,
      products: [],
      timePeriod: null, // one of  'Monthly', 'Yearly', 'Lifetime',
      time: null
    };
  }

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        const timePeriod =
          this.state.timePeriod ||
          this.props.navigation.getParam("timePeriod", "Monthly");
        const time =
          this.state.time || this.props.navigation.getParam("time", moment());
        this.setState({ timePeriod, time }, () => {
          this.fetchProductList();
        });
      }
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  fetchProductList = async () => {
    const category = this.props.navigation.getParam("category", {});

    try {
      this.setState({ isLoading: true, error: null });
      const { timePeriod, time } = this.state;
      const filters = { categoryId: category.id };
      switch (timePeriod) {
        case "Yearly":
          filters.forYear = time.format("YYYY");
        case "Monthly":
          filters.forMonth = time.format("M");
          break;
        case "Lifetime":
          filters.forLifetime = true;
      }
      const res = await getCategoryInsightData(filters);

      this.setState({
        products: res.productList
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isFetchingData: false });
    }
  };

  previousTimePeriod = () => {
    const { timePeriod, time } = this.state;
    let unit = "months";
    if (timePeriod == "Yearly") unit = "years";
    this.setState(
      {
        time: time.subtract(1, unit)
      },
      () => {
        this.fetchProductList();
      }
    );
  };

  nextTimePeriod = () => {
    const { timePeriod, time } = this.state;
    let unit = "months";
    if (timePeriod == "Yearly") unit = "years";
    this.setState(
      {
        time: time.add(1, unit)
      },
      () => {
        this.fetchProductList();
      }
    );
  };

  handleTimePeriodPress = index => {
    if (index == 3) return;
    let timePeriod = "Monthly";
    switch (index) {
      case 1:
        timePeriod = "Yearly";
        break;
      case 2:
        timePeriod = "Lifetime";
        break;
    }
    this.setState({ timePeriod, time: moment() }, () =>
      this.fetchProductList()
    );
  };

  onProductPress = product => {
    this.props.navigation.navigate(SCREENS.PRODUCT_DETAILS_SCREEN, {
      productId: product.productId || product.id
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
    const { isFetchingData, products, timePeriod, time, error } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchCategories} />;
    }
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.timePeriodOptions.show()}
            style={styles.timePeriod}
          >
            <Text>{timePeriod}</Text>
            <Icon
              name="md-arrow-dropdown"
              color="#656565"
              size={20}
              style={{ marginLeft: 20, marginTop: 5 }}
            />
          </TouchableOpacity>
          <ActionSheet
            onPress={this.handleTimePeriodPress}
            ref={o => (this.timePeriodOptions = o)}
            cancelButtonIndex={3}
            options={["Monthly", "Yearly", "Lifetime"]}
          />
          {timePeriod != "Lifetime" && time != null ? (
            <View style={styles.monthAndYear}>
              <TouchableOpacity
                onPress={this.previousTimePeriod}
                style={styles.monthAndYearArrow}
              >
                <Icon name="ios-arrow-back" color={colors.mainBlue} size={30} />
              </TouchableOpacity>

              <Text
                weight="Bold"
                style={{
                  fontSize: 20,
                  flex: 1,
                  textAlign: "center",
                  color: colors.mainBlue
                }}
              >
                {timePeriod == "Monthly" ? time.format("MMM") + ", " : ""}
                {time.format("YYYY")}
              </Text>

              <TouchableOpacity
                onPress={this.nextTimePeriod}
                style={styles.monthAndYearArrow}
              >
                <Icon
                  name="ios-arrow-forward"
                  color={colors.mainBlue}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
        </View>
        {!isFetchingData && products.length == 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultText}>
              No Transactions available for the time period
            </Text>
          </View>
        ) : (
          <View />
        )}
        <FlatList
          style={styles.list}
          data={products}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.onProductPress(item)}
              style={styles.product}
            >
              {item.dataIndex == 1 && (
                <Image
                  style={styles.image}
                  source={{ uri: API_BASE_URL + item.cImageURL }}
                />
              )}
              {item.dataIndex > 1 && (
                <Image style={styles.image} source={billIcon} />
              )}
              <View collapsable={false} style={styles.texts}>
                <View collapsable={false} style={styles.nameWrapper}>
                  <Text weight="Bold" style={styles.name}>
                    {item.productName || item.categoryName}
                  </Text>
                  {item.masterCategoryId == MAIN_CATEGORY_IDS.HOUSEHOLD &&
                    item.sub_category_name != null && (
                      <Text weight="Bold" style={styles.sub_category_name}>
                        {item.sub_category_name}
                      </Text>
                    )}
                  <Text weight="Bold" style={styles.productType}>
                    {this.productType(item.dataIndex)}
                  </Text>
                </View>
                {item.sellers != null ? (
                  <Text style={styles.sellerName}>
                    {item.sellers.sellerName}
                  </Text>
                ) : (
                  <View collapsable={false} />
                )}
                <Text weight="Medium" style={styles.purchaseDate}>
                  {moment(item.purchaseDate).format("MMM DD, YYYY")}
                </Text>
              </View>
              <Text weight="Bold" style={styles.amount}>
                ₹ {item.value}
              </Text>
            </TouchableOpacity>
          )}
        />

        <LoadingOverlay visible={isFetchingData} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  header: {
    borderColor: "#efefef",
    borderBottomWidth: 1
  },
  timePeriod: {
    borderColor: "#e1e1e1",
    borderWidth: 1,
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 10,
    borderRadius: 15,
    marginVertical: 15
  },
  monthAndYear: {
    flexDirection: "row",
    alignItems: "center"
  },
  monthAndYearArrow: {
    padding: 5,
    width: 40,
    alignItems: "center"
  },
  noResultContainer: {
    flex: 1,
    padding: 20
  },
  noResultText: {
    color: colors.secondaryText,
    textAlign: "center"
  },
  list: {
    flex: 1
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
    flexDirection: "column"
  },
  name: {
    fontSize: 14,
    color: colors.mainText
  },
  sub_category_name: {
    fontSize: 13,
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
