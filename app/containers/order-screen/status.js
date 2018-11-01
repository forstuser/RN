import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Image, Button } from "../../elements";
import { colors } from "../../theme";
import { ORDER_STATUS_TYPES, ORDER_TYPES } from "../../constants";

const StatusItem = ({ isDone = false, title }) => (
  <View style={{ flexDirection: "row", paddingVertical: 12 }}>
    <View
      style={{
        width: 21,
        height: 21,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: isDone ? colors.success : colors.secondaryText,
        backgroundColor: isDone ? colors.success : "#fff",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {isDone && <Icon name="md-checkmark" color="#fff" />}
    </View>
    <Text
      style={{
        marginLeft: 18,
        color: isDone ? colors.mainText : colors.secondaryText,
        fontSize: 15
      }}
    >
      {title}
    </Text>
  </View>
);

export default class Statuses extends React.Component {
  render() {
    const {
      statusType,
      isOrderModified = true,
      orderType = ORDER_TYPES.FMCG,
      startTime,
      endTime,
      isInReview,
      paymentMode,
      paymentStatus
    } = this.props;

    return (
      <View style={{ marginBottom: 10 }}>
        <Text weight="Regular" style={{ fontSize: 11 }}>
          {/* Status :{" "} */}
          {statusType == ORDER_STATUS_TYPES.NEW &&
            isOrderModified == true && (
              <Text style={{ color: colors.success }}>MODIFIED</Text>
            )}
          {statusType == ORDER_STATUS_TYPES.NEW &&
            isInReview == true &&
            isOrderModified != true && (
              <Text style={{ color: colors.success }}>IN REVIEW</Text>
            )}
          {statusType == ORDER_STATUS_TYPES.NEW &&
            isInReview != true && (
              <Text style={{ color: colors.success }}>NEW</Text>
            )}
          {statusType == ORDER_STATUS_TYPES.COMPLETE && (
            <Text style={{ color: colors.success }}>COMPLETED</Text>
          )}
          {statusType == ORDER_STATUS_TYPES.APPROVED && (
            <Text style={{ color: colors.pinkishOrange }}>IN PROGRESS</Text>
          )}
          {statusType == ORDER_STATUS_TYPES.AUTO_CANCEL && (
            <Text style={{ color: colors.danger }}>AUTO CANCELLED</Text>
          )}
          {statusType == ORDER_STATUS_TYPES.REJECTED && (
            <Text style={{ color: colors.danger }}>REJECTED</Text>
          )}
          {statusType == ORDER_STATUS_TYPES.CANCELED && (
            <Text style={{ color: colors.danger }}>CANCELLED</Text>
          )}
        </Text>
        {paymentMode && paymentMode != "" && paymentStatus != 4 ? (
          <Text weight="Bold" style={{ fontSize: 15 }}>
            Payment Mode :{" "}
            {paymentMode &&
              paymentMode == 5 && (
                <Text style={{ color: colors.success }}>On Credit</Text>
              )}
            {paymentMode &&
              paymentMode == 1 && (
                <Text style={{ color: colors.success }}>Offline</Text>
              )}
            {paymentMode &&
              paymentMode == 4 && (
                <Text style={{ color: colors.success }}>Online</Text>
              )}
          </Text>
        ) : null}

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
            <StatusItem
              title={
                orderType == ORDER_TYPES.FMCG ? "Order Placed" : "Request Sent"
              }
              isDone={true}
            />
            {isOrderModified === false ? (
              <StatusItem
                title={
                  statusType === ORDER_STATUS_TYPES.APPROVED
                    ? "Items Confirmed"
                    : "Confirmation Awaited"
                }
                isDone={
                  [
                    ORDER_STATUS_TYPES.APPROVED,
                    ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
                    ORDER_STATUS_TYPES.COMPLETE,
                    ORDER_STATUS_TYPES.START_TIME,
                    ORDER_STATUS_TYPES.END_TIME
                  ].includes(statusType) || isOrderModified
                }
              />
            ) : null}
            {isOrderModified && (
              <View>
                <StatusItem
                  title={
                    orderType == ORDER_TYPES.FMCG
                      ? "Order Modified"
                      : "Provider Assigned"
                  }
                  isDone={true}
                />
                <StatusItem
                  title={
                    orderType == ORDER_TYPES.FMCG
                      ? "Modification Approved"
                      : "Provider Approved"
                  }
                  isDone={[
                    ORDER_STATUS_TYPES.APPROVED,
                    ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
                    ORDER_STATUS_TYPES.COMPLETE,
                    ORDER_STATUS_TYPES.START_TIME,
                    ORDER_STATUS_TYPES.END_TIME
                  ].includes(statusType)}
                />
              </View>
            )}
            {[
              ORDER_STATUS_TYPES.APPROVED,
              ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
              ORDER_STATUS_TYPES.COMPLETE,
              ORDER_STATUS_TYPES.START_TIME,
              ORDER_STATUS_TYPES.END_TIME
            ].includes(statusType) && (
              <StatusItem
                title={
                  orderType == ORDER_TYPES.FMCG
                    ? "Out For Delivery"
                    : "Provider Out For Service Delivery"
                }
                isDone={[
                  ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
                  ORDER_STATUS_TYPES.COMPLETE,
                  ORDER_STATUS_TYPES.START_TIME,
                  ORDER_STATUS_TYPES.END_TIME
                ].includes(statusType)}
              />
            )}
            {paymentStatus && paymentStatus == 13 ? (
              <StatusItem title="Payment Pending" />
            ) : null}

            {[
              ORDER_STATUS_TYPES.APPROVED,
              ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
              ORDER_STATUS_TYPES.COMPLETE,
              ORDER_STATUS_TYPES.START_TIME,
              ORDER_STATUS_TYPES.END_TIME
            ].includes(statusType) &&
              orderType == ORDER_TYPES.ASSISTED_SERVICE && (
                <StatusItem title="Service Started" isDone={!!startTime} />
              )}

            {[
              ORDER_STATUS_TYPES.APPROVED,
              ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
              ORDER_STATUS_TYPES.COMPLETE,
              ORDER_STATUS_TYPES.START_TIME,
              ORDER_STATUS_TYPES.END_TIME
            ].includes(statusType) &&
              orderType == ORDER_TYPES.ASSISTED_SERVICE && (
                <StatusItem title="Service Completed" isDone={endTime} />
              )}
          </View>
        )}
      </View>
    );
  }
}
