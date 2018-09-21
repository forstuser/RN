import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

import { openBillsPopUp } from "../../navigation";
import { Text } from "../../elements";
import { getCashbackTransactions } from "../../api";
import { defaultStyles, colors } from "../../theme";

import StatusModal from "./status-modal";
import CashbackDispersedModal from "./cashback-dispersed-modal";

export default class CashbackBillsScreen extends React.Component {
  static navigationOptions = {
    title: "Cashback Claims"
  };

  state = {
    isLoading: true,
    error: null,
    transactions: [],
    measurementTypes: null
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

    const itemId = this.props.navigation.getParam("OrderID", "NO_ID");
    console.log("itemId: ", itemId);

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
            let statusColor = colors.success;
            let statusText = "Approved";

            if (item.is_pending) {
              statusColor = colors.pinkishOrange;
              statusText = "Pending Approval";
            } else if (item.is_underprogress) {
              statusColor = colors.pinkishOrange;
              statusText = "In Progress";
            } else if (item.is_rejected) {
              statusColor = "red";
              statusText = "Rejected";
            }

            console.log(statusColor);

            if (item.id == itemId) {
              this.cashbackDispersedModal.show(item);
            }

            let pointsEarned = null;
            let pointsRedeemed = null;
            let creditsAdded = null;
            let creditsSettled = null;
            let cashbackEarned = null;
            let expectedCashback = null;

            if (item.total_loyalty > 0) {
              pointsEarned = (
                <Text style={{ fontSize: 14, marginVertical: 5, marginTop: 0 }}>
                  Points Earned :
                  <Text weight="Bold">{` ` + item.total_loyalty}</Text>
                </Text>
              );
            }

            if (item.redeemed_loyalty > 0) {
              pointsRedeemed = (
                <Text
                  style={{ fontSize: 14, marginVertical: 5, marginTop: -5 }}
                >
                  Points Redeemed :
                  <Text weight="Bold">{` ` + item.redeemed_loyalty}</Text>
                </Text>
              );
            }

            if (item.total_credits > 0) {
              creditsAdded = (
                <Text
                  style={{ fontSize: 14, marginVertical: 5, marginTop: -5 }}
                >
                  Credits Earned :
                  <Text weight="Bold">{` ` + item.total_credits}</Text>
                </Text>
              );
            }

            if (item.redeemed_credits > 0) {
              creditsSettled = (
                <Text
                  style={{ fontSize: 14, marginVertical: 5, marginTop: -5 }}
                >
                  Credits Settled :
                  <Text weight="Bold">{` ` + item.redeemed_credits}</Text>
                </Text>
              );
            }

            if (item.total_cashback > 0) {
              cashbackEarned = (
                <Text style={{ fontSize: 14, marginTop: -5 }}>
                  Cashback Earned :
                  <Text weight="Bold">{` ` + item.total_cashback}</Text>
                </Text>
              );
            }

            if (item.pending_cashback > 0) {
              expectedCashback = (
                <Text style={{ fontSize: 14, marginTop: -5 }}>
                  Expected Cashback :
                  <Text weight="Bold">{` ` + item.pending_cashback}</Text>
                </Text>
              );
            }

            return (
              <TouchableOpacity
                onPress={() => this.cashbackDispersedModal.show(item)}
                style={{
                  ...defaultStyles.card,
                  margin: 10,
                  marginBottom: 2,
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
                  <Text style={{ fontSize: 14, marginTop: 5 }}>
                    Transaction Id :
                    <Text weight="Medium" style={{}}>
                      {` ` + item.id}
                    </Text>
                  </Text>
                  <Text
                    style={{ fontSize: 14, marginVertical: 5, marginTop: -1 }}
                  >
                    Price :<Text weight="Bold">{` ` + item.amount_paid}</Text>
                  </Text>
                  {cashbackEarned}
                  {expectedCashback}
                  {item.copies &&
                    item.copies.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          openBillsPopUp({
                            copies: item.copies || []
                          });
                        }}
                        style={{
                          marginTop: 10,
                          marginBottom: 5,
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <Icon
                          name="md-document"
                          color={colors.mainBlue}
                          size={15}
                        />
                        <Text
                          weight="Medium"
                          style={{
                            marginLeft: 4,
                            fontSize: 14,
                            color: colors.mainBlue
                          }}
                        >
                          View Bill
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
                <View style={{ flex: 1, paddingHorizontal: 5 }}>
                  <Text style={{ fontSize: 14, marginTop: 5 }}>
                    No. of items :
                    <Text weight="Medium" style={{}}>
                      {` ` + item.item_counts}
                    </Text>
                  </Text>
                  {pointsEarned}
                  {pointsRedeemed}
                  {creditsAdded}
                  {creditsSettled}
                  <TouchableOpacity
                    onPress={() => {
                      this.statusModal.show(item);
                    }}
                    style={{
                      marginBottom: 5,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      weight="Medium"
                      style={{
                        marginRight: 4,
                        fontSize: 14,
                        color: statusColor
                      }}
                    >
                      {statusText}
                    </Text>
                    <Icon
                      name="md-information-circle"
                      size={15}
                      style={{ marginTop: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
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
