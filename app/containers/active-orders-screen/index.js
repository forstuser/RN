import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';

import { Text, Button } from '../../elements';
import SingleDeliveryOrder from './single-delivery-order';
import SingleServiceRequest from './single-service-request';

class ActiveOrdersScreen extends Component {
    state = {
        activeDeliveryOrders: [
            {
                'sellerName': 'Dikshu',
                'orderId': 'OR1234567891',
                'items': 10
            },
            {
                'sellerName': 'Dikshu',
                'orderId': 'OR1234567892',
                'items': 1
            },
            {
                'sellerName': 'Dikshu',
                'orderId': 'OR1234567893',
                'items': 5
            }
        ],
        activeAssistedServicesRequest: [
            {
                'type': 'Car Cleaner'
            },
            {
                'type': 'Car Cleaner'
            },
            {
                'type': 'Car Cleaner'
            }
        ]
    }

    render() {
        const { activeDeliveryOrders, activeAssistedServicesRequest } = this.state;
        let activeOrders = null;
        let deliveryOrders = null;
        let assistedServicesRequest = null;
        if(activeDeliveryOrders.length > 0) {
            deliveryOrders = <View>
                <Text weight='Medium' style={{ fontSize: 18 }}>Delivery Orders</Text>
                {activeDeliveryOrders.map((order, index) => <SingleDeliveryOrder key={order.orderId} order={order} />)}
            </View>;
        }
        if(activeAssistedServicesRequest.length > 0) {
            assistedServicesRequest = <View style={{ marginTop: 10 }}>
                <Text weight='Medium' style={{ fontSize: 18 }}>Assisted Services Request</Text>
                {activeAssistedServicesRequest.map((serviceRequest, index) => <SingleServiceRequest key={index} serviceRequest={serviceRequest} />)}
            </View>;
        }
        if(activeDeliveryOrders.length === 0 && activeAssistedServicesRequest.length === 0) {
            activeOrders = <View
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
                    <Text weight="Bold" style={{ fontSize: 18, color: "#c2c2c2", marginTop: 10 }}>
                    You don't have any orders right now
                    </Text>
                    <Button
                        style={{ height: 40, width: 150, marginTop: 30 }}
                        text='SHOP NOW' 
                        onPress={() => alert('Shop Now')}
                        color='secondary'
                        textStyle={{ fontSize: 16 }}
                    />
            </View>;
        } else {
            activeOrders = <ScrollView style={{ flex: 1, padding: 10 }}>
                {deliveryOrders}
                {assistedServicesRequest}
            </ScrollView>;
        }
        return (
            <View style={{ flex: 1 }}>
                {activeOrders}
            </View>
        );
    }
}

export default ActiveOrdersScreen;