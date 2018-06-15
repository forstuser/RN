import React, { Component } from "react";
import {
  View,
  WebView,
  StyleSheet
} from "react-native";

import { API_BASE_URL } from "../../api";
import { ScreenContainer, Text, Button, Image } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";
import Modal from "react-native-modal";
import KeyValueItem from "../../components/key-value-item";

class Amazon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: null,
      isModalVisible: false,
      scrapObjectArray: []
    }
  }

  componentDidMount() {
    console.log(this.props)
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
    const dirtyObjectArray = JSON.parse(event.nativeEvent.data);
    console.log(dirtyObjectArray)
    var cleanObjectArray = [
      { key: 'Order ID', value: dirtyObjectArray[0].orderId },
      { key: 'Order Date', value: dirtyObjectArray[1].orderDate },
      { key: 'Total Amount', value: dirtyObjectArray[2].orderTotal },
      { key: 'Payment Mode', value: dirtyObjectArray[3].paymentMode },
      { key: 'Delivery Date', value: dirtyObjectArray[4].deliveryDate },
      { key: 'Delivery Address', value: dirtyObjectArray[5].deliveryAddress }
      // { key: 'asin', value: dirtyObjectArray[6].asin },
    ];
    console.log(cleanObjectArray);
    this.setState({
      scrapObjectArray: cleanObjectArray
    })

    this.showModal();
  };
  exploreMoreDetails = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { orderId, isModalVisible, scrapObjectArray } = this.state;
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
        var asin = asinData[0].href;
        var paymentMode = paymentData[0].innerText;
        var deliveryDate = deliveryDateData[0].innerText;
        var deliveryAddress = deliveryData[3].innerText;
        var data = [{orderId:orderId},{orderDate:orderDate},{orderTotal:orderTotal},{paymentMode:paymentMode},{deliveryDate:deliveryDate},{deliveryAddress:deliveryAddress},{asin:asin}];
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
              source={{ uri: item.url }}
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
          <View style={{ backgroundColor: '#fff', padding: 20 }}>
            <Text style={{ color: colors.tomato, fontWeight: 'bold', fontSize: 18 }} >Order Successful!</Text>
            <View style={styles.imageContainer}>
              <Image
                style={{ width: 50, height: 50, flex: 1 }}
                source={{ uri: item.image }}
              />
              <Text numberOfLines={2} style={{ flex: 2, fontWeight: 'bold' }}>{item.name}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              {scrapObjectArray.map((item) => {
                return (<KeyValueItem
                  keyText={item.key}
                  valueText={item.value}
                />)
              })}
            </View>
            <Button
              onPress={this.exploreMoreDetails}
              text={"Explore More Details"}
              color="secondary"
              borderRadius={30}
              style={styles.exploreButton}
            />
          </View>
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
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: 25
  },
  exploreButton: {
    width: "100%"
  },
});

export default Amazon;
