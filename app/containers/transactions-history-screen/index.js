import React from "react";
import { View, FlatList } from "react-native";
import moment from "moment";

import { Text } from "../../elements";
import { getCashbackTransactions } from "../../api";
import { defaultStyles, colors } from "../../theme";

export default class TransactionsHistoryScreen extends React.Component {
  static navigationOptions = {
    title: "Transaction History"
  };

  state = {
    isLoading: true,
    error: null,
    transactions: []
  };

  componentDidMount() {
    this.getCashbackTransactions();
  }

  getCashbackTransactions = async () => {
    try {
      const res = await getCashbackTransactions();
      this.setState({
        transactions: res.result
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const { transactions, isLoading, error } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          contentContainerStyle={[
            { flexGrow: 1 },
            transactions.length ? null : { justifyContent: "center" }
          ]}
          data={transactions}
          refreshing={isLoading}
          onRefresh={this.getCashbackTransactions}
          keyExtractor={item => item.id}
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
                  No transactions has been made yet.
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            let statusColor: "red";
            if (item.is_pending) {
              statusColor: "yellow";
            } else if (item.is_rejected) {
              statusColor: "red";
            }

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
                  <Text style={{ fontSize: 9, marginTop: 5 }}>
                    Transaction Id :
                    <Text weight="Medium" style={{}}>
                      {` ` + item.id}
                    </Text>
                  </Text>
                  <Text style={{ fontSize: 9, marginVertical: 5 }}>
                    Price :<Text weight="Bold">{` ` + item.amount_paid}</Text>
                  </Text>
                  <Text style={{ fontSize: 9 }}>
                    BB Cashback Earned :
                    <Text weight="Bold">{` ` + item.total_cashback}</Text>
                  </Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 5 }}>
                  <Text style={{ fontSize: 9, marginTop: 5 }}>
                    No. of items :
                    <Text weight="Medium" style={{}}>
                      {` ` + item.item_counts}
                    </Text>
                  </Text>
                  <Text style={{ fontSize: 9, marginVertical: 5 }}>
                    Points Earned :
                    <Text weight="Bold">{` ` + item.total_loyalty}</Text>
                  </Text>
                  <Text style={{ fontSize: 9, color: statusColor }}>
                    Pending Approval
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}
