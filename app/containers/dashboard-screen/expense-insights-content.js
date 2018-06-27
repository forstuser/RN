import React from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ActionSheet from "react-native-actionsheet";
import moment from "moment";

import { Text, Image } from "../../elements";
import ErrorOverlay from "../../components/error-overlay";

import { API_BASE_URL, getInsightData } from "../../api";
import { colors } from "../../theme";

export default class InsightContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: null,
      totalSpend: "",
      categories: [],
      timePeriod: "Lifetime", // one of  'Monthly', 'Yearly', 'Lifetime',
      time: moment()
    };
  }

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    try {
      this.setState({ isLoading: true, error: null });
      const { timePeriod, time } = this.state;
      const filters = {};
      switch (timePeriod) {
        case "Yearly":
          filters.forYear = time.format("YYYY");
        case "Monthly":
          filters.forMonth = time.format("M");
          break;
        case "Lifetime":
          filters.forLifetime = true;
      }
      const res = await getInsightData(filters);
      this.setState({
        totalSpend: res.totalSpend,
        categories: res.categoryData
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
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
        this.fetchCategories();
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
        this.fetchCategories();
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
    this.setState({ timePeriod, time: moment() }, () => this.fetchCategories());
  };

  render() {
    const {
      totalSpend,
      categories,
      timePeriod,
      time,
      isLoading,
      error
    } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.fetchCategories} />;
    }
    return (
      <View style={styles.container}>
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
        {timePeriod != "Lifetime" ? (
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

        <FlatList
          style={styles.list}
          data={categories}
          onRefresh={this.fetchCategories}
          refreshing={isLoading}
          ListHeaderComponent={
            <View style={styles.totalSpendContainer}>
              <Text weight="Bold" style={{ fontSize: 25 }}>
                ₹{totalSpend}
              </Text>
              <Text weight="Bold" style={{ color: colors.secondaryText }}>
                Total Spend
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <Image
                style={styles.itemImage}
                source={{ uri: API_BASE_URL + item.cImageURl }}
                resizemode="contain"
              />
              <View style={styles.itemTexts}>
                <Text weight="Bold" style={styles.itemName}>
                  {item.cName}
                </Text>
                <Text weight="Medium" style={styles.viewDetails}>
                  View Details
                </Text>
              </View>
              <View style={styles.itemAmountContainer}>
                <Text weight="Bold" style={styles.itemAmount}>
                  ₹{item.totalAmount}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={<View style={{ height: 80 }} />}
          keyExtractor={item => String(item.id)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  totalSpendContainer: {
    alignItems: "center",
    paddingVertical: 10,
    borderColor: "#efefef"
    // borderTopWidth: 1
  },
  list: {
    flex: 1,
    borderColor: "#efefef",
    borderTopWidth: 1
  },
  item: {
    height: 70,
    borderBottomWidth: 1,
    borderColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },
  itemImage: {
    width: 40,
    height: 40,
    marginRight: 12
  },
  itemTexts: {
    flex: 1
  },
  itemName: {
    fontSize: 12
  },
  viewDetails: {
    fontSize: 10,
    color: colors.tomato,
    textDecorationLine: "underline"
  }
});
