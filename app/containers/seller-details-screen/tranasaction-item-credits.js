import React from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

import { API_BASE_URL } from "../../api";

import { Text, Button, Image } from "../../elements";

import { colors, defaultStyles } from "../../theme";

export default class TransactionItem extends React.Component {
  render() {
    const { item } = this.props;
    let credit = <Text style={{ fontSize: 14 }}>
        Credit Added :<Text weight="Bold">{` ` + item.amount}</Text>
      </Text>;
    if(item.transaction_type === 2) {
      credit = <Text style={{ fontSize: 14 }}>
        Credit Settled :<Text weight="Bold">{` ` + item.amount}</Text>
      </Text>;
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
          {credit}
          <Text style={{ fontSize: 14, marginVertical: 5 }}>
            Transaction Id :
            <Text weight="Medium" style={{ color: colors.mainBlue }}>
              {` ` + item.id}
            </Text>
          </Text>
          <Text style={{ fontSize: 14 }}>{item.description}</Text>
        </View>
      </View>
    );
  }
}
