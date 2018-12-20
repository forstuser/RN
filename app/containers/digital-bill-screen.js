import React, { Component } from "react";
import { StyleSheet, View, FlatList, Image, BackHandler } from "react-native";
import { Text, Button, ScreenContainer } from "../elements";
import { colors } from "../theme";
import { showSnackbar } from "../utils/snackbar";
const logo = require("../images/splash.png");
import moment from "moment";
import _ from "lodash";
import HeaderBackButton from "../components/header-nav-back-btn";
import { SCREENS } from "../constants";
import { API_BASE_URL, digitalBill } from "../api";

class DigitalBillScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: "Challan",
      headerLeft: <HeaderBackButton onPress={params.onBackPress} />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      digitalBillData: {},
      order: null,
      fromOrderFlowScreen: false
    };
  }
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });
    const order = this.props.navigation.getParam("order", null);
    const fromOrderFlowScreen = this.props.navigation.getParam(
      "fromOrderFlowScreen",
      false
    );
    this.setState({ fromOrderFlowScreen: fromOrderFlowScreen, order: order });
    this.getDigitalBill(order);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    if (this.state.fromOrderFlowScreen) {
      this.openReviewsScreen();
    } else {
      this.props.navigation.goBack();
    }
    return true;
  };
  getDigitalBill = async order => {
    console.log("order", order);
    try {
      this.setState({ isLoading: true });
      const res = await digitalBill({
        expenseId: order.expense_id,
        orderId: order.id
      });
      this.setState({
        digitalBillData: res.result
      });
    } catch (e) {
      showSnackbar({ text: e.message });
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
      serviceReviewText,
      fromDigitalBillScreen: true
    });
  };
  render() {
    const { digitalBillData } = this.state;
    console.log("DIGITAL BILL DATA____________", digitalBillData);
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ flex: 1 }}
            ListHeaderComponent={() => (
              <View
                style={{
                  flex: 1,
                  borderBottomColor: "#dadada",
                  borderBottomWidth: 1,
                  margin: 15,
                  marginBottom: 0,
                  paddingBottom: 5
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <Text weight="Bold" style={styles.shopName}>
                    {digitalBillData.seller_name}
                  </Text>
                  <Image
                    source={logo}
                    style={{
                      position: "absolute",
                      right: 5,
                      top: 0,
                      width: 50,
                      height: 50
                    }}
                  />
                  <Text style={styles.address}>{digitalBillData.address}</Text>
                  {digitalBillData.gstin ? (
                    <Text style={{ fontSize: 12 }}>
                      GSTIN : {digitalBillData.gstin}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.line} />
                <View style={{ marginTop: 7 }}>
                  <View style={styles.billDate}>
                    <Text style={{ fontSize: 12 }}>Challan No. :</Text>
                    <Text style={{ fontSize: 12 }}>
                      BinBill{""}
                      {digitalBillData.order_id}
                    </Text>
                  </View>
                  <View style={styles.billDate}>
                    <Text style={{ fontSize: 12 }}>Date & Time :</Text>
                    <Text style={{ fontSize: 12 }}>
                      {moment(digitalBillData.created_at).format(
                        "DD MMM, YYYY"
                      )}
                    </Text>
                  </View>
                </View>

                <View style={styles.line} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 7,
                    marginTop: 7
                  }}
                >
                  <Text
                    weight="Medium"
                    style={{ fontSize: 10.5, color: "#777777", flex: 3 }}
                  >
                    Items
                  </Text>
                  <Text weight="Medium" style={styles.headerTitle}>
                    Qty.
                  </Text>
                  <Text weight="Medium" style={styles.headerTitle}>
                    Rate
                  </Text>
                  {/* <Text weight="Medium" style={styles.headerTitle}>
                    GST
                  </Text> */}
                  <Text weight="Medium" style={styles.headerTitle}>
                    Total Amt.
                  </Text>
                </View>
              </View>
            )}
            data={digitalBillData.expense_detail}
            extraData={digitalBillData.expense_detail}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 14,
                    marginTop: 7
                  }}
                >
                  <Text
                    weight="Medium"
                    style={{ fontSize: 10.5, color: "#777777", flex: 3 }}
                  >
                    {item.title}
                  </Text>
                  <Text weight="Medium" style={styles.headerTitle}>
                    {item.quantity}
                  </Text>
                  <Text weight="Medium" style={styles.headerTitle}>
                    ₹{" "}
                    {(
                      parseFloat(item.selling_price) / parseFloat(item.quantity)
                    ).toFixed(2)}
                  </Text>
                  {/* <Text weight="Medium" style={styles.headerTitle}>
                    {item.tax} %
                  </Text> */}
                  <Text weight="Medium" style={styles.headerTitle}>
                    ₹ {parseFloat(item.selling_price).toFixed(2)}
                  </Text>
                </View>
              );
            }}
            ListFooterComponent={
              digitalBillData.expense_detail ? (
                <View>
                  <View style={styles.footerView}>
                    <View style={styles.line} />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 7
                      }}
                    >
                      <View>
                        <Text weight="Medium" style={{ fontSize: 12 }}>
                          Total Amount:
                        </Text>
                        <Text style={{ fontSize: 11 }}>(Inclusive of Tax)</Text>
                      </View>

                      <Text weight="Medium" style={{ fontSize: 12 }}>
                        ₹{" "}
                        {parseFloat(
                          digitalBillData.before_discount_amount
                        ).toFixed(2)}
                      </Text>
                    </View>
                    {digitalBillData &&
                    digitalBillData.seller_discount &&
                    digitalBillData.seller_discount > 0 ? (
                      <View>
                        <View
                          style={{
                            marginTop: 5,
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}
                        >
                          <Text weight="Medium" style={{ fontSize: 12 }}>
                            Seller Discount
                          </Text>
                          <Text weight="Medium" style={{ fontSize: 12 }}>
                            ₹{" "}
                            {parseFloat(
                              digitalBillData.seller_discount
                            ).toFixed(2)}
                          </Text>
                        </View>
                        <View
                          style={{
                            marginTop: 5,
                            flexDirection: "row",
                            justifyContent: "space-between"
                          }}
                        >
                          <Text weight="Medium" style={{ fontSize: 12 }}>
                            Paid Amount
                          </Text>
                          <Text weight="Medium" style={{ fontSize: 12 }}>
                            ₹{" "}
                            {(
                              parseFloat(
                                digitalBillData.before_discount_amount
                              ) - parseFloat(digitalBillData.seller_discount)
                            ).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 7
                      }}
                    >
                      <Text weight="Medium" style={{ fontSize: 12 }}>
                        BinBill Cashback :
                      </Text>
                      <Text weight="Medium" style={{ fontSize: 12 }}>
                        ₹ {digitalBillData.cash_back}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, marginHorizontal: 14 }}>
                    Total Quantity : {digitalBillData.total_quantity}
                  </Text>

                  {/* <View style={styles.taxView}>
                    <View style={styles.taxInsideView}>
                      <Text style={{ fontSize: 10 }}>CGST = </Text>
                      {digitalBillData.expense_detail.map(item => {
                        return (
                          <Text style={{ fontSize: 10, flexWrap: "wrap" }}>
                            {_.round(item.non_tax_value, 2)} * {item.tax / 2} %
                            = {_.round(item.cgst_value, 2)}{" "}
                          </Text>
                        );
                      })}
                    </View>
                    <Text style={{ fontSize: 10, marginHorizontal: 7 }}>
                      Total CGST = ₹{" "}
                      {_.round(
                        _.sumBy(digitalBillData.expense_detail, "cgst_value"),
                        2
                      )}
                    </Text>
                    <View style={styles.taxInsideView}>
                      <Text style={{ fontSize: 10 }}>SGST = </Text>
                      {digitalBillData.expense_detail.map(item => {
                        return (
                          <Text style={{ fontSize: 10, flexWrap: "wrap" }}>
                            {_.round(item.non_tax_value, 2)} * {item.tax / 2} %
                            = {_.round(item.sgst_value, 2)}{" "}
                          </Text>
                        );
                      })}
                    </View>
                    <Text style={{ fontSize: 10, marginHorizontal: 7 }}>
                      Total SGST = ₹{" "}
                      {_.round(
                        _.sumBy(digitalBillData.expense_detail, "cgst_value"),
                        2
                      )}
                    </Text>
                  </View> */}
                  <View
                    style={{
                      flex: 1,
                      alignContent: "flex-end",
                      flexDirection: "column"
                    }}
                  >
                    <Text style={styles.footerText}>
                      *** This is a computer generated challan and signature is
                      not required
                    </Text>
                    <Text style={styles.footerText}>
                      E&OE: Powered by BinBill
                    </Text>
                  </View>
                </View>
              ) : null
            }
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  shopName: {
    fontSize: 16,
    color: colors.mainText
  },
  address: {
    fontSize: 12,
    // width: 235
    marginTop: 14,
    paddingHorizontal: 20
  },
  billDate: {
    flexDirection: "row",
    // width: 235 q ,
    justifyContent: "space-between"
  },
  image: {
    width: 50,
    height: 50
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryText,
    // width: 355,
    marginTop: 8
  },
  headerTitle: {
    fontSize: 10,
    color: "#777777",
    flex: 1
  },
  footerView: {
    flex: 1,
    borderBottomColor: "#dadada",
    borderBottomWidth: 1,
    marginHorizontal: 15,
    marginBottom: 0,
    paddingBottom: 5
  },
  taxView: { marginTop: 16, padding: 7, backgroundColor: "#f9f9f9" },
  taxInsideView: {
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    marginTop: 7,
    marginHorizontal: 7
  },
  taxText: { fontSize: 12, marginHorizontal: 7, paddingTop: 7 },
  footerText: {
    fontSize: 10,
    marginHorizontal: 7,
    alignSelf: "center",
    marginVertical: 7
  }
});

export default DigitalBillScreen;
