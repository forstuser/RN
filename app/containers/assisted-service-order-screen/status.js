import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Image, Button } from "../../elements";
import { colors } from "../../theme";
import { ORDER_STATUS_TYPES } from "../../constants";

const StatusItem = ({ isDone = false, title }) => (
  <View style={{ flexDirection: "row", paddingVertical: 12 }}>
    <View
      style={{
        width: 21,
        height: 21,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: isDone ? colors.success : colors.secondaryText,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {isDone && <Icon name="md-checkmark" color={colors.success} />}
    </View>
    <Text
      style={{
        marginLeft: 18,
        color: isDone ? colors.mainText : colors.secondaryText
      }}
    >
      {title}
    </Text>
  </View>
);

export default class Statuses extends React.Component {
  render() {
    const { statusType, isOrderModified = true } = this.props;

    return (
      <View style={{ marginBottom: 10 }}>
        <Text weight="Bold" style={{ fontSize: 13.5 }}>
          Status :{" "}
          {statusType == ORDER_STATUS_TYPES.COMPLETE && (
            <Text style={{ color: colors.success }}>Completed</Text>
          )}
          {statusType == ORDER_STATUS_TYPES.REJECTED && (
            <Text style={{ color: colors.danger }}>Rejected</Text>
          )}
          {statusType == ORDER_STATUS_TYPES.CANCELED && (
            <Text style={{ color: colors.danger }}>Canceled</Text>
          )}
        </Text>

        {![
          ORDER_STATUS_TYPES.COMPLETE,
          ORDER_STATUS_TYPES.REJECTED,
          ORDER_STATUS_TYPES.CANCELED
        ].includes(statusType) && (
          <View>
            <View
              style={{
                position: "absolute",
                left: 10,
                top: 15,
                bottom: 15,
                width: 1,
                backgroundColor: "#cccccc"
              }}
            />
            <StatusItem title="Request Sent" isDone={true} />
            <StatusItem
              title="Accepted"
              isDone={
                [
                  ORDER_STATUS_TYPES.APPROVED,
                  ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
                  ORDER_STATUS_TYPES.COMPLETE
                ].includes(statusType) || isOrderModified
              }
            />
            {isOrderModified && (
              <View>
                <StatusItem title="Order Modified" isDone={true} />
                <StatusItem
                  title="Modification Approved"
                  isDone={[
                    ORDER_STATUS_TYPES.APPROVED,
                    ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
                    ORDER_STATUS_TYPES.COMPLETE
                  ].includes(statusType)}
                />
              </View>
            )}
            {[
              ORDER_STATUS_TYPES.APPROVED,
              ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
              ORDER_STATUS_TYPES.COMPLETE
            ].includes(statusType) && (
              <StatusItem
                title="Out For Delivery"
                isDone={[
                  ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
                  ORDER_STATUS_TYPES.COMPLETE
                ].includes(statusType)}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}
