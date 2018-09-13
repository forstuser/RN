import React from "react";
import { View, FlatList, Alert, Animated } from "react-native";

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
  endAssistedServiceOrder
} from "../../api";

import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { showSnackbar } from "../../utils/snackbar";

import { ORDER_STATUS_TYPES, SCREENS, ORDER_TYPES } from "../../constants";

import Status from "./status";
import SellerDetails from "./seller-details";
import ShoppingListItem from "./shopping-list-item";
import AssistedServiceListItem from "./assisted-service-list-item";
import DeliveryUserDetails from "./delivery-user-details";

import socketIo from "../../socket-io";

import UploadBillModal from "./upload-bill-modal";
import ReviewCard from "./review-card";
import Modal from "../../components/modal";

export default class OrderScreen extends React.Component {
  static navigationOptions = {
    title: "Order Details"
  };

  state = {
    isLoading: true,
    error: null,
    order: null,
    isVisible: false
  };

  componentDidMount() {
    this.getOrderDetails();
    // socketIo.socket.on("order-status-change", data => {
    //   console.log("socket order-status-change data: " + data);
    //   // this.setState({ order: JSON.parse(data) });
    // });
    if (socketIo.socket) {
      socketIo.socket.on("order-status-change", data => {
        const jsonData = JSON.parse(data);
        console.log("jsonData: ", jsonData);
        if (this.state.order && jsonData.order.id == this.state.order.id) {
          this.setState({ order: jsonData.order });
        }
      });
    }

    // this.uploadBillModal.show({ productId: 50897, jobId: 52334 });
  }

  componentWillUnmount() {
    if (socketIo.socket) {
      socketIo.socket.off("order-status-change");
    }
  }
  show = item => {
    this.setState({ isVisible: true });
  };
  hide = () => {
    this.setState({ isVisible: false });
  };
  getOrderDetails = async () => {
    const { navigation } = this.props;
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

    this.props.navigation.navigate(SCREENS.SHOPPING_LIST_ORDER_REVIEWS_SCREEN, {
      order: order,
      sellerRatings,
      sellerReviewText,
      serviceRatings,
      serviceReviewText
    });
  };

  cancelOrder = () => {
    this.show();
  };
  deleteAddress = async () => {
    this.hide();
    this.setState({ isLoading: true })
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      await cancelOrder({ orderId: order.id, sellerId: order.seller_id });
      showSnackbar({ text: "Order Cancelled!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  rejectOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      await rejectOrder({ orderId: order.id, sellerId: order.seller_id });
      showSnackbar({ text: "Order Rejected!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  approveOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      if (order.order_type == ORDER_TYPES.FMCG) {
        await approveOrder({
          orderId: order.id,
          sellerId: order.seller_id,
          skuList: order.order_details
        });
      } else {
        await approveAssistedServiceOrder({
          orderId: order.id,
          sellerId: order.seller_id
        });
      }
      showSnackbar({ text: "Order Approved!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  completeOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      const res = await completeOrder({
        orderId: order.id,
        sellerId: order.seller_id
      });

      if (res.result.product) {
        this.uploadBillModal.show({
          productId: res.result.product.id,
          jobId: res.result.product.job_id
        });
      }
      showSnackbar({ text: "Order completed!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  declineItem = index => {
    Alert.alert(
      "Are you sure?",
      "Declining would mark this item to be deleted from the List",
      [
        {
          text: "Cancel",
          onPress: () => { }
        },
        {
          text: "Confirm",
          onPress: () => this.removeItem(index)
        }
      ]
    );
  };

  startAssistedServiceOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      const res = await startAssistedServiceOrder({
        orderId: order.id,
        orderDetails: order.order_details,
        sellerId: order.seller_id
      });
      showSnackbar({ text: "Service Started!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  endAssistedServiceOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      const res = await startAssistedServiceOrder({
        orderId: order.id,
        orderDetails: order.order_details,
        sellerId: order.seller_id
      });
      showSnackbar({ text: "Service Completed!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  completeOrder = async () => {
    const { order } = this.state;
    try {
      this.setState({ isLoading: true });
      const res = await completeOrder({
        orderId: order.id,
        sellerId: order.seller_id
      });

      if (res.result.product) {
        this.uploadBillModal.show({
          productId: res.result.product.id,
          jobId: res.result.product.job_id
        });
      }
      showSnackbar({ text: "Order completed!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  removeItem = index => {
    const { order } = this.state;
    const order_details = [...order.order_details];
    order_details.splice(index, 1);
    order.order_details = order_details;
    this.setState({ order });
  };

  render() {
    const { isLoading, error, order, isVisible } = this.state;

    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.getOrderDetails} />;
    }

    let totalAmount = 0;

    if (order) {
      totalAmount = order.order_details.reduce((total, item) => {
        return item.selling_price ? total + item.selling_price : total;
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

    if (order && order.order_type == ORDER_TYPES.ASSISTED_SERVICE) {
      deliveryUser = order.order_details[0].service_user || null;
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
                    orderType={order.order_type}
                  />
                  {deliveryUser && (
                    <DeliveryUserDetails
                      deliveryUser={deliveryUser}
                      orderType={order.order_type}
                    />
                  )}
                  <SellerDetails order={order} />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between"
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
                if (order.order_type == ORDER_TYPES.FMCG) {
                  return (
                    <ShoppingListItem
                      item={item}
                      index={index}
                      declineItem={() => {
                        this.declineItem(index);
                      }}
                    />
                  );
                } else {
                  return <AssistedServiceListItem item={item} index={index} />;
                }
              }}
              ListFooterComponent={() => (
                <View>
                  {order.order_type == ORDER_TYPES.FMCG && (
                    <View
                      style={{
                        flexDirection: "row",
                        height: 42,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: "#eee",
                        marginHorizontal: 10,
                        alignItems: "center"
                      }}
                    >
                      <Text weight="Medium" style={{ flex: 1 }}>
                        Total Amount
                      </Text>
                      <Text weight="Medium">Rs. {totalAmount}</Text>
                    </View>
                  )}

                  {order.status_type == ORDER_STATUS_TYPES.COMPLETE && (
                    <View>
                      {!sellerRatings || !serviceRatings ? (
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
                            {serviceRatings && (
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
                            )}
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
            ].includes(order.status_type) && (
                <View>
                  {order.status_type == ORDER_STATUS_TYPES.NEW &&
                    !order.is_modified && (
                      <Button
                        onPress={this.cancelOrder}
                        text="Cancel Order"
                        color="secondary"
                        borderRadius={0}
                      />
                    )}

                  {order.status_type == ORDER_STATUS_TYPES.OUT_FOR_DELIVERY && (
                    <Button
                      onPress={this.completeOrder}
                      text="Mark Paid"
                      color="secondary"
                      borderRadius={0}
                    />
                  )}

                  {order.is_modified &&
                    ![
                      ORDER_STATUS_TYPES.APPROVED,
                      ORDER_STATUS_TYPES.OUT_FOR_DELIVERY,
                      ORDER_STATUS_TYPES.COMPLETE
                    ].includes(order.status_type) && (
                      <View style={{ flexDirection: "row" }}>
                        <Button
                          onPress={this.rejectOrder}
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
                    )}
                </View>
              )}
          </View>
        )}
        <UploadBillModal
          navigation={this.props.navigation}
          onUploadDone={() => {
            setTimeout(this.openReviewsScreen, 200);
          }}
          ref={node => {
            this.uploadBillModal = node;
          }}
        />
        <Modal
          isVisible={isVisible}
          title={"Cancel Order"}
          onClosePress={this.hideDeleteModal}
          onBackButtonPress={this.hideDeleteModal}
          onBackdropPress={this.hideDeleteModal}
          style={{ height: 200, backgroundColor: "#fff" }}
        >
          <View style={{ height: 150, backgroundColor: "#fff" }}>
            <View style={{ width: 260, alignSelf: 'center', top: 25 }}>
              <Text weight="Bold" style={{ textAlign: 'center', fontSize: 16 }}>Are you sure want to cancel this order?</Text>
            </View>
            <View style={{ top: 40, flexDirection: 'row', width: 260, justifyContent: 'space-between', alignSelf: 'center' }}>
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
                onPress={this.deleteAddress}
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
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
