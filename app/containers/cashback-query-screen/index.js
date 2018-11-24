import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  BackHandler
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

import { openBillsPopUp } from "../../navigation";
import { Text, Button } from "../../elements";
import { getCashbackTransactions } from "../../api";
import { defaultStyles, colors } from "../../theme";
import { SCREENS } from "../../constants";
import Modal from "react-native-modal";
import Header from "./header";
const tick = require("../../images/tick.png");

export default class CashbackQueryScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    isLoading: true,
    error: null,
    transactions: [],
    reasons: [],
    selectedTransaction: null,
    showCompletionModal: false
  };

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentDidMount() {
    console.log("IN DID MOUNT");
    const flagFromQueryReasons = this.props.navigation.getParam(
      "flagFromQueryReasons",
      false
    );
    console.log("flagFromQueryReasons in DID MOUNT", flagFromQueryReasons);
    if (flagFromQueryReasons) {
      this.setState({ showCompletionModal: true });
    }
    this.getCashbackTransactions();

    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        console.log("IN DID FOCUS");
      }
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate(SCREENS.DASHBOARD_SCREEN);
    return true;
  };

  onOkayPress = () => {
    this.setState({ showCompletionModal: false, selectedTransaction: null });
  };

  getCashbackTransactions = async () => {
    try {
      const res = await getCashbackTransactions();
      this.setState({
        transactions: res.result,
        reasons: res.reasons
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  selectTransaction = transaction => {
    this.setState({ selectedTransaction: transaction });
  };

  openReasonsScreen = () => {
    this.props.navigation.push(SCREENS.CASHBACK_QUERY_REASONS_SCREEN, {
      selectedTransaction: this.state.selectedTransaction,
      reasons: this.state.reasons
    });
  };

  render() {
    const {
      transactions,
      isLoading,
      error,
      selectedTransaction,
      showCompletionModal
    } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Header
          navigation={this.props.navigation}
          handleBackPress={this.handleBackPress}
        />
        <FlatList
          style={{ flex: 1, marginBottom: 5 }}
          contentContainerStyle={[
            { flexGrow: 1 },
            transactions.length ? null : { justifyContent: "center" }
          ]}
          data={transactions}
          refreshing={isLoading}
          onRefresh={this.getCashbackTransactions}
          keyExtractor={item => item.id}
          data={transactions}
          renderItem={this.renderTransactions}
          keyExtractor={item => item.id}
          ListEmptyComponent={() =>
            !isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff"
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    style={{ width: 100, height: 100 }}
                    source={require("../../images/cashback.png")}
                  />
                </View>
                <Text
                  //weight="Bold"
                  style={{
                    fontSize: 16,
                    color: colors.secondaryText,
                    marginTop: 5,
                    padding: 10
                  }}
                >
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
              statusText = "Under Progress";
            } else if (item.is_rejected) {
              statusColor = "red";
              statusText = "Rejected";
            } else if (item.is_discarded) {
              statusColor = "red";
              statusText = "Discarded";
            }

            return (
              <TouchableOpacity
                onPress={() => this.selectTransaction(item)}
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
                  <Text style={{ fontSize: 14, marginVertical: 5 }}>
                    Price :
                    <Text weight="Bold">{` ` + (item.amount_paid || 0)}</Text>
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    BB Cashback Earned :
                    <Text weight="Bold">{` ` + item.total_cashback}</Text>
                  </Text>
                  {item.copies && item.copies.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        openBillsPopUp({
                          copies: item.copies || []
                        });
                      }}
                      style={{
                        marginTop: 10,
                        marginBottom: 5,
                        flexDirection: "row"
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
                          fontSize: 11,
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
                  <Text style={{ fontSize: 14, marginVertical: 5 }}>
                    Points Earned :
                    <Text weight="Bold">{` ` + item.total_loyalty}</Text>
                  </Text>

                  {/* <TouchableOpacity
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
                        fontSize: 9,
                        color: statusColor
                      }}
                    >
                      {statusText}
                    </Text>
                    <Icon name="md-information-circle" size={13} />
                  </TouchableOpacity> */}
                </View>
                {selectedTransaction && selectedTransaction.id == item.id && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,.7)",
                      justifyContent: "center",
                      padding: 10
                    }}
                  >
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        borderColor: "#fff",
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Icon
                        name="md-checkmark"
                        color={colors.success}
                        size={25}
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
        {selectedTransaction && (
          <Button
            onPress={this.openReasonsScreen}
            text="Next"
            color="secondary"
            borderRadius={0}
          />
        )}
        <Modal useNativeDriver={true} isVisible={showCompletionModal}>
          <View
            collapsable={false}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              paddingVertical: 20,
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              width: 300,
              alignSelf: "center"
            }}
          >
            <Image
              style={{
                width: 90,
                height: 90
              }}
              source={tick}
              resizeMode="contain"
            />
            <Text
              weight="Bold"
              style={{ fontSize: 15, textAlign: "center", marginTop: 20 }}
            >
              Thank you for submitting your query.
            </Text>
            <Text
              weight="Medium"
              style={{ fontSize: 13, textAlign: "center", marginVertical: 20 }}
            >
              We will get back to you shortly.
            </Text>
            <Button
              onPress={this.onOkayPress}
              style={{ width: 150, height: 40 }}
              text="Okay"
              color="secondary"
            />
          </View>
        </Modal>
      </View>
    );
  }
}
