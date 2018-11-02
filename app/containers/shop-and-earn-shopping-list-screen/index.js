import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  NativeModules
} from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";

import RNFetchBlob from "react-native-fetch-blob";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";

import { loginToApplozic, openChatWithSeller } from "../../applozic";

import {
  API_BASE_URL,
  getMySellers,
  getSkuReferenceData,
  placeOrder,
  addSkuItemToWishList
} from "../../api";
import StarRating from "react-native-star-rating";

import { Text, Button } from "../../elements";
import { colors, defaultStyles } from "../../theme";

import Modal from "../../components/modal";
import LoadingOverlay from "../../components/loading-overlay";
import QuantityPlusMinus from "../../components/quantity-plus-minus";
import Analytics from "../../analytics";

import SelectedItemsList from "./selected-items-list";
import { showSnackbar } from "../../utils/snackbar";
import { SCREENS, ORDER_TYPES, SELLER_TYPE_IDS } from "../../constants";
import { requestStoragePermission } from "../../android-permissions";

class ShopAndEarnShoppingList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "My Shopping List"
    };
  };

  state = {
    wishList: [],
    skuItemIdsCurrentlyModifying: [],
    isLoadingMySellers: false,
    isMySellersModalVisible: false,
    sellers: [],
    showPlusMinusDelete: false
  };

  componentDidMount() {
    const wishList = this.props.navigation.getParam("wishList", []);
    const measurementTypes = this.props.navigation.getParam(
      "measurementTypes",
      null
    );
    this.setState({ wishList, measurementTypes });
    this.getMySellers();
  }

  onNextPress = () => {
    // this.nextModal.hide();
    const { navigation } = this.props;
    const product = navigation.getParam("product", null);
    const cashbackJob = navigation.getParam("cashbackJob", null);
    const copies = navigation.getParam("copies", []);
    const purchaseDate = navigation.getParam("purchaseDate", null);
    const fixedCashback = navigation.getParam("fixedCashback", null);
    const amount = navigation.getParam("amount", null);
    const selectedItems = this.state.wishList;
    const isDigitallyVerified = navigation.getParam(
      "isDigitallyVerified",
      false
    );

    // if (selectedItems.length == 0) {
    //   return showSnackbar({ text: "Please select some items first" });
    // }

    this.props.navigation.push(SCREENS.CLAIM_CASHBACK_SELECT_SELLER_SCREEN, {
      product,
      cashbackJob,
      copies,
      purchaseDate,
      fixedCashback,
      amount,
      selectedItems,
      isDigitallyVerified
    });
  };

  getMySellers = async () => {
    this.setState({
      isLoadingMySellers: true
      //isMySellersModalVisible: true
    });
    try {
      const res = await getMySellers({ isFmcg: true, for_order: true });
      this.setState({ sellers: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoadingMySellers: false });
    }
  };

  // startChatWithSeller = async seller => {
  //   this.setState({ isMySellersModalVisible: false });
  //   const { user } = this.props;
  //   try {
  //     await loginToApplozic({ id: user.id, name: user.name });
  //     openChatWithSeller({ id: seller.id });
  //   } catch (e) {
  //     showSnackbar({ text: e.message });
  //   }
  // };

  shareWithWhatsapp = () => {
    //alert('Whatsapp');
  };

  proceedToAddressScreen = seller => {
    this.props.navigation.navigate(SCREENS.ADDRESS_SCREEN, {
      sellerId: seller.id,
      orderType: ORDER_TYPES.FMCG
    });
  };

  selectSellerForOrder = (seller, flag) => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_SELECT_SELLER);
    if (flag === true) return;
    // return showSnackbar({
    //   text: "Store closed now. Revisit during open hours."
    // });
    this.setState({
      isLoadingMySellers: true
    });
    this.props.navigation.navigate(SCREENS.ADDRESS_SCREEN, {
      sellerId: seller.id,
      orderType: ORDER_TYPES.FMCG
    });
    this.setState({
      isMySellersModalVisible: false
    });
  };

  openRedeemPointsScreen = seller => {
    this.props.navigation.navigate(SCREENS.MY_SELLERS_REDEEM_POINTS_SCREEN, {
      seller
    });
  };

  // changeIndexQuantity = (index, quantity) => {
  //   const { navigation } = this.props;
  //   navigation.state.params.changeIndexQuantity(
  //     index,
  //     quantity,
  //     ({ wishList, skuItemIdsCurrentlyModifying }) => {
  //       this.setState({ wishList, skuItemIdsCurrentlyModifying }, () => {
  //         this.props.navigation.setParams({
  //           showShareBtn: this.state.wishList.length > 0
  //         });
  //       });
  //     }
  //   );
  // };
  changeSkuItemQuantityInList = async (skuMeasurementId, quantity) => {
    const wishList = [...this.state.wishList];
    const idxOfItem = wishList.findIndex(
      listItem =>
        listItem.sku_measurement &&
        listItem.sku_measurement.id == skuMeasurementId
    );

    this.changeIndexQuantity(idxOfItem, quantity);
  };

  changeIndexQuantity = async (index, quantity, callBack = () => null) => {
    console.log("index,qu", index, quantity);
    const wishList = [...this.state.wishList];

    const skuItemIdsCurrentlyModifying = [
      ...this.state.skuItemIdsCurrentlyModifying
    ];

    const item = { ...wishList[index] };

    if (
      item.sku_measurement &&
      !skuItemIdsCurrentlyModifying.includes(item.sku_measurement.id)
    ) {
      skuItemIdsCurrentlyModifying.push(item.sku_measurement.id);
    }
    if (quantity <= 0) {
      item.quantity = 0;
    } else {
      item.quantity = quantity;
    }
    this.setState({ skuItemIdsCurrentlyModifying });
    callBack({ wishList, skuItemIdsCurrentlyModifying });
    delete item["sku_measurements"];
    try {
      await addSkuItemToWishList(item);
      if (quantity <= 0) {
        wishList.splice(index, 1);
      } else {
        wishList[index].quantity = quantity;
      }
      this.setState({ wishList });
      callBack({ wishList, skuItemIdsCurrentlyModifying });
    } catch (e) {
      console.log("wishlist error: ", e);
      showSnackbar({ text: e.message });
    } finally {
      if (item.sku_measurement) {
        const idx = skuItemIdsCurrentlyModifying.findIndex(
          id => id == item.sku_measurement.id
        );
        skuItemIdsCurrentlyModifying.splice(idx, 1);
        this.setState({ skuItemIdsCurrentlyModifying });
        callBack({ wishList, skuItemIdsCurrentlyModifying });
      }
    }
  };

  render() {
    const { navigation } = this.props;
    const {
      wishList,
      skuItemIdsCurrentlyModifying,
      isLoadingMySellers,
      sellers,
      isMySellersModalVisible,
      measurementTypes
    } = this.state;

    console.log("measurementTypes in index: ", measurementTypes);
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          ref={ref => (this.viewToShare = ref)}
          style={{ flex: 1, backgroundColor: "#fff" }}
        >
          <SelectedItemsList
            show={this.state.showPlusMinusDelete}
            measurementTypes={measurementTypes}
            selectedItems={wishList}
            skuItemIdsCurrentlyModifying={skuItemIdsCurrentlyModifying}
            changeIndexQuantity={this.changeIndexQuantity}
          />
        </View>

        <Modal
          isVisible={isMySellersModalVisible}
          title="Select Seller"
          onClosePress={() => this.setState({ isMySellersModalVisible: false })}
          style={{
            height: 500,
            backgroundColor: "#fff"
          }}
        >
          <View>
            <FlatList
              data={sellers}
              refreshing={isLoadingMySellers}
              onRefresh={this.getMySellers}
              renderItem={({ item }) => {
                let btnRedeemPoints = null;
                let flag = false;
                let currrentTime = moment();
                let day = currrentTime.day();
                let opening_days =
                  item.seller_details.basic_details.shop_open_day;
                let days = JSON.parse("[" + opening_days + "]");
                let closeTime = item.seller_details.basic_details.close_time;
                let startTime = item.seller_details.basic_details.start_time;
                let timeInFormat1 = moment(currrentTime, ["h:mm A"]);
                let timeInFormat2 = moment(timeInFormat1).format("HH:mm");
                let startTime1 = moment(startTime, ["h:mm A"]);
                let startTime2 = moment(startTime1).format("HH:mm");
                let closeTime1 = moment(closeTime, ["h:mm A"]);
                let closeTime2 = moment(closeTime1).format("HH:mm");
                if (
                  timeInFormat2 > closeTime2 ||
                  timeInFormat2 < startTime2 ||
                  item.is_logged_out === true ||
                  days.indexOf(day) == -1
                ) {
                  flag = true;
                }
                return (
                  <View>
                    {flag === true ? (
                      <View
                        style={{
                          zIndex: 2,
                          position: "absolute",
                          bottom: "40%",
                          left: "25%",
                          width: "70%"
                        }}
                      >
                        <Text
                          weight="Bold"
                          style={{
                            textAlign: "left",
                            padding: 10,
                            color: colors.danger
                          }}
                        >
                          Store closed now. Revisit during open hours.
                        </Text>
                      </View>
                    ) : null}
                    <View style={{ opacity: flag === true ? 0.2 : 1 }}>
                      <TouchableOpacity
                        onPress={() => this.selectSellerForOrder(item, flag)}
                        style={{
                          ...defaultStyles.card,
                          margin: 10,
                          borderRadius: 10,
                          overflow: "hidden",
                          backgroundColor: "#fff"
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row"
                          }}
                        >
                          <View style={{ padding: 12 }}>
                            <View zz>
                              <Image
                                style={{
                                  width: 68,
                                  height: 68,
                                  borderRadius: 34
                                }}
                                source={{
                                  uri:
                                    API_BASE_URL +
                                    `/consumer/sellers/${
                                      item.id
                                    }/upload/1/images/0`
                                }}
                              />
                              <View
                                style={{
                                  position: "absolute",
                                  right: 2,
                                  bottom: 2,
                                  width: 16,
                                  height: 16,
                                  borderRadius: 8,
                                  backgroundColor: item.rush_hours
                                    ? "red"
                                    : colors.success,
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              />
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "baseline",
                                marginTop: 8
                              }}
                            >
                              <StarRating
                                starColor={colors.yellow}
                                disabled={true}
                                maxStars={5}
                                rating={Number(item.ratings)}
                                halfStarEnabled={true}
                                starSize={11}
                                starStyle={{ marginHorizontal: 0 }}
                              />
                              <Text
                                weight="Medium"
                                style={{
                                  fontSize: 10,
                                  marginLeft: 2,
                                  color: colors.secondaryText
                                }}
                              >
                                ({item.ratings.toFixed(2)})
                              </Text>
                            </View>
                            {item.seller_details &&
                            item.seller_details.basic_details &&
                            item.seller_details.basic_details.home_delivery ? (
                              <Text
                                style={{
                                  color: "#208e07",
                                  fontSize: 6,
                                  marginTop: 6
                                }}
                              >
                                Home Delivery Available
                              </Text>
                            ) : null}

                            {item.seller_type_id ==
                              SELLER_TYPE_IDS.VERIFIED && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  backgroundColor: "green",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 70,
                                  height: 20,
                                  borderRadius: 3,
                                  marginTop: 10
                                }}
                              >
                                <Icon
                                  name="md-checkmark-circle-outline"
                                  color="#fff"
                                  size={13}
                                />
                                <Text
                                  weight="Bold"
                                  style={{
                                    color: "#fff",
                                    fontSize: 10,
                                    marginLeft: 5,
                                    marginTop: -2
                                  }}
                                >
                                  Verified
                                </Text>
                              </View>
                            )}
                          </View>
                          <View
                            style={{ padding: 12, paddingLeft: 0, flex: 1 }}
                          >
                            <View style={{ flexDirection: "row" }}>
                              <View
                                style={{ flex: 1, justifyContent: "center" }}
                              >
                                <Text weight="Bold" style={{ fontSize: 13 }}>
                                  {item.name}
                                </Text>
                                <Text style={{ fontSize: 11 }}>
                                  {item.owner_name}
                                </Text>
                              </View>
                              {/* {item.offer_count ? (
                            <View
                              style={{
                                width: 42,
                                height: 42
                              }}
                            >
                              <Image
                                style={{
                                  width: 42,
                                  height: 42,
                                  position: "absolute"
                                }}
                                source={require("../../images/offers_bg.png")}
                              />
                              <Text
                                weight="Bold"
                                style={{
                                  marginTop: 5,
                                  fontSize: 10,
                                  color: "#fff",
                                  textAlign: "center"
                                }}
                              >
                                {`${item.offer_count}\nOffers`}
                              </Text>
                            </View>
                          ) : null} */}
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center"
                              }}
                            >
                              <Text style={{ fontSize: 13 }}>
                                Credit Due :{" "}
                              </Text>
                              <View
                                // onPress={() =>
                                //   this.props.navigation.navigate(
                                //     SCREENS.MY_SELLERS_CREDIT_TRANSACTIONS_SCREEN,
                                //     { seller: item }
                                //   )
                                // }
                                //onPress={() => {}}
                                style={{
                                  flexDirection: "row",
                                  paddingVertical: 5,
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 13,
                                    color: colors.mainText
                                  }}
                                >
                                  Rs. {item.credit_total}
                                </Text>
                                {/* <Icon
                              name="md-information-circle"
                              size={15}
                              style={{ marginTop: 2, marginLeft: 5 }}
                            /> */}
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center"
                              }}
                            >
                              <Text style={{ fontSize: 13 }}>
                                Points Earned :{" "}
                              </Text>

                              <View
                                // onPress={() =>
                                //   this.props.navigation.navigate(
                                //     SCREENS.MY_SELLERS_POINTS_TRANSACTIONS_SCREEN,
                                //     { seller: item }
                                //   )
                                // }
                                //onPress={() => {}}
                                style={{
                                  flexDirection: "row",
                                  paddingVertical: 5,
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 13,
                                    color: colors.mainText
                                  }}
                                >
                                  {item.loyalty_total}
                                </Text>
                                {/* <Icon
                              name="md-information-circle"
                              size={15}
                              style={{ marginTop: 2, marginLeft: 5 }}
                            /> */}
                              </View>
                            </View>
                            {btnRedeemPoints}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </Modal>
        {wishList.length >= 0 && !isLoadingMySellers ? (
          this.state.sellers.length > 0 ? (
            <Button
              onPress={this.onNextPress}
              text="Next"
              color="secondary"
              style={{
                height: 50,
                width: 250,
                alignSelf: "center",
                marginBottom: 15
              }}
              textStyle={{ fontSize: 18 }}
            />
          ) : (
            <Text style={styles.noSellerText}>
              Please invite and add or simply add your nearby retailers to start
              placing order and avail multiple benefits
            </Text>
          )
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatOptionContainer: {
    alignItems: "center"
  },
  chatOption: {
    width: 88,
    height: 88,
    backgroundColor: "#f1f1f1",
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 15
  },
  chatImage: {
    width: 55,
    height: 55
  },
  bottomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff"
  },
  bottomButtonIcon: {
    fontSize: 18,
    marginRight: 5
  },
  bottomButtonText: {
    fontSize: 9
  },
  noSellerText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    color: colors.danger
  }
});

const mapStateToProps = state => {
  return {
    user: state.loggedInUser
  };
};

export default connect(mapStateToProps)(ShopAndEarnShoppingList);
