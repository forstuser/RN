import React, { Component } from "react";
import { View, Image, ScrollView, FlatList } from "react-native";

import { Text, Button } from "../../elements";
import SingleDeliveryOrder from "./single-delivery-order";
import SingleServiceRequest from "./single-service-request";
import { retrieveActiveOrders, retrieveActiveServices } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import { SCREENS } from "../../constants";
import SingleOrder from "./single-order";
import { colors } from "../../theme";

class ActiveOrdersScreen extends Component {
  state = {
    activeDeliveryOrders: [],
    activeAssistedServicesRequest: [],
    error: null,
    isFetchingData: false,
    sellerExist: false
  };

  componentDidMount() {
    this.fetchActiveOrders();
    //this.fetchActiveServices();
  }

  fetchActiveOrders = async () => {
    this.setState({
      error: null,
      isFetchingData: true
    });

    try {
      const activeOrders = await retrieveActiveOrders();
      console.log("activeOrders.result: ", activeOrders.result);
      //console.log('result[0].user.name : ', activeOrders.result[0].user.name);
      //console.log('result[0].id : ', activeOrders.result[0].id);
      //console.log('result[0].order_details.length : ', activeOrders.result[0].order_details.length);
      this.setState({
        isFetchingData: false,
        activeDeliveryOrders: activeOrders.result,
        sellerExist: activeOrders.seller_exist
      });
    } catch (error) {
      console.log("order error: ", error);
      this.setState({
        error,
        isFetchingData: false
      });
    }
  };

  // fetchActiveServices = async () => {
  //   this.setState({
  //     error: null
  //   });

  //   try {
  //     const activeServices = await retrieveActiveServices();
  //     //console.log("activeServices.result:", activeServices.result);
  //     //console.log('result[0].user.name : ', activeServices.result[0].order_details[0].service_name);
  //     //console.log('result[0].id : ', activeServices.result[0].status_type);
  //     //console.log('result[0].order_details.length : ', activeOrders.result[0].order_details.length);
  //     this.setState({
  //       isFetchingData: false,
  //       //activeAssistedServicesRequest: activeServices.result
  //     });
  //   } catch (error) {
  //     console.log("order error: ", error);
  //     this.setState({
  //       error,
  //       isFetchingData: false
  //     });
  //   }
  // };

  openOrderScreen = order => {
    this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
      orderId: order.id
    });
  };

  renderActiveOrders = ({ item, index }) => {
    return (
      <SingleOrder
        key={index}
        item={item}
        navigation={this.props.navigation}
        onPress={() => {
          this.openOrderScreen(item);
        }}
      />
    );
  };

  render() {
    const {
      activeDeliveryOrders,
      activeAssistedServicesRequest,
      sellerExist
    } = this.state;
    let activeOrders = null;
    let deliveryOrders = null;
    let assistedServicesRequest = null;
    if (activeDeliveryOrders.length > 0) {
      deliveryOrders = (
        <View>
          <FlatList
            data={this.state.activeDeliveryOrders}
            renderItem={this.renderActiveOrders}
            keyExtractor={(item, index) => item.id}
            onRefresh={this.fetchActiveOrders}
            refreshing={this.state.isFetchingData}
          />
        </View>
      );
    }
    if (activeAssistedServicesRequest.length > 0) {
      assistedServicesRequest = (
        <View style={{ marginTop: 10 }}>
          {/* <Text weight="Medium" style={{ fontSize: 18 }}>
            Assisted Services Request
          </Text> */}
          {activeAssistedServicesRequest.map((serviceRequest, index) => (
            <SingleServiceRequest key={index} serviceRequest={serviceRequest} />
          ))}
        </View>
      );
    }
    if (
      activeDeliveryOrders.length === 0 &&
      activeAssistedServicesRequest.length === 0 &&
      this.state.isFetchingData === false
    ) {
      activeOrders = (
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
          {sellerExist ? (
            <View>
              <Text
                weight="Bold"
                style={{
                  fontSize: 18,
                  color: "#c2c2c2",
                  marginTop: 10,
                  textAlign: "center",
                  padding: 15
                }}
              >
                You have not placed any recent orders
              </Text>
              <Button
                style={{ height: 40, width: 275, marginTop: 30 }}
                text="SHOP WITH YOUR SELLER"
                onPress={() =>
                  this.props.navigation.navigate(
                    SCREENS.CREATE_SHOPPING_LIST_SCREEN
                  )
                }
                color="secondary"
                textStyle={{ fontSize: 16 }}
              />
            </View>
          ) : (
            <Text
              weight="Bold"
              style={{
                fontSize: 18,
                color: "#c2c2c2",
                marginTop: 10,
                textAlign: "center",
                padding: 15
              }}
            >
              You have not placed any recent orders Please invite or simply add
              your nearby Sellers to start placing orders and to avail
              additional benefits.
            </Text>
          )}
        </View>
      );
    } else {
      activeOrders = (
        <View style={{ flex: 1, padding: 10 }}>
          {deliveryOrders}
          {assistedServicesRequest}
        </View>
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
