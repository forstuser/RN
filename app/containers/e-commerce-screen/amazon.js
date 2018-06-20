import React, { Component } from "react";
import { View, WebView, StyleSheet } from "react-native";

import { API_BASE_URL } from "../../api";
import { ScreenContainer, Text, Button, Image } from "../../elements";
import { colors } from "../../theme";

class Amazon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: null
    };
  }

  componentDidMount() {
    // console.log("props", this.props)
  }

  onWebViewMessage = event => {
    console.log("event.nativeEvent.data: ", event.nativeEvent.data);
    this.setState({
      orderId: event.nativeEvent.data
    });
  };

  onGetDataMessage = event => {
    const orderData = JSON.parse(event.nativeEvent.data);
    this.props.successOrder(orderData);
  };

  render() {
    const { orderId } = this.state;
    const { item } = this.props;
    let dirtyScript = ` (function(){
      var _url = window.location.href;
      var regexp =  /.*\orderId=(.*?)\&/;
      var orderArray = _url.match(regexp);
      if(orderArray){
        var orderId = orderArray[1];
        setTimeout(function() {
          window.postMessage(orderId,'*');
        }, 500);
      }
    })()`;
    let scrapData = `
    (function(){
      var order = document.getElementsByClassName("a-column a-span8 a-span-last");
      var asinData = document.getElementsByClassName("a-link-normal a-padding-none a-color-base");
      var paymentData = document.getElementsByClassName("a-size-base a-color-base no-margin");
      var deliveryData = document.getElementsByClassName("a-section a-padding-medium");
      var deliveryDateData = document.getElementsByClassName("a-size-base a-color-success a-text-bold");
      if(order){
        var orderDate = order[0].innerText;
        var orderId = order[1].innerText;
        var orderTotal = order[2].innerText;
        var paymentMode = paymentData[0].innerText;
        var deliveryDate = deliveryDateData[0].innerText;
        var deliveryAddress = deliveryData[3].innerText;
        var data = {orderId:orderId,orderDate:orderDate,orderTotal:orderTotal,paymentMode:paymentMode,deliveryDate:deliveryDate,deliveryAddress:deliveryAddress};
        if(data){
            data = JSON.stringify(data);
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
              uri: `https://www.amazon.in/gp/aw/ya/ref=typ_rev_edit?ie=UTF8&ac=os&oid=${orderId}`
            }}
            onMessage={this.onGetDataMessage}
          />
        ) : (
          <WebView
            injectedJavaScript={dirtyScript}
            scrollEnabled={false}
            source={{ uri: item.url.replace("http://", "https://") }}
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

export default Amazon;
