import React from "react";
import { View, TouchableOpacity, FlatList, Image } from "react-native";

import { getCompletedOrders } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles } from "../../theme";
import { SCREENS } from "../../constants";
import SingleOrder from "./single-order";

export default class OrdersList extends React.Component {
  static navigationOptions = {
    title: "My Orders"
  };

  state = {
    isLoading: false,
    error: null,
    orders: []
  };

  componentDidMount() {
    this.loadOrders();
  }

  loadOrders = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const res = await getCompletedOrders();
      this.setState({ orders: res.result, isLoading: false });
      console.log("Get Completed Orders: ", res.result);
      //console.log('Get Completed Orders: ', res.result[0].order_details.length);
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  renderOrders = ({ item, index }) => {
    return <SingleOrder item={item} navigation={this.props.navigation} />;
  };

  openOrderScreen = order => {
    this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
      orderId: order.id
    });
  };

  render() {
    const { isLoading, error, orders } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={[
            { flexGrow: 1, backgroundColor: "#fff" },
            orders.length ? null : { justifyContent: "center" }
          ]}
          data={orders}
          refreshing={isLoading}
          onRefresh={this.loadOrders}
          keyExtractor={item => item.id}
          renderItem={this.renderOrders}
          ListEmptyComponent={() =>
            !isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff"
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "#EAF6FC"
                    }}
                  />

                  <Image
                    style={{ width: 80, height: 90, marginTop: -90 }}
                    source={require("../../images/bell.png")}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  weight="Bold"
                  style={{ fontSize: 18, color: "#c2c2c2", marginTop: 10 }}
                >
                  You have not ordered any grocery as yet
                </Text>
                <Button
                  style={{ height: 40, width: 150, marginTop: 30 }}
                  text="SHOP NOW"
                  onPress={() =>
                    this.props.navigation.navigate(
                      SCREENS.CREATE_SHOPPING_LIST_SCREEN
                    )
                  }
                  color="secondary"
                  textStyle={{ fontSize: 16 }}
                />
              </View>
            ) : null
          }
        />
      </View>

      // renderItem={({ item, index }) => (
      //   <TouchableOpacity
      //     style={{ ...defaultStyles.card, height: 80, margin: 10 }}
      //     onPress={() => this.openOrderScreen(item)}
      //   >
      //     <Text>Order Id: {item.id}</Text>
      //   </TouchableOpacity>
      // )}
    );
  }
}
