import React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";

import { getCompletedOrders } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles } from "../../theme";
import { SCREENS } from "../../constants";
import SingleOrder from './single-order';

export default class OrdersList extends React.Component {
  static navigationOptions = {
    title: "My Orders"
  };

  state = {
    isLoading: true,
    error: null,
    orders: []
  };

  componentDidMount() {
    this.loadOrders();
  }

  loadOrders = async () => {
    try {
      const res = await getCompletedOrders();
      this.setState({ orders: res.result });
      console.log('Get Completed Orders: ', res.result);
      //console.log('Get Completed Orders: ', res.result[0].order_details.length);
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  renderOrders = ({ item, index }) => {
    return <SingleOrder
      item={item}
      navigation={this.props.navigation}
    />
  openOrderScreen = order => {
    this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
      orderId: order.id
    });
  };

  render() {
    const { isLoading, error, orders } = this.state;
    return (
      <FlatList
        data={orders}
        refreshing={isLoading}
        onRefresh={this.loadOrders}
        keyExtractor={item => item.id}
        renderItem={this.renderOrders}
        // renderItem={({ item, index }) => (
        //   <TouchableOpacity
        //     style={{ ...defaultStyles.card, height: 80, margin: 10 }}
        //     onPress={() => this.openOrderScreen(item)}
        //   >
        //     <Text>Order Id: {item.id}</Text>
        //   </TouchableOpacity>
        // )}
      />
    );
  }
}
