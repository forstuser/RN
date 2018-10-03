import React from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

import { API_BASE_URL } from "../../api";

import { Text, Button, Image } from "../../elements";

import { colors, defaultStyles } from "../../theme";
import TransactionItem from "./transaction-item-points";

export default class CreditTransactionsTab extends React.Component {
  render() {
    const { transactions, isLoading, onRefresh } = this.props;

    return (
      <FlatList
        contentContainerStyle={[
          { flexGrow: 1 },
          transactions.length ? null : { justifyContent: "center" }
        ]}
        data={transactions}
        refreshing={isLoading}
        onRefresh={onRefresh}
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
              <Text
                style={{
                  marginTop: 40,
                  textAlign: "center",
                  fontSize: 16,
                  color: colors.secondaryText
                }}
              >
                No transactions has been made yet.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => <TransactionItem item={item} />}
      />
    );
  }
}
