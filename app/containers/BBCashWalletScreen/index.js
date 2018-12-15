import React, { Component } from "react";
import { View, FlatList, BackHandler } from "react-native";
import moment from "moment";
import { Text } from "../../elements";
import Header from "./header";
import SingleTransaction from "./singleTransaction";
import { retrieveWalletDetails, getMySellers } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { SCREENS } from "../../constants";
import { DrawerActions } from "react-navigation";

class BBCashWalletScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingData: true,
      isFetchingSellerData: false,
      totalCashback: 0,
      transactions: [],
      walletAmount: 0,
      sellers: []
    };
  }
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.fetchWalletData();
        this.fetchSellers();
      }
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
    this.didFocusSubscription.remove();
  }

  handleBackPress = () => {
    this.props.navigation.navigate(SCREENS.DASHBOARD_SCREEN);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    return true;
  };

  fetchWalletData = async () => {
    this.setState({
      error: null,
      isFetchingData: true
    });
    try {
      const walletData = await retrieveWalletDetails();
      //console.log("walletData total cashback", walletData.total_cashback);
      console.log("Wallet Transactions: ", walletData.result);
      let walletArray = [];
      walletData.result.forEach(money => {
        walletArray.push({
          description: money.description,
          date: moment(money.created_at)
            .format("DD MMM, YYYY")
            .toUpperCase(),
          id: money.id,
          price: money.amount,
          status_type: money.status_type,
          is_paytm: money.is_paytm,
          cashback_source: money.cashback_source,
          title: money.title
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

  fetchSellers = async () => {
    this.setState({
      error: null,
      isFetchingSellerData: true
    });
    try {
      const sellerData = await getMySellers();
      console.log("Seller Data: ", sellerData.result);
      //console.log('Seller Data: ', sellerData.result[0].name);
      //console.log('Seller Data: ', sellerData.result[0].cashback_total);
      this.setState({
        sellers: sellerData.result,
        isFetchingSellerData: false
      });
    } catch (error) {
      console.log("error: ", error);
      this.setState({
        error,
        isFetchingSellerData: false
      });
    }
  };

  renderTransactions = ({ item: transaction, index }) => {
    return (
      <SingleTransaction
        key={index}
        transaction={transaction}
        // date={transaction.date}
        // description={transaction.description}
        // date={transaction.date}
        // id={transaction.id}
        // price={transaction.price}
      />
    );
  };

  render() {
    const {
      transactions,
      totalCashback,
      isFetchingData,
      sellers,
      isFetchingSellerData
    } = this.state;
    //console.log("Sellers______________: ", sellers);
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
                sellers={sellers}
                handleBackPress={this.handleBackPress}
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
        <LoadingOverlay visible={isFetchingData || isFetchingSellerData} />
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
