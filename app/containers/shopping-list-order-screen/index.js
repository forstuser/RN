import React from "react";
import { View, FlatList } from "react-native";

import { Text, Image, Button } from "../../elements";
import { getOrderDetails } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

import Status from "./status";
import SellerDetails from "./seller-details";
import ListItem from "./list-item";

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

    return (
      <View style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
        {order && (
          <FlatList
            ListHeaderComponent={() => (
              <View
                style={{ borderBottomColor: "#dadada", borderBottomWidth: 1 }}
              >
                <Status />
                <SellerDetails seller={order.seller} />
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
            renderItem={ListItem}
          />
        )}
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
