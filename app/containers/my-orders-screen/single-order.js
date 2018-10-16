import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";

import { Text } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import { SCREENS, ORDER_STATUS_TYPES, ORDER_TYPES } from "../../constants";
import { API_BASE_URL } from "../../api";
import moment from "moment";
import { Button } from "../../elements";

class SingleOrder extends Component {
  openOrderScreen = order => {
    console.log(order);
    this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
      orderId: order.id
    });
  };

  render() {
    const { item } = this.props;
    let statusType = null;
    let orderType = item.order_type;
    if (item.status_type === ORDER_STATUS_TYPES.COMPLETE)
      statusType = (
        <Text style={{ fontSize: 12, color: colors.success }}>COMPLETED</Text>
      );
    else if (item.seller.status_type === ORDER_STATUS_TYPES.NEW)
      statusType = (
        <Text style={{ fontSize: 12, color: colors.mainText }}>NEW</Text>
      );
    else if (item.status_type === ORDER_STATUS_TYPES.APPROVED)
      statusType = <Text style={{ fontSize: 12 }}>APPROVED</Text>;
    else if (item.status_type === ORDER_STATUS_TYPES.CANCELED)
      statusType = (
        <Text style={{ fontSize: 12, color: colors.danger }}>CANCELLED</Text>
      );
    else if (item.status_type === ORDER_STATUS_TYPES.REJECTED)
      statusType = (
        <Text style={{ fontSize: 12, color: colors.danger }}>REJECTED</Text>
      );
    else if (item.status_type === ORDER_STATUS_TYPES.OUT_FOR_DELIVERY)
      statusType = <Text style={{ fontSize: 10 }}>OUT FOR DELIVERY</Text>;
    let status = <Text weight="Bold">{statusType}</Text>;
    let name = <Text weight="Bold">{item.seller.seller_name}</Text>;

    let quantity = null;
    if (orderType === ORDER_TYPES.FMCG)
      quantity = <Text weight="Bold">{item.order_item_counts}</Text>;
    let service = null;
    if (orderType === ORDER_TYPES.ASSISTED_SERVICE)
      service = <Text weight="Bold">{item.order_details[0].service_name}</Text>;
    let dateTime = (
      <Text weight="Bold">
        {moment(item.created_at).format("DD MMM, YYYY")}{" "}
        {moment(item.created_at).format("hh:mm a")}
      </Text>
    );
    let amount = <Text weight="Bold">{item.total_amount}</Text>;
    let cashback = <Text weight="Bold">{item.available_cashback}</Text>;
    let cashbackStatus = (
      <Text style={styles.data}>Cashback earned: {cashback}</Text>
    );
    if (item.cashback_status === 13) {
      cashbackStatus = (
        <Button
          style={{ height: 30, width: 200, marginTop: 10 }}
          text="View Cashback Status"
          onPress={() =>
            this.props.navigation.navigate(SCREENS.CASHBACK_BILLS_SCREEN, {
              orderID: item.job_id
            })
          }
          color="secondary"
          textStyle={{ fontSize: 14 }}
        />
      );
    }

    if (
      item.cashback_status === null ||
      item.cashback_status === 15 ||
      item.cashback_status === 17 ||
      item.cashback_status === 18
    ) {
      cashback = <Text weight="Bold">0</Text>;
      cashbackStatus = (
        <Text style={styles.data}>Cashback earned: {cashback}</Text>
      );
    }

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.openOrderScreen(item)}
      >
        <View style={[styles.box, styles.box1]}>
          <Image
            style={{
              width: 68,
              height: 68,
              borderRadius: 35
            }}
            source={{
              uri:
                API_BASE_URL +
                `/consumer/sellers/${item.seller_id}/upload/1/images/0`
            }}
          />
        </View>
        <View style={[styles.box, styles.box2]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.info}>Seller: {name}</Text>
            <Text style={styles.status}>{status}</Text>
          </View>
          {orderType == ORDER_TYPES.FMCG ? (
            <Text style={styles.data}>No. of items: {quantity}</Text>
          ) : (
            <Text style={styles.data}>Service requested: {service}</Text>
          )}
          <Text style={styles.data}>Date: {dateTime}</Text>
          <Text style={styles.data}>Amount: {amount}</Text>
          {cashbackStatus}
        </View>
        {/* <View style={[styles.box, styles.box3]}>
                    <Text style={styles.status}>{status}</Text>
                </View> */}
      </TouchableOpacity>
    );
  }
}

const styles = {
  container: {
    ...defaultStyles.card,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    margin: 10
  },
  box: {
    height: 180
  },
  box1: {
    padding: 10
  },
  box2: {
    flex: 1
  },

  info: {
    marginTop: 10,
    flex: 1
  },
  data: {
    marginTop: 5
  },
  status: {
    textAlign: "right",
    marginRight: 20,
    marginTop: 10,
    fontSize: 14
  },
  imageIcon: {
    height: 60,
    width: 60,
    marginLeft: 10,
    marginTop: 40
  }
};

export default SingleOrder;
