import React from "react";
import { View, FlatList, Alert } from "react-native";

import { Text, Image, Button } from "../../elements";
import { getOrderDetails } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

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
    if (socketIo.socket) {
      socketIo.socket.on("order-status-change", data => {
        console.log("socket order-status-change data: " + data);
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

    return (
      <View style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
        {order && (
          <FlatList
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
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#eee" }} />
            )}
            keyExtractor={(item, index) => item.id + "" + index}
            renderItem={({ item, index }) => (
              <ListItem
                item={item}
                index={index}
                declineItem={index => {
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
        )}
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
