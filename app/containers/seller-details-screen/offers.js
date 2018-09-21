import React from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

import { API_BASE_URL } from "../../api";

import { Text, Button, Image } from "../../elements";

import { colors, defaultStyles } from "../../theme";

export default class Offers extends React.Component {
  render() {
    const { offers, isLoading } = this.props;

    return (
      <FlatList
        contentContainerStyle={[
          { flexGrow: 1 },
          offers.length ? null : { justifyContent: "center" }
        ]}
        data={offers}
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
                There are no Offers by this Seller at the moment
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={{ ...defaultStyles.card, margin: 10, borderRadius: 5 }}>
            <Image
              style={{ height: 120 }}
              source={{
                uri:
                  API_BASE_URL +
                  `/offer/${item.id}/images/${item.document_details.index || 0}`
              }}
            />
            <View style={{ padding: 10 }}>
              <Text weight="Medium" style={{ fontSize: 11 }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 9 }}>{item.description}</Text>
              <Text style={{ fontSize: 9, color: colors.mainBlue }}>
                Expire on: {moment(item.end_date).format("DD MMM, YYYY")}
              </Text>
            </View>
          </View>
        )}
      />
    );
  }
}
