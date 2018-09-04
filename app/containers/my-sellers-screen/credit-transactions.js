import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";

import { API_BASE_URL, getSellerDetails } from "../../api";

import { Text, Image, Button } from "../../elements";

import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { defaultStyles, colors } from "../../theme";
import { SCREENS } from "../../constants";

import CreditTransactionsList from "../seller-details-screen/credit-transactions";

export default class MySellersCreditTransactionsScreen extends React.Component {
  static navigationOptions = {
    title: "Credit Transactions"
  };

  state = {
    transactions: [],
    isLoading: false,
    error: null
  };

  componentDidMount() {
    this.getSellerDetails();
  }

  getSellerDetails = async () => {
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    this.setState({
      isLoading: true
    });
    try {
      const res = await getSellerDetails(seller.id);
      this.setState({
        transactions: res.result.seller_credits
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { navigation } = this.props;
    const { transactions, isLoading } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <CreditTransactionsList
          transactions={transactions}
          isLoading={isLoading}
          onRefresh={this.getSellerDetails}
        />
      </View>
    );
  }
}
