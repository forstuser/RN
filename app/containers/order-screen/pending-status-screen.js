import React, { Component } from "react";
import { View, WebView, BackHandler } from "react-native";
import { Text, Button, Image } from "../../elements";
import SuccessImage from "../../images/status_success.png";
import FailedImage from "../../images/status_cancel.png";
import PendingImage from "../../images/status_pending.png";
import LoadingOverlay from "../../components/loading-overlay";
import {
  API_BASE_URL,
  CASHFREE_APP_ID,
  completeOrder,
  getGeneratedSignature,
  getTransactionStatus
} from "../../api";
import { SCREENS } from "../../constants";

class PendingPaymentStatusScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    isLoading: false,
    orderIdWebView: "",
    orderAmountWebView: "",
    transactionStatus: null,
    order: null,
    transactionStatusFromOrder: 0
  };

  componentWillMount() {
    const transactionStatusFromOrder = this.props.navigation.getParam(
      "transactionStatus",
      null
    );
    this.setState({ transactionStatusFromOrder });
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }
  componentWillUnmount() {
    // alert("cashfree screen");
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  handleBackPress = async () => {
    const order = this.props.navigation.getParam("order", null);
    const { transactionStatus } = this.state;
    const orderIdWebView = this.props.navigation.getParam("orderId", null);

    if (transactionStatus && transactionStatus.status_type != 16) {
      const res = await getTransactionStatus(orderIdWebView);
      order["expense_id"] = res.expense_id || null;
      this.setState({
        transactionStatus: res || null,
        showWebView: false,
        order: order
      });
    }

    this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
      orderId: order.id
    });
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

  retryPressFail = () => {
    const order = this.props.navigation.getParam("order", null);
    const user = this.props.navigation.getParam("user", null);
    this.props.navigation.navigate(SCREENS.CASHFREE_PAYMENT_STATUS_SCREEN, {
      order: order,
      user: user
    });
  };

  retryPressPending = async () => {
    this.setState({ isLoading: true });
    const order = this.props.navigation.getParam("order", null);
    const orderIdWebView = this.props.navigation.getParam("orderId", null);
    try {
      const res = await getTransactionStatus(orderIdWebView);
      order["expense_id"] = res.expense_id || null;
      this.setState({
        transactionStatus: res,
        order: order,
        transactionStatusFromOrder: 0
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
    // if (res && res.status_type) {
    //   if (res.status_type == 16) {
    //     // this.payOnline();
    //   }
    // }
  };

  render() {
    const order = this.props.navigation.getParam("order", null);
    const orderAmountWebView = this.props.navigation.getParam(
      "orderAmount",
      null
    );
    let statusMessage = null;
    let imageSource = null;
    let paymentMessage = null;
    const {
      transactionStatus,
      transactionStatusFromOrder,
      isLoading
    } = this.state;
    if (transactionStatus && transactionStatus.status_type == 16) {
      statusMessage = "Payment Received Successfully";
      imageSource = SuccessImage;
      paymentMessage =
        "Your payment of Rs. " + orderAmountWebView + " was successful";
    } else if (
      (transactionStatus && transactionStatus.status_type == 18) ||
      (transactionStatus && transactionStatus.status_type == 4) ||
      (transactionStatus && transactionStatus.status_type == 9) ||
      (transactionStatusFromOrder && transactionStatusFromOrder == 4)
    ) {
      statusMessage = "Payment Failed";
      imageSource = FailedImage;
      paymentMessage =
        "Your transaction of Rs. " + orderAmountWebView + " was failed";
    } else if (
      (transactionStatus && transactionStatus.status_type == 13) ||
      (transactionStatus && transactionStatus.status_type == 8) ||
      (transactionStatusFromOrder && transactionStatusFromOrder == 13)
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
                    // this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
                    //   orderId: order.id
                    // })
                    this.props.navigation.navigate(
                      SCREENS.DIGITAL_BILL_SCREEN,
                      {
                        order: this.state.order,
                        fromOrderFlowScreen: true
                      }
                    )
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
            (transactionStatus && transactionStatus.status_type == 4) ||
            (transactionStatus && transactionStatus.status_type == 8) ||
            (transactionStatus && transactionStatus.status_type == 17) ||
            (transactionStatusFromOrder && transactionStatusFromOrder == 13) ||
            (transactionStatusFromOrder && transactionStatusFromOrder == 4) ? (
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
                    (transactionStatus &&
                      transactionStatus.status_type == 18) ||
                    (transactionStatus && transactionStatus.status_type == 9) ||
                    (transactionStatus &&
                      transactionStatus.status_type == 17) ||
                    (transactionStatus && transactionStatus.status_type == 4) ||
                    (transactionStatusFromOrder &&
                      transactionStatusFromOrder == 4)
                      ? this.retryPressFail
                      : (transactionStatus &&
                          transactionStatus.status_type == 13) ||
                        (transactionStatus &&
                          transactionStatus.status_type == 8) ||
                        (transactionStatusFromOrder &&
                          transactionStatusFromOrder == 13)
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
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}

export default PendingPaymentStatusScreen;
