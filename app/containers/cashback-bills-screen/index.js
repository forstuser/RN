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
import CashbackClaimItem from "./cashback-claim-item";
import { SCREENS } from "../../constants";

export default class CashbackBillsScreen extends React.Component {
  static navigationOptions = {
    title: "Cashback Status"
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

  openCashbackGuidelinesScreen = () => {
    this.statusModal.hide();
    this.cashbackDispersedModal.hide();
    this.props.navigation.navigate(SCREENS.CASHBACK_BILL_GUIDELINES_SCREEN);
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
          renderItem={({ item }) => (
            <CashbackClaimItem
              item={item}
              statusModal={() => this.statusModal.show(item)}
              cashbackDispersedModal={() =>
                this.cashbackDispersedModal.show(item)
              }
            />
          )}
        />
        <StatusModal
          ref={node => {
            this.statusModal = node;
          }}
          openCashbackGuidelinesScreen={this.openCashbackGuidelinesScreen}
        />
        <CashbackDispersedModal
          ref={node => {
            this.cashbackDispersedModal = node;
          }}
          openCashbackGuidelinesScreen={this.openCashbackGuidelinesScreen}
        />
      </View>
    );
  }
}
