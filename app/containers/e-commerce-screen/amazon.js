import React, { Component } from "react";
import {
  View,
  WebView,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
  Platform
} from "react-native";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";

import { API_BASE_URL } from "../../api";
import { ScreenContainer, Text, Button, Image } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";
import Modal from "react-native-modal";

class Amazon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: null,
      isModalVisible: true
    };
  }

  componentDidMount() {
    console.log(this.props.item)
  }
  showModal = () => {
    this.setState({ isModalVisible: true });
  };
  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  onWebViewMessage = event => {
    console.log("event.nativeEvent.data: ", event.nativeEvent.data);
    this.setState({
      orderId: event.nativeEvent.data
    });
  };

  onGetDataMessage = event => {
    console.log("event.nativeEvent.data2: ", JSON.parse(event.nativeEvent.data));
    this.showModal();
  };

  render() {
    const { orderId, isModalVisible } = this.state;
    let dirtyScript = ` (function(){
      var _url = window.location.href;
      var regexp =  /.*\orderId=(.*?)\&/;
      var orderArray = _url.match(regexp);
      if(orderArray){
        var orderId = orderArray[1];
        alert(orderId);
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
      var amountData = document.getElementsByClassName("a-column a-span5 a-span-last");
      var deliveryDateData = document.getElementsByClassName("a-size-base a-color-success a-text-bold");
      if(order){
        var orderDate = order[0].innerText;
        var orderId = order[1].innerText;
        var orderTotal = order[2].innerText;
        var asin = asinData[0].href;
        var paymentMode = paymentData[0].innerText;
        var deliveryDate = deliveryDateData[0].innerText;
        var deliveryAddress = deliveryData[3].innerText;
        var totalAmount = amountData[5].innerText;
        var data = {orderDate:orderDate,deliveryDate:deliveryDate,orderId:orderId,orderTotal:orderTotal,asin:asin,paymentMode:paymentMode,deliveryAddress:deliveryAddress,totalAmount:totalAmount};
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
              source={{ uri: this.props.item.url }}
              onMessage={this.onWebViewMessage}
            />
          )}
        <Modal
          style={{ margin: 0 }}
          isVisible={isModalVisible}
          useNativeDriver={true}
          onBackButtonPress={this.hideModal}
          onBackdropPress={this.hideModal}
        >
          <View style={{ backgroundColor: '#fff', padding: 20 }}><Text>Hello</Text></View>
        </Modal>
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
    // flex: 1
    // marginTop: Platform.OS === "ios" ? 20 : 0
  }
});

export default Amazon;
