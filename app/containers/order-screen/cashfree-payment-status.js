import React, { Component } from "react";
import { View, WebView } from "react-native";
import { Text, Button, Image } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import SuccessImage from "../../images/status_success.png";
import FailedImage from "../../images/status_cancel.png";
import PendingImage from "../../images/status_pending.png";
import CashFreeForm from "./cashfree-form.html";

import {
  completeOrder,
  getGeneratedSignature,
  getTransactionStatus
} from "../../api";
import { SCREENS } from "../../constants";

let webViewLoadCount = 1;

class CashFreePaymentStatusScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    showWebView: true,
    orderIdWebView: "",
    orderAmountWebView: "",
    transactionStatus: null
  };

  //function called when payment to be done online
  payOnline = async () => {
    const order = this.props.navigation.getParam("order", null);
    try {
      const res = await completeOrder({
        orderId: order.id,
        sellerId: order.seller_id,
        payment_mode: 4
      });
    } catch (e) {
      console.log(e.message);
    } finally {
      console.log("final");
    }
  };

  //Function called when webview loads
  onLoadWebView = async () => {
    const order = this.props.navigation.getParam("order", null);
    const user = this.props.navigation.getParam("user", null);
    if (webViewLoadCount === 1) {
      console.log("ON LOAD WEB VIEW");
      let totalAmount = 0;
      if (order) {
        totalAmount = order.order_details.reduce((total, item) => {
          return item.selling_price
            ? total + Number(item.selling_price)
            : total;
        }, 0);
      }

      const postData = {
        appId: "1844ecd62445987b8152c2304481",
        orderId: (order.id || "").toString(),
        orderAmount: (totalAmount || 0).toString(),
        orderCurrency: "INR",
        orderNote: "test",
        customerName: (user.name || "").toString(),
        customerEmail: (user.email || "dikshant@binbill.com").toString(),
        customerPhone: (user.phone || "").toString()
      };

      console.log("postData===============", postData);

      const res = await getGeneratedSignature(postData);

      console.log("res.result.postData==================", res.result);

      this.setState({
        orderIdWebView: res.result.orderId,
        orderAmountWebView: res.result.orderAmount
      });

      let new_appId = res.result.appId;
      let new_orderId = res.result.orderId;
      let new_orderAmount = res.result.orderAmount;
      let new_orderCurrency = res.result.orderCurrency;
      let new_orderNote = res.result.orderNote;
      let new_customerName = res.result.customerName;
      let new_customerEmail = res.result.customerEmail;
      let new_customerPhone = res.result.customerPhone;
      let new_returnUrl = res.result.returnUrl;
      let new_notifyUrl = res.result.notifyUrl;
      let new_signature = res.result.signature;

      this.sendData.postMessage(
        new_appId +
          "," +
          new_orderId +
          "," +
          new_orderAmount +
          "," +
          new_orderCurrency +
          "," +
          new_orderNote +
          "," +
          new_customerName +
          "," +
          new_customerEmail +
          "," +
          new_customerPhone +
          "," +
          new_returnUrl +
          "," +
          new_notifyUrl +
          "," +
          new_signature
      );
    }
    webViewLoadCount = webViewLoadCount + 1;
  };

  // //called when webview load succeeds or fails
  // onLoadEndWebView = async () => {
  //   const { orderIdWebView } = this.state;
  //   //console.log("orderIDWebView----------", orderIdWebView);
  //   const res = await getTransactionStatus(orderIdWebView);
  //   this.setState({ transactionStatus: res });
  //   if (res && res.status_type) {
  //     //console.log("RESPONSE____________", res.status);
  //     if (res.status_type == 16) {
  //       this.payOnline();
  //       this.setState({ showWebView: false });
  //     } else if (
  //       res.status_type == 18 ||
  //       res.status_type == 13 ||
  //       res.status_type == 17 ||
  //       res.status_type == 8 ||
  //       res.status_type == 9
  //     ) {
  //       this.setState({ showWebView: false });
  //     } else {
  //       console.log("Status 4");
  //     }
  //   }
  // };

  onNavStateChange = async webViewState => {
    //console.log("webViewState.url________________", webViewState.url);
    if (
      webViewState.url == "https://consumer-stage.binbill.com/consumer/payments"
    ) {
      const { orderIdWebView } = this.state;
      //console.log("orderIDWebView----------", orderIdWebView);
      const res = await getTransactionStatus(orderIdWebView);
      this.setState({ transactionStatus: res });
      if (res && res.status_type) {
        //console.log("RESPONSE____________", res.status);
        if (res.status_type == 16) {
          this.payOnline();
          this.setState({ showWebView: false });
        } else if (
          res.status_type == 18 ||
          res.status_type == 13 ||
          res.status_type == 17 ||
          res.status_type == 8 ||
          res.status_type == 9
        ) {
          this.setState({ showWebView: false });
        } else {
          console.log("Status 4");
        }
      }
    }
  };

  //Rendering the web view for the payment gateway
  renderWebView = () => {
    console.log("Render Web View");
    webViewLoadCount = 1;
    return (
      <WebView
        originWhitelist={["*"]}
        source={CashFreeForm}
        style={{
          width: "100%",
          height: "100%"
        }}
        ref={ref => (this.sendData = ref)}
        onLoad={this.onLoadWebView}
        onLoadEnd={this.onLoadEndWebView}
        javaScriptEnabled={true}
        onNavigationStateChange={this.onNavStateChange.bind(this)}
      />
    );
  };

  retryPressFail = () => {
    this.setState({ showWebView: true });
  };

  retryPressPending = async () => {
    const { orderIdWebView } = this.state;
    const res = await getTransactionStatus(orderIdWebView);
    this.setState({ transactionStatus: res });
    if (res && res.status_type) {
      if (res.status_type == 16) {
        this.payOnline();
      }
    }
  };

  render() {
    const order = this.props.navigation.getParam("order", null);
    let statusMessage = null;
    let imageSource = null;
    let paymentMessage = null;
    const { transactionStatus, showWebView, orderAmountWebView } = this.state;
    if (transactionStatus && transactionStatus.status_type == 16) {
      statusMessage = "Payment Received Successfully";
      imageSource = SuccessImage;
      paymentMessage =
        "Your payment of Rs. " + orderAmountWebView + " was successful";
    } else if (
      (transactionStatus && transactionStatus.status_type == 18) ||
      (transactionStatus && transactionStatus.status_type == 9)
    ) {
      statusMessage = "Payment Failed";
      imageSource = FailedImage;
      paymentMessage =
        "Your transaction of Rs. " + orderAmountWebView + " was failed";
    } else if (
      (transactionStatus && transactionStatus.status_type == 13) ||
      (transactionStatus && transactionStatus.status_type == 8)
    ) {
      statusMessage = "Payment Pending";
      imageSource = PendingImage;
      paymentMessage =
        "Your transaction of Rs. " + orderAmountWebView + " was pending";
    } else if (transactionStatus && transactionStatus.status_type == 17) {
      statusMessage = "Payment Cancelled";
      imageSource = PendingImage;
      paymentMessage =
        "Your transaction of Rs. " + orderAmountWebView + " was cancelled";
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {showWebView && this.renderWebView()}
        {!showWebView ? (
          <View
            style={{
              flex: 1,
              backgroundColor: "#48c4e9",
              alignItems: "center"
            }}
          >
            <View
              style={{
                marginTop: 100,
                flex: 1,
                alignItems: "center"
              }}
            >
              <View
                style={{
                  height: 140,
                  width: 140,
                  borderRadius: 70,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={imageSource}
                  resizeMode="contain"
                  style={{ height: 100, width: 100, padding: 20 }}
                />
              </View>
              <Text
                weight="Bold"
                style={{
                  color: "#fff",
                  fontSize: 22,
                  marginTop: 15,
                  textAlign: "center"
                }}
              >
                {statusMessage}
              </Text>
              <Text
                weight="Medium"
                style={{
                  color: "#fff",
                  fontSize: 16,
                  marginTop: 20,
                  textAlign: "center"
                }}
              >
                {paymentMessage}
              </Text>
              {transactionStatus && transactionStatus.status_type == 16 ? (
                <View style={{ flexDirection: "row", marginTop: 35 }}>
                  <Button
                    onPress={() =>
                      this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
                        orderId: order.id
                      })
                    }
                    text="Back"
                    color="secondary"
                    style={{
                      height: 50,
                      width: 150
                    }}
                  />
                </View>
              ) : null}
              {(transactionStatus && transactionStatus.status_type == 18) ||
              (transactionStatus && transactionStatus.status_type == 9) ||
              (transactionStatus && transactionStatus.status_type == 13) ||
              (transactionStatus && transactionStatus.status_type == 8) ||
              (transactionStatus && transactionStatus.status_type == 17) ? (
                <View style={{ flexDirection: "row", marginTop: 35 }}>
                  <Button
                    onPress={() =>
                      this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
                        orderId: order.id
                      })
                    }
                    text="Back"
                    color="grey"
                    style={{ height: 50, width: 100 }}
                  />
                  <Button
                    onPress={
                      transactionStatus.status_type == 18 ||
                      transactionStatus.status_type == 9 ||
                      transactionStatus.status_type == 17
                        ? this.retryPressFail
                        : transactionStatus.status_type == 13 ||
                          transactionStatus.status_type == 8
                          ? this.retryPressPending
                          : null
                    }
                    text="Retry"
                    color="secondary"
                    style={{
                      height: 50,
                      width: 100,
                      marginLeft: 10
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

export default CashFreePaymentStatusScreen;
