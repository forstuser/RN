import React from "react";
import { View, TouchableOpacity } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { openBillsPopUp } from "../../navigation";
import { Text } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default ({ item, cashbackDispersedModal, statusModal }) => {
  let variable =
    item.user_wallets.length > 0
      ? item.user_wallets.filter(wallet => wallet.seller_id === null)
      : null;
  console.log("variable is", variable);
  let fixed_cashback = 0;
  if (variable !== null && variable.length > 0) {
    fixed_cashback = variable !== null ? variable[0].amount : null;
  }
  if (fixed_cashback == undefined || fixed_cashback == null) {
    fixed_cashback = 0;
  }
  let statusColor = colors.success;
  let statusText = "Approved";
  if (item.is_pending) {
    statusColor = colors.pinkishOrange;
    statusText = "Pending Approval";
  } else if (item.is_underprogress || item.is_partial) {
    statusColor = colors.pinkishOrange;
    statusText = "In Progress";
  } else if (item.is_rejected) {
    statusColor = "red";
    statusText = "Rejected";
  } else if (item.is_discarded) {
    statusColor = "red";
    statusText = "Discarded";
  }

  // console.log(statusColor);

  let pointsEarned = null;
  let pointsRedeemed = null;
  let creditsAdded = null;
  let creditsSettled = null;
  let cashbackEarned = null;
  let expectedCashback = null;

  if (item.total_loyalty > 0) {
    pointsEarned = (
      <Text style={{ fontSize: 14, marginVertical: 5, marginTop: 0 }}>
        Points Earned :<Text weight="Bold">{` ` + item.total_loyalty}</Text>
      </Text>
    );
  }

  if (item.redeemed_loyalty > 0) {
    pointsRedeemed = (
      <Text style={{ fontSize: 14, marginVertical: 5, marginTop: -5 }}>
        Points Redeemed :
        <Text weight="Bold">{` ` + item.redeemed_loyalty}</Text>
      </Text>
    );
  }

  if (item.total_credits > 0) {
    creditsAdded = (
      <Text style={{ fontSize: 14, marginVertical: 5, marginTop: -5 }}>
        Credits Earned :<Text weight="Bold">{` ` + item.total_credits}</Text>
      </Text>
    );
  }

  if (item.redeemed_credits > 0) {
    creditsSettled = (
      <Text style={{ fontSize: 14, marginVertical: 5, marginTop: -5 }}>
        Credits Settled :
        <Text weight="Bold">{` ` + item.redeemed_credits}</Text>
      </Text>
    );
  }

  if (item.total_cashback > 0) {
    cashbackEarned = (
      <Text style={{ fontSize: 14, marginTop: -5 }}>
        Cashback Earned :
        <Text weight="Bold">{` ` + item.total_cashback.toFixed(2)}</Text>
      </Text>
    );
  }

  if (item.pending_cashback > 0) {
    expectedCashback = (
      <Text style={{ fontSize: 14, marginTop: -5 }}>
        Expected Cashback :
        <Text weight="Bold">{` ` + item.pending_cashback.toFixed(2)}</Text>
      </Text>
    );
  }

  return (
    <TouchableOpacity
      onPress={cashbackDispersedModal}
      style={{
        margin: 10,
        marginBottom: 2,
        borderRadius: 10,
        flexDirection: "row",
        padding: 10,
        ...defaultStyles.card
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
        <Text style={{ fontSize: 14, marginVertical: 5, marginTop: -1 }}>
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
              <Icon name="md-document" color={colors.mainBlue} size={15} />
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
          onPress={statusModal}
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
};
