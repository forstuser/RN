import React, { Component } from "react";
import { View, Image, ScrollView } from "react-native";

import { Text, Button } from "../../elements";
import SingleDeliveryOrder from "./single-delivery-order";
import SingleServiceRequest from "./single-service-request";
import { retrieveActiveOrders, retrieveActiveServices } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import { SCREENS } from "../../constants";

class ActiveOrdersScreen extends Component {
  state = {
    activeDeliveryOrders: [],
    activeAssistedServicesRequest: [
      {
        type: "Car Cleaner"
      },
      {
        type: "Car Cleaner"
      },
      {
        type: "Car Cleaner"
      }
    ]
  };

  componentDidMount() {
    this.fetchActiveOrders();
    this.fetchActiveServices();
  }

  fetchActiveOrders = async () => {
    this.setState({
      error: null
    });

    try {
      const activeOrders = await retrieveActiveOrders();
      console.log("activeOrders.result:", activeOrders.result);
      //console.log('result[0].user.name : ', activeOrders.result[0].user.name);
      //console.log('result[0].id : ', activeOrders.result[0].id);
      //console.log('result[0].order_details.length : ', activeOrders.result[0].order_details.length);
      this.setState({
        isFetchingData: false,
        activeDeliveryOrders: activeOrders.result
      });
    } catch (error) {
      console.log("order error: ", error);
      this.setState({
        error,
        isFetchingData: false
      });
    }
  };

  fetchActiveServices = async () => {
    this.setState({
      error: null
    });

    try {
      const activeServices = await retrieveActiveServices();
      console.log("activeServices.result:", activeServices.result);
      //console.log('result[0].user.name : ', activeOrders.result[0].user.name);
      //console.log('result[0].id : ', activeOrders.result[0].id);
      //console.log('result[0].order_details.length : ', activeOrders.result[0].order_details.length);
      this.setState({
        isFetchingData: false
        //activeDeliveryOrders: activeOrders.result
      });
    } catch (error) {
      console.log("order error: ", error);
      this.setState({
        error,
        isFetchingData: false
      });
    }
  };

  openOrderScreen = order => {
    this.props.navigation.navigate(SCREENS.SHOPPING_LIST_ORDER_SCREEN, {
      orderId: order.id
    });
  };

  render() {
    const { activeDeliveryOrders, activeAssistedServicesRequest } = this.state;
    let activeOrders = null;
    let deliveryOrders = null;
    let assistedServicesRequest = null;
    if (activeDeliveryOrders.length > 0) {
      deliveryOrders = (
        <View>
          <Text weight="Medium" style={{ fontSize: 18 }}>
            Delivery Orders
          </Text>
          {activeDeliveryOrders.map((order, index) => (
            <SingleDeliveryOrder
              key={index}
              order={order}
              onPress={() => {
                this.openOrderScreen(order);
              }}
            />
          ))}
        </View>
      );
    }
    if (activeAssistedServicesRequest.length > 0) {
      assistedServicesRequest = (
        <View style={{ marginTop: 10 }}>
          <Text weight="Medium" style={{ fontSize: 18 }}>
            Assisted Services Request
          </Text>
          {activeAssistedServicesRequest.map((serviceRequest, index) => (
            <SingleServiceRequest key={index} serviceRequest={serviceRequest} />
          ))}
        </View>
      );
    }
    if (
      activeDeliveryOrders.length === 0 &&
      activeAssistedServicesRequest.length === 0
    ) {
      activeOrders = (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
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
            You don't have any orders right now
          </Text>
          <Button
            style={{ height: 40, width: 150, marginTop: 30 }}
            text="SHOP NOW"
            onPress={() => alert("Shop Now")}
            color="secondary"
            textStyle={{ fontSize: 16 }}
          />
        </View>
      );
    } else {
      activeOrders = (
        <ScrollView style={{ flex: 1, padding: 10 }}>
          {deliveryOrders}
          {assistedServicesRequest}
        </ScrollView>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        {activeOrders}
        <LoadingOverlay visible={this.state.isFetchingData} />
      </View>
    );
  }
}

export default ActiveOrdersScreen;
