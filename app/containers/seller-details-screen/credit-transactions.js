import React from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

import { API_BASE_URL, getSellerTransactionDetails } from "../../api";

import { Text, Button, Image } from "../../elements";

import { colors, defaultStyles } from "../../theme";
import TransactionItem from "./tranasaction-item-credits";
import CashbackClaimItem from "../cashback-bills-screen/cashback-claim-item";
import StatusModal from "../cashback-bills-screen/status-modal";
import CashbackDispersedModal from "../cashback-bills-screen/cashback-dispersed-modal";

export default class CreditTransactionsTab extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      transactions: [],
      isLoading: true,
      error: null
    };
  }
  componentDidMount() {
    this.getSellerTransactionDetails();
  }

  getSellerTransactionDetails = async () => {
    this.setState({
      isLoading: true,
      error: null
    });
    try {
      const res = await getSellerTransactionDetails(this.props.sellerID);
      console.log("new api", res);
      this.setState({
        transactions: res.result
      })
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { transactions, isLoading } = this.state;
    return (
      <View>
        <FlatList
          contentContainerStyle={[
            { flexGrow: 1 },
            transactions.length ? null : { justifyContent: "center" }
          ]}
          data={transactions}
          refreshing={isLoading}
          onRefresh={this.getSellerTransactionDetails}
          ListEmptyComponent={() =>
            !isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20
                }}
              >
                <Text style={{ marginTop: 40, textAlign: "center" }}>
                  You have not connected with this Seller as yet
              </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => <CashbackClaimItem item={item} statusModal={() => this.statusModal.show(item)} cashbackDispersedModal={() => this.cashbackDispersedModal.show(item)} />}
        />
        <StatusModal
          ref={node => {
            this.statusModal = node;
          }}
        />
        <CashbackDispersedModal
          ref={node => {
            this.cashbackDispersedModal = node;
          }}
        />
      </View>
    );
  }
}
