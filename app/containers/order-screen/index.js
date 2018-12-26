import React from "react";
import {
  View,
  FlatList,
  Alert,
  Animated,
  TouchableOpacity,
  BackHandler,
  WebView,
  TextInput,
  Dimensions,
  AsyncStorage
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import Analytics from "../../analytics";
import ActionSheet from "react-native-actionsheet";
import { Text, Image, Button } from "../../elements";
import CashFreeForm from "./cashfree-form.html";

import {
  API_BASE_URL,
  deleteItemShoppingList,
  getOrderDetails,
  approveOrder,
  cancelOrder,
  rejectOrder,
  completeOrder,
  approveAssistedServiceOrder,
  startAssistedServiceOrder,
  endAssistedServiceOrder,
  updateProduct,
  getGeneratedSignature,
  getTransactionStatus
} from "../../api";

import LoadingOverlay from "../../components/loading-overlay";
import KeyValueItem from "../../components/key-value-item";
import ErrorOverlay from "../../components/error-overlay";
import { showSnackbar } from "../../utils/snackbar";

import {
  ORDER_STATUS_TYPES,
  SCREENS,
  ORDER_TYPES,
  SERVICE_PRICE_TYPES,
  LOCATIONS,
  PAYMENT_MODES
} from "../../constants";

import Status from "./status";
import SellerDetails from "./seller-details";
import ShoppingListItem from "./shopping-list-item";
import AssistedServiceListItem from "./assisted-service-list-item";
import DeliveryUserDetails from "./delivery-user-details";
import ServicePriceBreakdownModal from "./service-price-breakdown";

import socketIo from "../../socket-io";

import UploadBillModal from "./upload-bill-modal";
import ReviewCard from "./review-card";
import Modal1 from "../../components/modal";
import Modal from "react-native-modal";
import HeaderBackBtn from "../../components/header-nav-back-btn";
import RadioBox from "../../components/radiobox";
import { colors } from "../../theme";

let deviceWidth = Dimensions.get("window").width;
//let webViewLoadCount = 1;

class OrderScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: "Order Details",
      headerLeft: <HeaderBackBtn onPress={params.onBackPress} />
    };
  };

  state = {
    isLoading: true,
    error: null,
    order: null,
    isVisible: false,
    cancelOrderFlag: false,
    rejectOrderFlag: false,
    declineOrderFlag: false,
    title: "",
    headerText: "",
    showWebView: false,
    generatedSignature: "",
    isCancelOrderModal: false,
    cancelReasons: [],
    selectedReason: [],
    showTextInput: false,
    writtenReason: "",
    showSellerDiscount: true,
    isDeletingItems: false,
    deleteOrderId: 0,
    deleteItemId: 0,
    deleteSellerId: 0
    //orderIdWebView: "",
    //orderAmountWebView: ""
  };

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  async componentDidMount() {
    let reasons = await AsyncStorage.getItem("cancelReasons");
    reasons = JSON.parse(reasons);
    console.log("Cancel reasons in order screen_____________", reasons);
    this.setState({ cancelReasons: reasons });
    // const reasons = this.props.navigation.getParam("cancelReasons", []);
    // this.setState({ cancelReasons: reasons });
    this.getOrderDetails(this.props);
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.getOrderDetails(this.props);
      }
    );

    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });

    if (socketIo.socket) {
      socketIo.socket.on("order-status-change", data => {
        const jsonData = JSON.parse(data);
        console.log("jsonData: ", jsonData);
        if (this.state.order && jsonData.order.id == this.state.order.id) {
          this.setState({ order: jsonData.order });
        }
      });

      socketIo.socket.on("assisted-status-change", data => {
        const jsonData = JSON.parse(data);
        console.log("jsonData: ", jsonData);
        if (this.state.order && jsonData.order.id == this.state.order.id) {
          this.setState({ order: jsonData.order });
        }
      });

      socketIo.socket.on("reconnect", () => {
        this.getOrderDetails(this.props);
      });
    }

    // this.uploadBillModal.show({ productId: 50897, jobId: 52334 });
  }

  // will fire on clicking on notification
  componentWillReceiveProps(nextProps) {
    this.getOrderDetails(nextProps);
  }

  componentWillUnmount() {
    // alert("index screen");
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    this.didFocusSubscription.remove();

    if (socketIo.socket) {
      socketIo.socket.off("order-status-change");
      socketIo.socket.off("assisted-status-change");
      socketIo.socket.off("reconnect");
    }
  }

  onBackPress = () => {
    console.log("status from hardware backpress", this.state.order.status_type);
    if (
      this.state.order.status_type == ORDER_STATUS_TYPES.COMPLETE ||
      this.state.order.status_type == ORDER_STATUS_TYPES.CANCELED ||
      this.state.order.status_type == ORDER_STATUS_TYPES.REJECTED ||
      this.state.order.status_type == ORDER_STATUS_TYPES.EXPIRED
    ) {
      this.props.navigation.navigate(SCREENS.MY_ORDERS_SCREEN);
      return true;
    } else {
      this.props.navigation.navigate(SCREENS.DASHBOARD_SCREEN);
      return true;
    }
  };

  show = item => {
    this.setState({ isVisible: true });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  getOrderDetails = async props => {
    const { navigation } = props;
    const orderId = navigation.getParam("orderId", null);
    console.log("orderid", orderId);
    this.setState({ isLoading: true, error: null });
    try {
      const res = await getOrderDetails({ orderId });
      console.log("final order", res);
      this.setState({ order: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
      if (this.state.error != null) {
        const res = await getOrderDetails({ orderId });
        this.setState({ order: res.result });
      }
      this.setState({ isLoading: false });
    }
  };

  openReviewsScreen = () => {
    const { order } = this.state;

    let sellerRatings = 0;
    let sellerReviewText = "";
    let serviceRatings = 0;
    let serviceReviewText = "";

    if (order && order.seller_review) {
      sellerRatings = order.seller_review.review_ratings;
      sellerReviewText = order.seller_review.review_feedback;
    }

    if (
      order &&
      order.delivery_user &&
      order.delivery_user.reviews &&
      order.delivery_user.reviews.length > 0
    ) {
      const serviceReview = order.delivery_user.reviews.find(
        userReview => userReview.order_id == order.id
      );

      if (serviceReview) {
        serviceRatings = serviceReview.ratings;
        serviceReviewText = serviceReview.feedback;
      }
    }

    if (order.delivery_user_id == null || order.delivery_user_id == "null") {
      this.props.navigation.navigate(SCREENS.SELLER_REVIEW_SCREEN, {
        order: order,
        sellerRatings,
        sellerReviewText,
        serviceRatings,
        serviceReviewText
      });
    } else {
      this.props.navigation.navigate(SCREENS.ORDER_REVIEWS_SCREEN, {
        order: order,
        sellerRatings,
        sellerReviewText,
        serviceRatings,
        serviceReviewText
      });
    }
  };

  cancelOrderPopup = () => {
    this.show();
    this.setState({
      cancelOrderFlag: true,
      rejectOrderFlag: false,
      declineOrderFlag: false,
      title: "Are you sure you want to cancel this order?",
      headerText: "Cancel Order"
    });
  };

  rejectOrderPopup = () => {
    this.show();
    this.setState({
      cancelOrderFlag: false,
      rejectOrderFlag: true,
      declineOrderFlag: false,
      title: "Are you sure you want to reject this order?",
      headerText: "Reject Order"
    });
  };

  declineItemPopup = index => {
    this.indexToDecline = index;
    this.show();
    this.setState({
      cancelOrderFlag: false,
      rejectOrderFlag: false,
      declineOrderFlag: true,
      title: "Declining would mark this item to be deleted from the List",
      headerText: "Decline Item"
    });
  };

  popup = () => {
    if (this.state.cancelOrderFlag) {
      this.cancelOrder();
    } else if (this.state.rejectOrderFlag) {
      this.rejectOrder();
    } else if (this.state.declineOrderFlag) {
      this.removeItem(this.indexToDecline);
    }
  };

  hideCancelOrderModal = () => {
    this.setState({
      isCancelOrderModal: false,
      selectedReason: [],
      writtenReason: "",
      showTextInput: false
    });
  };

  cancelOrderOpenModal = () => {
    this.setState({ isCancelOrderModal: true });
  };

  onSelectReason = reason => {
    this.setState({ writtenReason: "" });
    if (reason.id == 0) {
      this.setState({ showTextInput: true });
    } else {
      this.setState({ showTextInput: false });
    }
    console.log("reason: ", reason);
    this.setState({ selectedReason: reason });
  };

  OnSubmitInCancellationReasons = () => {
    this.setState({ isCancelOrderModal: false });
    this.cancelOrder();
  };

  cancelOrder = async () => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_CANCEL_ORDER);

    this.hide();
    this.setState({ isLoading: true });
    const { order, selectedReason, writtenReason } = this.state;
    try {
      this.setState({ isLoading: true });
      let res;
      if (selectedReason.id == 0) {
        res = await cancelOrder({
          orderId: order.id,
          sellerId: order.seller_id,
          reasonId: selectedReason.id,
          reasonText: writtenReason
        });
      } else {
        res = await cancelOrder({
          orderId: order.id,
          sellerId: order.seller_id,
          reasonId: selectedReason.id
        });
      }
      this.setState({ order: res.result });
      showSnackbar({ text: "Order Cancelled!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  rejectOrder = async () => {
    Analytics.logEvent(Analytics.EVENTS.REJECT_ORDER);
    this.hide();
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      const res = await rejectOrder({
        orderId: order.id,
        sellerId: order.seller_id
      });
      this.setState({ order: res.result });
      showSnackbar({ text: "Order Rejected!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  approveOrder = async () => {
    Analytics.logEvent(Analytics.EVENTS.APPROVE_ORDER);
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      if (order.order_type == ORDER_TYPES.FMCG) {
        const res = await approveOrder({
          orderId: order.id,
          sellerId: order.seller_id,
          skuList: order.order_details
        });
        this.setState({ order: res.result }, () => {
          console.log("Order after Approved Button Press_______", order);
          const orderItems = order.order_details.filter(
            order => order.item_availability == true || order.suggestion
          );
          if (orderItems.length == 0) {
            showSnackbar({ text: "Order Cancelled!" });
          } else showSnackbar({ text: "Order Approved!" });
        });
      } else {
        const res = await approveAssistedServiceOrder({
          orderId: order.id,
          sellerId: order.seller_id
        });
        this.setState({ order: res.result }, () => {
          showSnackbar({ text: "Order Approved!" });
        });
      }
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // declineItem = index => {
  //   Alert.alert(
  //     "Are you sure?",
  //     "Declining would mark this item to be deleted from the List",
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => { }
  //       },
  //       {
  //         text: "Confirm",
  //         onPress: () => this.removeItem(index)
  //       }
  //     ]
  //   );
  // };

  startAssistedServiceOrder = async () => {
    const { order } = this.state;
    order.order_details[0].start_date = moment().toISOString();
    try {
      this.setState({ isLoading: true });
      const res = await startAssistedServiceOrder({
        orderId: order.id,
        orderDetails: order.order_details,
        sellerId: order.seller_id
      });
      this.setState({ order: res.result });
      showSnackbar({ text: "Service Started!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  endAssistedServiceOrder = async () => {
    const { order } = this.state;
    order.order_details[0].end_date = moment().toISOString();
    try {
      this.setState({ isLoading: true });
      const res = await endAssistedServiceOrder({
        orderId: order.id,
        orderDetails: order.order_details,
        sellerId: order.seller_id
      });
      this.setState({ order: res.result });
      showSnackbar({ text: "Service Completed!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  completeOrder = async () => {
    Analytics.logEvent(Analytics.EVENTS.MARK_PAID);
    const { order } = this.state;
    const { user } = this.props;
    console.log("order state", order);
    if (
      order.payment_ref_id &&
      order.payment_mode_id &&
      order.payment_status &&
      order.payment_mode_id == 4 &&
      order.payment_status == 4
    ) {
      this.props.navigation.navigate(SCREENS.PENDING_PAYMENT_STATUS_SCREEN, {
        transactionStatus: 4,
        orderId: order.payment_ref_id,
        orderAmount: order.total_amount,
        order: order,
        user: user
      });
    } else if (
      order.payment_ref_id &&
      order.payment_mode_id &&
      order.payment_status &&
      order.payment_mode_id == 4 &&
      order.payment_status == 13
    ) {
      this.props.navigation.navigate(SCREENS.PENDING_PAYMENT_STATUS_SCREEN, {
        transactionStatus: 13,
        orderId: order.payment_ref_id,
        orderAmount: order.total_amount,
        order: order,
        user: user
      });
    } else this.paymentOptions.show();
  };

  openDigitalBill = () => {
    const { order } = this.state;
    this.props.navigation.navigate(SCREENS.DIGITAL_BILL_SCREEN, {
      order: order,
      fromOrderFlowScreen: true
    });
  };
  //function called when payment to be done offline
  payOffline = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      const res = await completeOrder({
        orderId: order.id,
        sellerId: order.seller_id,
        payment_mode: PAYMENT_MODES.OFFLINE
      });
      console.log("res for work is ", res);
      this.setState({ order: res.result.order }, () => {
        // if (
        //   order.order_type == ORDER_TYPES.FMCG &&
        //   order.expense_id &&
        //   order.upload_id
        // ) {
        //   this.openUploadBillPopup();
        // } else {
        //   this.openReviewsScreen();
        // }
        if (order.order_type == ORDER_TYPES.FMCG) {
          this.openDigitalBill();
        } else {
          this.openReviewsScreen();
        }
      });

      showSnackbar({ text: "Order completed!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  //function called when payment via credit to be done
  payByCredit = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      const res = await completeOrder({
        orderId: order.id,
        sellerId: order.seller_id,
        payment_mode: PAYMENT_MODES.CREDIT
      });

      this.setState({ order: res.result.order }, () => {
        if (order.order_type == ORDER_TYPES.FMCG) {
          this.openDigitalBill();
        } else {
          this.openReviewsScreen();
        }
        // this.openDigitalBill();
      });

      showSnackbar({ text: "Order completed!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  //Payment options indices : 0 -> Online, 1 -> Offline, 2 -> Credit, 3 -> Cancel
  handlePaymentOptions = index => {
    const { order } = this.state;
    const { user } = this.props;
    let totalAmount = 0;
    if (order) {
      totalAmount = order.order_details.reduce((total, item) => {
        return item.selling_price ? total + Number(item.selling_price) : total;
      }, 0);
    }
    if (index === 3 && order.is_credit_allowed && order.seller.pay_online)
      return;
    else if (
      index === 1 &&
      !order.is_credit_allowed &&
      !order.seller.pay_online
    )
      return;
    else if (index === 0 && order.seller.pay_online == true) {
      //this.setState({ showWebView: true });
      this.props.navigation.navigate(SCREENS.CASHFREE_PAYMENT_STATUS_SCREEN, {
        order: order,
        user: user
      });
    } else if (index === 0 && order.seller.pay_online == false) {
      this.payOffline();
    } else if (index === 1 && order.seller.pay_online == true) {
      this.payOffline();
    } else if (
      order.seller.pay_online === true &&
      index === 2 &&
      order.is_credit_allowed &&
      order.credit_limit >= totalAmount
    ) {
      this.payByCredit();
    } else if (
      order.seller.pay_online === true &&
      index === 2 &&
      order.is_credit_allowed &&
      order.credit_limit < totalAmount
    ) {
      alert("You have surpassed your credit limit");
    } else if (
      index === 2 &&
      (!order.is_credit_allowed || !order.seller.pay_online)
    ) {
      return;
    } else if (
      order.seller.pay_online === false &&
      index === 1 &&
      order.is_credit_allowed &&
      order.credit_limit >= totalAmount
    ) {
      this.payByCredit();
    } else if (
      order.seller.pay_online == false &&
      index === 1 &&
      order.is_credit_allowed &&
      order.credit_limit < totalAmount
    ) {
      alert("You have surpassed your credit limit");
    } else if (
      index === 2 &&
      (!order.is_credit_allowed || !order.seller.pay_online)
    ) {
      return;
    }
  };

  openUploadBillPopup = () => {
    const { userLocation } = this.props;
    const { order } = this.state;

    if (
      order.order_type == ORDER_TYPES.FMCG &&
      order.expense_id &&
      order.upload_id &&
      userLocation != LOCATIONS.OTHER
    ) {
      this.uploadBillModal.show({
        productId: order.expense_id,
        jobId: order.upload_id
      });
    }
  };

  removeItem = index => {
    this.hide();
    const { order } = this.state;
    const order_details = [...order.order_details];
    order_details.splice(index, 1);
    order.order_details = order_details;
    this.setState({ order });
  };
  updateProduct = async amount => {
    const { order } = this.state;
    this.setState({
      isLoading: true
    });
    try {
      const res = await updateProduct({
        productId: order.expense_id,
        value: amount
      });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  hideIsDeletingItems = () => {
    this.setState({ isDeletingItems: false });
  };

  deleteItemFromList = (orderId, itemId, sellerId) => {
    const { order, showSellerDiscount } = this.state;
    this.setState(
      {
        deleteOrderId: orderId,
        deleteItemId: itemId,
        deleteSellerId: sellerId
      },
      () => {
        if (
          order &&
          order.seller_discount &&
          order.seller_discount > 0 &&
          showSellerDiscount
        ) {
          this.setState({ isDeletingItems: true });
        } else {
          this.deleteItemFinal();
        }
      }
    );
  };

  onContinueDelete = async () => {
    this.setState({ isDeletingItems: false, showSellerDiscount: false }, () => {
      this.deleteItemFinal();
    });
  };

  deleteItemFinal = async () => {
    const { deleteOrderId, deleteItemId, deleteSellerId } = this.state;
    const res = await deleteItemShoppingList(
      deleteOrderId,
      deleteItemId,
      deleteSellerId
    );
    //console.log("Delete Item Response________________", res.result);
    this.setState({ order: res.result });
  };

  checkPaymentStatus = () => {
    console.log("PENDING PAYMENT STATUS CHECK");
  };

  render() {
    const { userLocation } = this.props;

    const {
      isLoading,
      error,
      order,
      isVisible,
      title,
      headerText,
      showWebView,
      isCancelOrderModal,
      selectedReason,
      cancelReasons,
      showTextInput,
      writtenReason,
      showSellerDiscount,
      isDeletingItems
    } = this.state;
    console.log("ORDER***********************", order);
    console.log("cancel reasons: ", cancelReasons);

    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.getOrderDetails} />;
    }

    let totalAmount = 0;
    let discount = 0;

    if (order) {
      discount = order.seller_discount;
      //console.log("Order Details_____________________", order);
      totalAmount = order.order_details.reduce((total, item) => {
        return item.selling_price ? total + Number(item.selling_price) : total;
      }, 0);
    }

    let sellerRatings = 0;
    let sellerReviewText = "";
    let serviceRatings = 0;
    let serviceReviewText = "";

    if (order && order.seller_review) {
      sellerRatings = order.seller_review.review_ratings;
      sellerReviewText = order.seller_review.review_feedback;
    }

    if (
      order &&
      order.delivery_user &&
      order.delivery_user.reviews &&
      order.delivery_user.reviews.length > 0
    ) {
      const serviceReview = order.delivery_user.reviews.find(
        userReview => userReview.order_id == order.id
      );

      if (serviceReview) {
        serviceRatings = serviceReview.ratings;
        serviceReviewText = serviceReview.feedback;
      }
    }

    let deliveryUser = order ? order.delivery_user : null;
    let startTime = null;
    let endTime = null;
    let timeElapsedInMinutes = 0;
    let serviceTotalAmount = 0;
    let basePrice = 0;
    let hourlyPrice = 0;

    if (order && order.order_type == ORDER_TYPES.ASSISTED_SERVICE) {
      deliveryUser = order.service_user || null;
      startTime = order.order_details[0].start_date;
      endTime = order.order_details[0].end_date;

      if (startTime && endTime) {
        timeElapsedInMinutes = Math.ceil(
          moment(endTime).diff(startTime, "minutes", true)
        );
      }
      serviceTotalAmount = order.order_details[0].total_amount;

      if (deliveryUser) {
        const basePriceItem = deliveryUser.service_type.price.find(
          p => p.price_type == SERVICE_PRICE_TYPES.BASE_PRICE
        );
        basePrice = basePriceItem ? basePriceItem.value : 0;
        const hourlyPriceItem = deliveryUser.service_type.price.find(
          p => p.price_type == SERVICE_PRICE_TYPES.HOURLY_PRICE
        );
        hourlyPrice = hourlyPriceItem ? hourlyPriceItem.value : 0;
      }
    }

    let options = ["Pay Seller Online", "Paid Cash on Delivery", "Credit"];
    let cancelIndex = 3;
    if (order && !order.seller.pay_online && order.is_credit_allowed) {
      cancelIndex = 2;
      options = [
        "Paid Cash on Delivery",
        order.credit_limit < totalAmount ? (
          <Text style={{ fontSize: 18, color: "grey" }}>On Credit</Text>
        ) : (
          "On Credit"
        )
      ];
    } else if (order && !order.seller.pay_online && !order.is_credit_allowed) {
      cancelIndex = 1;
      options = ["Paid Cash on Delivery"];
    } else if (order && !order.is_credit_allowed && order.seller.pay_online) {
      cancelIndex = 2;
      options = ["Pay Seller Online", "Paid Cash on Delivery"];
    } else if (order && order.is_credit_allowed && order.seller.pay_online) {
      cancelIndex = 3;
      options = [
        "Pay Seller Online",
        "Paid Cash on Delivery",
        order.credit_limit < totalAmount ? (
          <Text style={{ fontSize: 18, color: "grey" }}>On Credit</Text>
        ) : (
          "On Credit"
        )
      ];
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {order && (
          <View style={{ flex: 1 }}>
            <FlatList
              style={{ flex: 1 }}
              ListHeaderComponent={() => (
                <View
                  style={{
                    borderBottomColor: "#dadada",
                    borderBottomWidth: 1,
                    margin: 15,
                    marginBottom: 0,
                    paddingBottom: 5
                  }}
                >
                  <Status
                    paymentStatus={order.payment_status}
                    paymentMode={order.payment_mode_id}
                    statusType={order.status_type}
                    isOrderModified={order.is_modified}
                    isInReview={order.in_review}
                    orderType={order.order_type}
                    startTime={startTime}
                    endTime={endTime}
                    collectAtStore={order.collect_at_store}
                    autoCancelTime={order.auto_cancel_time}
                    deliveryMinutes={order.delivery_minutes}
                    autoAcceptTime={order.auto_accept_time}
                    deliveryClockStartTime={order.delivery_clock_start_time}
                    autoCancelPenalty={order.auto_cancel_max_cashback}
                  />
                  {deliveryUser && (
                    <DeliveryUserDetails
                      deliveryUser={deliveryUser}
                      orderType={order.order_type}
                    />
                  )}
                  <SellerDetails
                    navigation={this.props.navigation}
                    order={order}
                    openUploadBillPopup={this.openUploadBillPopup}
                    userLocation={userLocation}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 7
                    }}
                  >
                    <Text
                      weight="Medium"
                      style={{ fontSize: 10.5, color: "#777777" }}
                    >
                      {order.order_type == ORDER_TYPES.FMCG
                        ? "Shopping List"
                        : "Service Requested"}
                    </Text>
                    <Text
                      weight="Medium"
                      style={{ fontSize: 10.5, color: "#777777" }}
                    >
                      {order.order_type == ORDER_TYPES.FMCG ? "Price" : ""}
                    </Text>
                  </View>
                </View>
              )}
              data={order.order_details}
              extraData={order}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#eee",
                    marginHorizontal: 15
                  }}
                />
              )}
              keyExtractor={(item, index) => item.id + "" + index}
              renderItem={({ item, index }) => {
                //console.log("order.status_type___________", order.status_type);
                if (order.order_type == ORDER_TYPES.FMCG) {
                  return (
                    <ShoppingListItem
                      sellerId={order.seller_id}
                      orderId={order.id}
                      order={order}
                      orderStatus={order.status_type}
                      item={item}
                      index={index}
                      declineItem={() => {
                        this.removeItem(index);
                      }}
                      deleteItem={() =>
                        this.deleteItemFromList(
                          order.id,
                          item.id,
                          order.seller_id
                        )
                      }
                    />
                  );
                } else {
                  return <AssistedServiceListItem item={item} index={index} />;
                }
              }}
              ListFooterComponent={() => (
                <View>
                  {order &&
                  order.seller_discount &&
                  order.seller_discount > 0 &&
                  showSellerDiscount ? (
                    <View>
                      {order.order_type == ORDER_TYPES.FMCG &&
                      totalAmount > 0 ? (
                        <View
                          style={{
                            flexDirection: "row",
                            height: 42,
                            borderTopWidth: 1,
                            borderBottomWidth: 0,
                            borderColor: "#eee",
                            marginHorizontal: 20,
                            alignItems: "center"
                          }}
                        >
                          <Text
                            weight="Medium"
                            style={{ flex: 1, color: "#444", fontSize: 12 }}
                          >
                            Total Amount
                          </Text>
                          <Text
                            weight="Medium"
                            style={{ color: "#444", fontSize: 12 }}
                          >
                            Rs. {parseFloat(totalAmount).toFixed(2)}
                          </Text>
                        </View>
                      ) : null}
                      {order.order_type == ORDER_TYPES.FMCG &&
                      order.seller_discount &&
                      order.seller_discount > 0 ? (
                        <View
                          style={{
                            flexDirection: "row",
                            height: 10,
                            marginBottom: 15,
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            borderColor: "#eee",
                            marginHorizontal: 20,
                            alignItems: "center"
                          }}
                        >
                          <Text
                            style={{ flex: 1, color: "#777", fontSize: 12 }}
                          >
                            Seller Discount
                          </Text>
                          <Text style={{ color: "#777", fontSize: 12 }}>
                            Rs. {parseFloat(order.seller_discount).toFixed(2)}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}

                  {order.order_type == ORDER_TYPES.FMCG && totalAmount > 0 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        height: 55,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: "#eee",
                        marginHorizontal: 20,
                        alignItems: "center"
                      }}
                    >
                      <Text weight="Medium" style={{ flex: 1 }}>
                        Payable Amount
                      </Text>
                      <Text weight="Medium">
                        Rs.{" "}
                        {showSellerDiscount && order.seller_discount > 0
                          ? (
                              parseFloat(totalAmount) -
                              parseFloat(order.seller_discount)
                            ).toFixed(2)
                          : parseFloat(totalAmount).toFixed(2)}
                      </Text>
                    </View>
                  ) : null}

                  {order.order_type == ORDER_TYPES.ASSISTED_SERVICE &&
                  serviceTotalAmount ? (
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderColor: "#eee"
                      }}
                    >
                      <KeyValueItem
                        keyText="Started Time"
                        valueText={moment(startTime).format("h:mm a")}
                      />
                      <KeyValueItem
                        keyText="End Time"
                        valueText={moment(endTime).format("h:mm a")}
                      />
                      <KeyValueItem
                        keyText="Time Elapsed"
                        valueText={timeElapsedInMinutes + " mins"}
                      />
                      <KeyValueItem
                        keyText="Total Amount"
                        ValueComponent={() => (
                          <TouchableOpacity
                            onPress={() =>
                              this.servicePriceBreakdownModal.show({
                                basePrice: basePrice,
                                hourlyPrice,
                                startTime,
                                endTime,
                                timeElapsedInMinutes,
                                totalAmount: serviceTotalAmount
                              })
                            }
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-end"
                            }}
                          >
                            <Text weight="Bold">Rs. {serviceTotalAmount}</Text>
                            <Icon
                              name="md-information-circle"
                              size={15}
                              style={{ marginTop: 2, marginLeft: 5 }}
                            />
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  ) : null}

                  {order.status_type == ORDER_STATUS_TYPES.COMPLETE && (
                    <View>
                      {!sellerRatings && !serviceRatings ? (
                        <Button
                          onPress={this.openReviewsScreen}
                          text="Rate Service Delivery"
                          color="secondary"
                          type="outline"
                          style={{
                            margin: 20,
                            width: 210,
                            alignSelf: "center",
                            height: 40
                          }}
                        />
                      ) : (
                        <View style={{ paddingHorizontal: 10 }}>
                          {serviceRatings ? (
                            <View>
                              <Text weight="Bold" style={{ marginTop: 20 }}>
                                Delivery Experience
                              </Text>
                              <ReviewCard
                                imageUrl={
                                  API_BASE_URL +
                                  `/assisted/${order.delivery_user.id}/profile`
                                }
                                ratings={serviceRatings}
                                userName={order.delivery_user.name}
                                feedbackText={serviceReviewText}
                                onEditPress={this.openReviewsScreen}
                              />
                            </View>
                          ) : null}
                          <Text weight="Bold" style={{ marginTop: 20 }}>
                            Seller Responsiveness
                          </Text>
                          <ReviewCard
                            imageUrl={
                              API_BASE_URL +
                              `/consumer/sellers/${
                                order.seller_id
                              }/upload/1/images/0`
                            }
                            ratings={sellerRatings}
                            userName={order.seller.seller_name}
                            feedbackText={sellerReviewText}
                            onEditPress={this.openReviewsScreen}
                          />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
            />
            {![
              ORDER_STATUS_TYPES.CANCELED,
              ORDER_STATUS_TYPES.REJECTED
            ].includes(order.status_type) ? (
              <View>
                {order.status_type == ORDER_STATUS_TYPES.NEW &&
                !order.is_modified ? (
                  <Button
                    onPress={this.cancelOrderOpenModal}
                    text="Cancel Order"
                    color="secondary"
                    borderRadius={0}
                  />
                ) : null}

                {(order.status_type == ORDER_STATUS_TYPES.OUT_FOR_DELIVERY &&
                  order.order_type == ORDER_TYPES.FMCG) ||
                (order.status_type == ORDER_STATUS_TYPES.END_TIME &&
                  order.order_type == ORDER_TYPES.ASSISTED_SERVICE) ? (
                  <Button
                    onPress={this.completeOrder}
                    text="Pay Now"
                    color="secondary"
                    borderRadius={0}
                  />
                ) : null}

                {order.status_type == ORDER_STATUS_TYPES.OUT_FOR_DELIVERY &&
                order.order_type == ORDER_TYPES.ASSISTED_SERVICE ? (
                  <Button
                    onPress={this.startAssistedServiceOrder}
                    text="Start Job"
                    color="secondary"
                    borderRadius={0}
                  />
                ) : null}

                {order.status_type == ORDER_STATUS_TYPES.START_TIME &&
                order.order_type == ORDER_TYPES.ASSISTED_SERVICE ? (
                  <Button
                    onPress={this.endAssistedServiceOrder}
                    text="End Job"
                    color="secondary"
                    borderRadius={0}
                  />
                ) : null}

                {order.is_modified &&
                ![
                  ORDER_STATUS_TYPES.APPROVED,
                  ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
                  ORDER_STATUS_TYPES.COMPLETE,
                  ORDER_STATUS_TYPES.START_TIME,
                  ORDER_STATUS_TYPES.END_TIME
                ].includes(order.status_type) ? (
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      onPress={this.rejectOrderPopup}
                      text="Reject"
                      color="grey"
                      borderRadius={0}
                      style={{ flex: 1 }}
                    />
                    <Button
                      onPress={this.approveOrder}
                      text="Approve"
                      color="secondary"
                      borderRadius={0}
                      style={{ flex: 1 }}
                    />
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        )}
        <UploadBillModal
          navigation={this.props.navigation}
          onUploadDone={amount => {
            this.updateProduct(amount);
            // hit product update call with total amount
            setTimeout(this.openReviewsScreen, 200);
          }}
          ref={node => {
            this.uploadBillModal = node;
          }}
        />
        <Modal1
          isVisible={isVisible}
          title={headerText}
          onClosePress={this.hideDeleteModal}
          onBackButtonPress={this.hideDeleteModal}
          onBackdropPress={this.hideDeleteModal}
          style={{ height: 200, backgroundColor: "#fff" }}
        >
          <View style={{ height: 150, backgroundColor: "#fff" }}>
            <View style={{ width: 260, alignSelf: "center", top: 25 }}>
              <Text
                weight="Regular"
                style={{ textAlign: "center", fontSize: 16 }}
              >
                {title}
              </Text>
            </View>
            <View
              style={{
                top: 40,
                flexDirection: "row",
                width: 260,
                justifyContent: "space-between",
                alignSelf: "center"
              }}
            >
              <Button
                text="No"
                onPress={this.hide}
                color="grey"
                style={{
                  height: 40,
                  width: 120,
                  alignSelf: "center",
                  marginTop: 20
                }}
              />
              <Button
                text="Yes"
                onPress={this.popup}
                color="secondary"
                style={{
                  height: 40,
                  width: 120,
                  alignSelf: "center",
                  marginTop: 20
                }}
              />
            </View>
          </View>
        </Modal1>
        <ServicePriceBreakdownModal
          ref={node => {
            this.servicePriceBreakdownModal = node;
          }}
        />

        {/* ActionSheet for showing payment options */}
        <ActionSheet
          onPress={this.handlePaymentOptions}
          ref={o => (this.paymentOptions = o)}
          cancelButtonIndex={cancelIndex}
          options={options}
        />

        <Modal
          isVisible={isCancelOrderModal}
          useNativeDriver
          style={{
            position: "absolute",
            bottom: 0,
            padding: 0,
            margin: 0,
            height: showTextInput ? 300 : 275
          }}
          onBackButtonPress={this.hideCancelOrderModal}
          onBackdropPress={this.hideCancelOrderModal}
        >
          <View
            style={{
              padding: 15,
              backgroundColor: "#fff",
              flex: 1,
              width: deviceWidth
            }}
          >
            <Text weight="Medium" style={{ fontSize: 18 }}>
              Reason for Cancellation:
            </Text>
            <View style={{ marginTop: 5 }}>
              {cancelReasons.length > 0 &&
                cancelReasons.map(reason => {
                  return (
                    <TouchableOpacity
                      style={{ flexDirection: "row", marginTop: 10 }}
                      onPress={() => this.onSelectReason(reason)}
                    >
                      <RadioBox
                        style={{
                          height: 20,
                          width: 20,
                          borderColor: colors.pinkishOrange
                        }}
                        isChecked={selectedReason.id == reason.id}
                      />
                      <Text style={{ fontSize: 16, marginLeft: 10 }}>
                        {reason.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              {showTextInput ? (
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Please specify..."
                  maxLength={255}
                  onChangeText={writtenReason =>
                    this.setState({ writtenReason })
                  }
                  value={writtenReason}
                />
              ) : null}
            </View>

            <View style={{ position: "absolute", right: 15, top: 15 }}>
              <TouchableOpacity
                onPress={this.hideCancelOrderModal}
                style={{
                  paddingLeft: 10,
                  paddingRight: 10
                }}
              >
                <Icon name="md-close" color="#000" size={24} />
              </TouchableOpacity>
            </View>

            <View style={{ position: "absolute", bottom: 0 }}>
              <Button
                text="Submit"
                onPress={this.OnSubmitInCancellationReasons}
                color="secondary"
                borderRadius={0}
                textStyle={{ fontSize: 18 }}
                style={{
                  height: 50,
                  width: deviceWidth,
                  alignSelf: "center"
                }}
              />
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={isDeletingItems}
          useNativeDriver={true}
          onBackButtonPress={this.hideIsDeletingItems}
          onBackdropPress={this.hideIsDeletingItems}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: 280,
              height: 200,
              alignSelf: "center",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              weight="Medium"
              style={{
                fontSize: 15,
                padding: 10,
                textAlign: "center",
                marginBottom: 20
              }}
            >
              Your Order Discount of Rs. {discount}/- will not be valid on
              return of any item
            </Text>
            <View
              style={{
                width: "100%",
                maxWidth: 220,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Button
                text="Cancel"
                style={{ width: 100, height: 40 }}
                textStyle={{ fontSize: 12 }}
                color="secondary"
                type="outline"
                onPress={this.hideIsDeletingItems}
              />
              <Button
                text="Continue"
                style={{ width: 100, height: 40 }}
                color="secondary"
                textStyle={{ fontSize: 12 }}
                onPress={this.onContinueDelete}
              />
            </View>
          </View>
        </Modal>

        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.loggedInUser,
    userLocation: state.loggedInUser.location || LOCATIONS.OTHER
  };
};

export default connect(mapStateToProps)(OrderScreen);
