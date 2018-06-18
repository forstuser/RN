import React, { Component } from "react";
import {
    View,
    WebView,
    StyleSheet
} from "react-native";

import { API_BASE_URL } from "../../api";
import { ScreenContainer, Text, Button, Image } from "../../elements";
import { colors } from "../../theme";


class Flipkart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: ''
        }
    }

    componentDidMount() {
        console.log("props", this.props)
    }


    onWebViewMessage = event => {
        console.log("event.nativeEvent.data: ", event.nativeEvent.data);
        this.setState({
            orderId: event.nativeEvent.data
        });
    };

    onGetDataMessage = event => {
        console.log("data aaya", event.nativeEvent.data);
        if (event.nativeEvent.data != this.state.orderId) {
            const dirtyObjectArray = JSON.parse(event.nativeEvent.data);
            console.log('dirtyObjectArray: ', dirtyObjectArray);
            var cleanObjectArray = [
                { key: 'Order ID', value: dirtyObjectArray[0].orderId },
                { key: 'Order Date', value: dirtyObjectArray[1].orderDate },
                { key: 'Total Amount', value: dirtyObjectArray[2].orderTotal },
                { key: 'Payment Mode', value: dirtyObjectArray[3].paymentMode },
                { key: 'Delivery Date', value: dirtyObjectArray[4].deliveryDate },
                { key: 'Delivery Address', value: dirtyObjectArray[5].deliveryAddress }
            ];
            console.log(this.cleanObjectArray);
            this.props.successOrder(cleanObjectArray);
        }

    };


    render() {
        const { orderId } = this.state;
        const { item } = this.props;
        let dirtyScript = ` (function(){
            var _url = window.location.href;
            var regexp =  /.*\id=(.*?)\&src=/;
            var orderArray = _url.match(regexp);
            if(orderArray){
              var orderId = orderArray[1] + '00';
              setTimeout(function() {
                window.postMessage(orderId,'*');
              }, 500);
            }
          })()`;
        let scrapData = `
          (function(){
            var order = document.getElementsByClassName("_186Y-h");
            var order_id = document.getElementsByClassName("_3g677S _2ZxdUc");
            var price = document.getElementsByClassName("_2Iqb-E");
            var paymentData = document.getElementsByClassName("_1IyHiW _2ZxdUc");
            var deliveryData = document.getElementsByClassName("_1DcR8Z");
            if(order){
              var orderDate = order[0].innerText;
              var orderId = order_id[0].innerText;
              var orderTotal = price[0].innerText;
              var paymentMode = paymentData[0].innerText;
              var deliveryDate = order[3].innerText;
              var deliveryAddress = deliveryData[0].innerText;
              var data = [{orderId:orderId},{orderDate:orderDate},{orderTotal:orderTotal},{paymentMode:paymentMode},{deliveryDate:deliveryDate},{deliveryAddress:deliveryAddress}];
              if(data){
                  data = JSON.stringify(data);
                  console.log("data",data);
                  setTimeout(function() {
                  window.postMessage(data,'*');
                }, 500);
              }
            }
          })()`;

        return (
            <ScreenContainer style={styles.container}>
                {orderId ? (
                    <WebView
                        injectedJavaScript={scrapData}
                        scrollEnabled={false}
                        source={{
                            uri: `https://www.flipkart.com/rv/orderDetails?order_id=${orderId}`
                        }}
                        onMessage={this.onGetDataMessage}
                    />
                ) : (
                        <WebView
                            injectedJavaScript={dirtyScript}
                            scrollEnabled={false}
                            source={{ uri: item.url }}
                            onMessage={this.onWebViewMessage}
                        />
                    )}
            </ScreenContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 0
    },
    WebViewStyle: {
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Flipkart;
