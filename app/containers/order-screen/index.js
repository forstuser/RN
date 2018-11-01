import React from "react";
import {
  View,
  FlatList,
  Alert,
  Animated,
  TouchableOpacity,
  BackHandler
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import Analytics from "../../analytics";

import { Text, Image, Button } from "../../elements";

import {
  API_BASE_URL,
  getOrderDetails,
  approveOrder,
  cancelOrder,
  rejectOrder,
  completeOrder,
  approveAssistedServiceOrder,
  startAssistedServiceOrder,
  endAssistedServiceOrder,
  updateProduct
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
  LOCATIONS
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
import Modal from "../../components/modal";
import HeaderBackBtn from "../../components/header-nav-back-btn";

class OrderScreen extends React.Component {
  // static navigationOptions = {
  //   title: "Order Details"
  // };

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
    headerText: ""
  };

  componentDidMount() {
    this.getOrderDetails(this.props);
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
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
    this.didFocusSubscription.remove();
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);

    if (socketIo.socket) {
      socketIo.socket.off("order-status-change");
      socketIo.socket.off("assisted-status-change");
      socketIo.socket.off("reconnect");
    }
  }

  onBackPress = () => {
    //alert("Back Pressed");
    const flag = this.props.navigation.getParam("flag", null);
    if (flag === true) this.props.navigation.navigate(SCREENS.DASHBOARD_SCREEN);
    else this.props.navigation.goBack();
    return true;
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
    this.setState({ isLoading: true, error: null });
    try {
      const res = await getOrderDetails({ orderId });
      this.setState({ order: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
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

    this.props.navigation.navigate(SCREENS.ORDER_REVIEWS_SCREEN, {
      order: order,
      sellerRatings,
      sellerReviewText,
      serviceRatings,
      serviceReviewText
    });
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

  cancelOrder = async () => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_CANCEL_ORDER);
    this.hide();
    this.setState({ isLoading: true });
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      const res = await cancelOrder({
        orderId: order.id,
        sellerId: order.seller_id
      });
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
        this.setState({ order: res.result });
      } else {
        const res = await approveAssistedServiceOrder({
          orderId: order.id,
          sellerId: order.seller_id
        });
        this.setState({ order: res.result });
      }
      showSnackbar({ text: "Order Approved!" });
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
    try {
      this.setState({ isLoading: true });
      const res = await completeOrder({
        orderId: order.id,
        sellerId: order.seller_id
      });

      this.setState({ order: res.result.order }, () => {
        if (
          order.order_type == ORDER_TYPES.FMCG &&
          order.expense_id &&
          order.upload_id &&
          userLocation != LOCATIONS.OTHER
        ) {
          this.openUploadBillPopup();
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

  render() {
    const { userLocation } = this.props;

    const {
      isLoading,
      error,
      order,
      isVisible,
      title,
      headerText
    } = this.state;

    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.getOrderDetails} />;
    }

    let totalAmount = 0;

    if (order) {
      console.log("order is ", order);
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
                    statusType={order.status_type}
                    isOrderModified={order.is_modified}
                    isInReview={order.in_review}
                    orderType={order.order_type}
                    startTime={startTime}
                    endTime={endTime}
                  />
                  {deliveryUser && (
                    <DeliveryUserDetails
                      deliveryUser={deliveryUser}
                      orderType={order.order_type}
                    />
                  )}
                  <SellerDetails
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
                      orderStatus={order.status_type}
                      item={item}
                      index={index}
                      declineItem={() => {
                        this.removeItem(index);
                      }}
                    />
                  );
                } else {
                  return <AssistedServiceListItem item={item} index={index} />;
                }
              }}
              ListFooterComponent={() => (
                <View>
                  {order.order_type == ORDER_TYPES.FMCG && totalAmount > 0 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        height: 42,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: "#eee",
                        marginHorizontal: 20,
                        alignItems: "center"
                      }}
                    >
                      <Text weight="Medium" style={{ flex: 1 }}>
                        Total Amount
                      </Text>
                      <Text weight="Medium">Rs. {totalAmount}</Text>
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
                    onPress={this.cancelOrderPopup}
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
                    text="Mark Paid"
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
        <Modal
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
        </Modal>
        <ServicePriceBreakdownModal
          ref={node => {
            this.servicePriceBreakdownModal = node;
          }}
        />
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userLocation: state.loggedInUser.location || LOCATIONS.OTHER
  };
};

export default connect(mapStateToProps)(OrderScreen);
