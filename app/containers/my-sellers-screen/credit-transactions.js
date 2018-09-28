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
import moment from "moment";
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
    console.log("transaction is ", transactions);
    // const seller = navigation.getParam("seller", {});

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          style={{ flex: 1, marginBottom: 5 }}
          data={transactions}
          keyExtractor={item => item.id}
          refreshing={isLoading}
          onRefresh={this.getSellerDetails}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  ...defaultStyles.card,
                  margin: 10,
                  borderRadius: 10,
                  overflow: "hidden",
                  flexDirection: "row",
                  padding: 10
                }}
              >
                <View style={{ alignItems: "center", paddingHorizontal: 10 }}>
                  <Text
                    weight="Bold"
                    style={{ fontSize: 33, color: "#ababab", marginTop: -10 }}
                  >
                    {moment(item.created_at).format("DD")}
                  </Text>
                  <Text
                    weight="Bold"
                    style={{ fontSize: 15, color: "#ababab", marginTop: -5 }}
                  >
                    {moment(item.created_at).format("MMM")}
                  </Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 5 }}>
                  <Text style={{ fontSize: 9 }}>
                    Credit Added :<Text weight="Bold">{` ` + item.amount}</Text>
                  </Text>
                  <Text style={{ fontSize: 9, marginVertical: 5 }}>
                    Transaction Id :
                    <Text weight="Medium" style={{ color: colors.mainBlue }}>
                      {` ` + item.id}
                    </Text>
                  </Text>
                  <Text style={{ fontSize: 9 }}>{item.description}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}
