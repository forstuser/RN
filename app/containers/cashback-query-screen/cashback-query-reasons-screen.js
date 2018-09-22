import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Button } from "../../elements";
import { getCashbackTransactions } from "../../api";
import { defaultStyles, colors } from "../../theme";
import { SCREENS } from "../../constants";

export default class CashbackQueryReasonsScreen extends React.Component {
  static navigationOptions = {
    title: "Select Reason"
  };

  state = {
    selectedReason: null
  };

  selectReason = reason => {
    this.setState({ selectedReason: reason });
  };

  openAddtionalInfoScreen = () => {
    const { navigation } = this.props;
    navigation.push(SCREENS.CASHBACK_QUERY_ADDITIONAL_INFO_SCREEN, {
      selectedTransaction: navigation.state.params.selectedTransaction,
      reason: this.state.selectedReason
    });
  };

  render() {
    const reasons = this.props.navigation.getParam("reasons", [])
    const { selectedReason } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          style={{ flex: 1, marginBottom: 5 }}
          data={reasons}
          keyExtractor={item => item.title}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => this.selectReason(item)}
                style={{
                  ...defaultStyles.card,
                  margin: 10,
                  marginBottom: 2,
                  borderRadius: 10,
                  overflow: "hidden",
                  flexDirection: "row",
                  padding: 10,
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderColor: "#d7d7d7",
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10
                  }}
                >
                  {selectedReason &&
                    selectedReason.title == item.title && (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: colors.pinkishOrange
                        }}
                      />
                    )}
                </View>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
        {selectedReason && (
          <Button
            onPress={this.openAddtionalInfoScreen}
            text="Next"
            color="secondary"
            borderRadius={0}
          />
        )}
      </View>
    );
  }
}
