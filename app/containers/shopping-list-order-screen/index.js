import React from "react";
import { View, FlatList, Alert } from "react-native";

import { Text, Image, Button } from "../../elements";
import {
  getOrderDetails,
  approveOrder,
  cancelOrder,
  rejectOrder,
  completeOrder
} from "../../api";

import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { showSnackbar } from "../../utils/snackbar";

import { ORDER_STATUS_TYPES } from "../../constants";

import Status from "./status";
import SellerDetails from "./seller-details";
import ListItem from "./list-item";

import socketIo from "../../socket-io";

export default class ShoppingListOrderScreen extends React.Component {
  static navigationOptions = {
    title: "Order Details"
  };

  state = {
    isLoading: true,
    error: null,
    order: null
  };

  componentDidMount() {
    this.getOrderDetails();
    // socketIo.socket.on("order-status-change", data => {
    //   console.log("socket order-status-change data: " + data);
    //   // this.setState({ order: JSON.parse(data) });
    // });
    if (socketIo.socket) {
      socketIo.socket.on("order-status-change", data => {
        const jsonData = JSON.parse(data.trim());
        this.setState({ order: jsonData.order });
      });
    }
  }

  componentWillUnmount() {
    if (socketIo.socket) {
      socketIo.socket.off("order-status-change");
    }
  }

  getOrderDetails = async () => {
    const { navigation } = this.props;
    const orderId = navigation.getParam("orderId", null);
    this.setState({ isLoading: true, error: null });
    try {
      const res = await getOrderDetails({ orderId });
      this.setState({ order: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  cancelOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      await cancelOrder({ orderId: order.id, sellerId: order.seller_id });
      showSnackbar({ text: "Order Cancelled!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  rejectOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      await rejectOrder({ orderId: order.id, sellerId: order.seller_id });
      showSnackbar({ text: "Order Rejected!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  approveOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      await approveOrder({
        orderId: order.id,
        sellerId: order.seller_id,
        skuList: order.order_details
      });
      showSnackbar({ text: "Order Approved!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  completeOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      await completeOrder({ orderId: order.id, sellerId: order.seller_id });
      showSnackbar({ text: "Order completed!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  declineItem = index => {
    Alert.alert(
      "Are you sure?",
      "Declining would mark this item to be deleted from the List",
      [
        {
          text: "Cancel",
          onPress: () => {}
        },
        {
          text: "Confirm",
          onPress: () => this.removeItem(index)
        }
      ]
    );
  };

  removeItem = index => {
    const { order } = this.state;
    const order_details = [...order.order_details];
    order_details.splice(index, 1);
    order.order_details = order_details;
    this.setState({ order });
  };

  render() {
    const { isLoading, error, order } = this.state;

    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.getOrderDetails} />;
    }

    let totalAmount = 0;

    if (order) {
      totalAmount = order.order_details.reduce((total, item) => {
        return total + item.sku_measurement.mrp * item.quantity;
      }, 0);
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {order && (
          <View style={{ flex: 1 }}>
            <FlatList
              style={{ flex: 1 }}
              ListHeaderComponent={() => (
                <View
                  style={{ borderBottomColor: "#dadada", borderBottomWidth: 1 }}
                >
                  <Status
                    statusType={order.status_type}
                    isOrderModified={order.is_modified}
                  />
                  <SellerDetails
                    seller={order.seller}
                    orderDate={order.created_at}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 5
                    }}
                  >
                    <Text
                      weight="Medium"
                      style={{ fontSize: 10.5, color: "#777777" }}
                    >
                      Shopping List
                    </Text>
                    <Text
                      weight="Medium"
                      style={{ fontSize: 10.5, color: "#777777" }}
                    >
                      Price
                    </Text>
                  </View>
                </View>
              )}
              data={order.order_details}
              extraData={order}
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: "#eee" }} />
              )}
              keyExtractor={(item, index) => item.id + "" + index}
              renderItem={({ item, index }) => (
                <ListItem
                  item={item}
                  index={index}
                  declineItem={() => {
                    this.declineItem(index);
                  }}
                />
              )}
              ListFooterComponent={() => (
                <View
                  style={{
                    flexDirection: "row",
                    height: 42,
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                    marginHorizontal: 10,
                    alignItems: "center"
                  }}
                >
                  <Text weight="Medium" style={{ flex: 1 }}>
                    Total Amount
                  </Text>
                  <Text weight="Medium">Rs. {totalAmount}</Text>
                </View>
              )}
            />
            <View>
              {order.status_type == ORDER_STATUS_TYPES.NEW &&
                !order.is_modified && (
                  <Button
                    onPress={this.cancelOrder}
                    text="Cancel Order"
                    color="secondary"
                    borderRadius={0}
                  />
                )}

              {order.status_type == ORDER_STATUS_TYPES.APPROVED && (
                <Button
                  onPress={this.completeOrder}
                  text="Mark Paid"
                  color="secondary"
                  borderRadius={0}
                />
              )}

              {order.is_modified &&
                order.status_type != ORDER_STATUS_TYPES.APPROVED && (
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      onPress={this.rejectOrder}
                      text="Reject"
                      color="grey"
                      borderRadius={0}
                      style={{ flex: 1 }}
                    />
                    <Button
                      onPress={this.approveOrder}
                      text="Approve"
                      color="secondary"
                      borderRadius={0}
                      style={{ flex: 1 }}
                    />
                  </View>
                )}
            </View>
          </View>
        )}

        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
