import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { Text, Image, Button } from "../../elements";
import { colors } from "../../theme";
import { ORDER_STATUS_TYPES, ORDER_TYPES } from "../../constants";
import Modal from "react-native-modal";

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
  state = {
    isModalVisible: false
  };
  showAutoCancelModal = () => {
    this.setState({ isModalVisible: true });
  };
  hideAutoCancelModal = () => {
    this.setState({ isModalVisible: false });
  };
  render() {
    const {
      statusType,
      isOrderModified = true,
      orderType = ORDER_TYPES.FMCG,
      startTime,
      endTime,
      isInReview,
      paymentMode,
      paymentStatus,
      collectAtStore,
      autoCancelTime,
      deliveryMinutes,
      autoAcceptTime,
      deliveryClockStartTime,
      autoCancelPenalty
    } = this.props;

    let minutesToDeliver, hrsMins, deliveryStart;
    if (
      deliveryMinutes < 60 ||
      deliveryMinutes == null ||
      deliveryMinutes == "null"
    ) {
      if (deliveryMinutes == null || deliveryMinutes == "null") {
        minutesToDeliver = 0;
      } else {
        minutesToDeliver = deliveryMinutes;
        hrsMins = "minutes";
      }
    } else {
      minutesToDeliver = parseFloat(parseFloat(deliveryMinutes) / 60).toFixed(
        2
      );
      hrsMins = "hours";
    }
    deliveryStart = moment(deliveryClockStartTime)
      .add(deliveryMinutes, "minutes")
      .format("hh:mm A");
    // console.log("Delivery Time: ", deliveryStart);
    // console.log("Time to Delivery: ", deliveryMinutes);

    return (
      <View style={{ marginBottom: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center"
          }}
        >
          <Text weight="Bold" style={{ fontSize: 14 }}>
            Status :{" "}
          </Text>
          <Text weight="Medium" style={{ fontSize: 11 }}>
            {statusType == ORDER_STATUS_TYPES.NEW &&
              isOrderModified == true && (
                <Text style={{ color: colors.success }}>MODIFIED</Text>
              )}
            {statusType == ORDER_STATUS_TYPES.NEW &&
              isInReview == true &&
              isOrderModified != true && (
                <Text style={{ color: colors.success }}>IN REVIEW</Text>
              )}
            {statusType == ORDER_STATUS_TYPES.NEW && isInReview != true && (
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
        </View>
        {paymentMode && paymentMode != "" && paymentStatus != 4 ? (
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              marginTop: 8
            }}
          >
            <Text weight="Bold" style={{ fontSize: 14 }}>
              Payment Mode :{" "}
            </Text>
            <Text weight="Regular">
              {paymentMode && paymentMode == 5 && (
                <Text style={{ color: colors.success }}>On Credit</Text>
              )}
              {paymentMode && paymentMode == 1 && (
                <Text style={{ color: colors.success }}>Offline</Text>
              )}
              {paymentMode && paymentMode == 4 && (
                <Text style={{ color: colors.success }}>Online</Text>
              )}
            </Text>
          </View>
        ) : null}

        {(statusType == ORDER_STATUS_TYPES.NEW && isInReview != true) ||
        (statusType == ORDER_STATUS_TYPES.NEW &&
          isInReview == true &&
          isOrderModified != true) ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#ef622c", marginLeft: "13%", fontSize: 12 }}>
              (Store will confirm order within {autoCancelTime} min)
            </Text>
            <Icon
              style={{ marginLeft: 3 }}
              name="md-information-circle"
              sixe={10}
              onPress={this.showAutoCancelModal}
            />
          </View>
        ) : null}

        {statusType == ORDER_STATUS_TYPES.APPROVED &&
        collectAtStore == false ? (
          <Text
            weight="Medium"
            style={{ color: "#ef622c", fontSize: 16, marginTop: 5 }}
          >
            Order Delivery Time: {deliveryStart}
          </Text>
        ) : null}

        {statusType == ORDER_STATUS_TYPES.NEW && isOrderModified == true ? (
          <View>
            {collectAtStore == false && minutesToDeliver > 0 ? (
              <Text
                weight="Medium"
                style={{ color: "#ef622c", fontSize: 16, marginTop: 5 }}
              >
                Order Delivery Time within {minutesToDeliver} {hrsMins} from
                Your Approval
              </Text>
            ) : null}
            <Text style={{ color: "#999999", fontSize: 14, marginTop: 5 }}>
              Your Order will be Automatically Approved if you do not respond
              within {autoAcceptTime} minutes
            </Text>
          </View>
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
                  statusType === ORDER_STATUS_TYPES.APPROVED ||
                  statusType == ORDER_STATUS_TYPES.OUT_FOR_DELIVERY
                    ? "Order Accepted"
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
                    ? !collectAtStore
                      ? "Out For Delivery"
                      : "Ready for Pickup"
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
        <Modal
          isVisible={this.state.isModalVisible}
          useNativeDriver
          onBackButtonPress={this.hideAutoCancelModal}
          onBackdropPress={this.hideAutoCancelModal}
        >
          <View
            style={{
              backgroundColor: "#fff",
              height: 110,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              padding: 10
            }}
          >
            <Text>
              If the Store does not respond within {autoCancelTime} mins, you
              will need to reorder. The Store's late response penalty of ₹{" "}
              {autoCancelPenalty}/- will be credited to your Wallet. This
              cashback is not applicable in case of reorder.
            </Text>
          </View>
        </Modal>
      </View>
    );
  }
}
