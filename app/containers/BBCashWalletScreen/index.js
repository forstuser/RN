import React, { Component } from "react";
import { View, FlatList } from "react-native";
import moment from "moment";
import { Text } from "../../elements";
import Header from "./header";
import SingleTransaction from "./singleTransaction";
import { retrieveWalletDetails } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

class BBCashWalletScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingData: true,
      totalCashback: 0,
      transactions: [],
      walletAmount: 0
    };
  }

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.fetchWalletData();
      }
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  fetchWalletData = async () => {
    this.setState({
      error: null
    });
    try {
      const walletData = await retrieveWalletDetails();
      console.log("walletData total cashback", walletData.total_cashback);
      console.log("wallet totol result", walletData.result);
      let walletArray = [];
      walletData.result.forEach(money => {
        walletArray.push({
          description: money.description,
          date: moment(money.created_at)
            .format("DD MMM, YYYY")
            .toUpperCase(),
          id: money.id,
          price: money.amount
        });
      });
      console.log(walletArray);
      this.setState({
        isFetchingData: false,
        totalCashback: walletData.total_cashback.toFixed(2),
        transactions: walletArray
      });
    } catch (error) {
      console.log("error: ", error);
      this.setState({
        error,
        isFetchingData: false
      });
    }
  };

  renderTransactions = ({ item: transaction, index }) => {
    return (
      <SingleTransaction
        date={transaction.date}
        description={transaction.description}
        date={transaction.date}
        id={transaction.id}
        price={transaction.price}
      />
    );
  };

  render() {
    const { transactions, totalCashback, isFetchingData } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          onRefresh={this.fetchWalletData}
          refreshing={isFetchingData}
          ListHeaderComponent={() => (
            <View>
              <Header
                navigation={this.props.navigation}
                totalCashback={totalCashback}
              />
              <Text style={styles.heading} weight="Bold">
                BBCash Transactions
              </Text>
            </View>
          )}
          data={transactions}
          renderItem={this.renderTransactions}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = {
  heading: {
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10
  }
};

export default BBCashWalletScreen;
