import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ORDER_STATUS_TYPES, ORDER_TYPES } from "../../constants";
import { Text, Button } from "../../elements";
import { defaultStyles } from "../../theme";
import moment from "moment";

class SingleDeliveryOrder extends Component {
  render() {
    const { order, onPress } = this.props;
    let btnText = null;
    if (order.status_type === ORDER_STATUS_TYPES.NEW)
      btnText = 'New';
    else if (order.status_type === ORDER_STATUS_TYPES.APPROVED)
      btnText = 'Approved';
    else if (order.status_type === ORDER_STATUS_TYPES.CANCELED)
      btnText = 'Cancelled';
    else if (order.status_type === ORDER_STATUS_TYPES.REJECTED)
      btnText = 'Rejected';
    else if (order.status_type === ORDER_STATUS_TYPES.OUT_FOR_DELIVERY)
      btnText = 'Out for delivery';
    else if (order.status_type === ORDER_STATUS_TYPES.COMPLETE)
      btnText = 'Complete';
    let orderType = order.order_type;
    let name = <Text weight="Medium">{order.seller.seller_name}</Text>;
    let id = <Text weight="Medium">{order.id}</Text>;
    let quantity = <Text weight="Medium">{order.order_details.length}</Text>;
    let service = <Text weight='Bold'>{order.order_details[0].service_name}</Text>;
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={[styles.box, styles.box1]}>
          <Text
            style={{
              marginTop: 10,
              fontSize: 30,
              textAlign: "center",
              color: "#ababab"
            }}
          >
            {moment(order.created_at).format('DD')}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: 0,
              fontSize: 20,
              color: "#ababab"
            }}
          >
            {moment(order.created_at).format('MMM')}
          </Text>
        </View>
        <View style={[styles.box, styles.box2]}>
          <Text style={styles.name}>User: {name}</Text>
          <Text style={styles.id}>Order Id: {id}</Text>
          {orderType == ORDER_TYPES.FMCG ? <Text style={styles.data}>No. of items: {quantity}</Text> : <Text style={styles.data}>Service requested: {service}</Text>
          }
          <Button
            style={{ height: 30, width: 150, marginTop: 10 }}
            text={btnText}
            onPress={() => { }}
            color="secondary"
            textStyle={{ fontSize: 14 }}
            type="outline"
            state='disabled'
          />
        </View>
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
    height: 140
  },
  box1: {
    flex: 2
  },
  box2: {
    flex: 8,
    marginLeft: 0
  },
  name: {
    marginTop: 10,
    fontSize: 14
  },
  id: {
    marginTop: 5,
    fontSize: 14
  },
  quantity: {
    marginTop: 5,
    fontSize: 14
  }
};

export default SingleDeliveryOrder;
