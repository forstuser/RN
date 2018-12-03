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
  placeOrder,
  getHomeDeliveryStatus
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

class MyShoppingList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const showShareBtn = navigation.getParam("showShareBtn", false);
    return {
      title: "My Shopping List"
      // headerRight: showShareBtn ? (
      //   <TouchableOpacity
      //     //onPress={navigation.state.params.onSharePress}
      //     onPress={navigation.state.params.onSharePressIcon}
      //     style={{ marginRight: 10, padding: 10 }}
      //   >
      //     <Icon name="md-share" size={25} color={colors.mainBlue} />
      //   </TouchableOpacity>
      // ) : null
    };
  };

  state = {
    isShareModalVisible: false,
    wishList: [],
    skuItemIdsCurrentlyModifying: [],
    isLoadingMySellers: false,
    isMySellersModalVisible: false,
    sellers: [],
    showPlusMinusDelete: false,
    isOrderOnline: false,
    selectedSeller: null,
    showLoader: false
  };

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        const wishList = this.props.navigation.getParam("wishList", []);
        this.setState({ wishList });

        this.getMySellers();

        this.props.navigation.setParams({
          onSharePressIcon: this.onSharePressIcon,
          showShareBtn: wishList.length > 0
        });
      }
    );
  }

  onSharePress = async () => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_PLACE_ORDER);
    const selectedSeller = this.props.navigation.getParam("selectedSeller", []);
    let sellerId = selectedSeller.id || 0;
    console.log("seller Id ", sellerId);
    const collectAtStoreFlag = this.props.navigation.getParam(
      "collectAtStoreFlag"
    );

    let res;
    try {
      res = await getHomeDeliveryStatus(sellerId);
      console.log("Home Delivery Status: ", res);
    } catch (error) {
      console.log(error.message);
    } finally {
      console.log("finally");
    }

    if (!selectedSeller) {
      this.setState({ isMySellersModalVisible: true });
    } else {
      if (res.home_delivery == true || collectAtStoreFlag == true)
        this.proceedToAddressScreen(selectedSeller);
      else this.setState({ isOrderOnline: true });
    }
    //this.getMySellers();
  };

  onSharePressIcon = async () => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_SHARE_ORDER);

    //this.setState({ isShareModalVisible: true });
    //console.log('Wishlist', this.state.wishList);
    this.setState({ showPlusMinusDelete: true });
    if (await requestStoragePermission()) {
      const filePath = RNFetchBlob.fs.dirs.DCIMDir + `/fact.jpg`;

      captureRef(this.viewToShare, {
        format: "jpg",
        quality: 0.8
      })
        .then(uri => {
          console.log("Image saved to", uri);
          return RNFetchBlob.fs.cp(uri, filePath);
        })
        .then(() => {
          console.log("Image saved to", filePath + "/fact.jpg");
          this.setState({ showPlusMinusDelete: false });
          return Share.open({
            url: `file://${filePath}`,
            message: `Powered by BinBill`
          });
        })
        .catch(error => console.error("Oops, snapshot failed", error));
    }
  };

  getMySellers = async () => {
    this.setState({
      isLoadingMySellers: true,
      isShareModalVisible: false
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

  proceedToAddressScreen = async seller => {
    const collectAtStoreFlag = this.props.navigation.getParam(
      "collectAtStoreFlag"
    );
    console.log(
      "collectAtStoreFlag in my shopping list___________",
      collectAtStoreFlag
    );
    if (collectAtStoreFlag == false) {
      this.props.navigation.navigate(SCREENS.ADDRESS_SCREEN, {
        sellerId: seller.id,
        orderType: ORDER_TYPES.FMCG,
        flag: collectAtStoreFlag
      });
    } else {
      this.setState({ showLoader: true });
      try {
        const res = await placeOrder({
          sellerId: seller.id,
          orderType: ORDER_TYPES.FMCG,
          collect_at_store: collectAtStoreFlag
        });
        const orderId = res.result.id;
        this.props.navigation.popToTop();
        this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
          orderId,
          flag: true
        });
      } catch (e) {
        console.log("error", e);
        showSnackbar({ text: e.message });
      } finally {
        this.setState({ showLoader: false });
      }
    }
  };

  selectSellerForOrder = (seller, flag) => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_SELECT_SELLER);
    this.setState({ selectedSeller: seller });
    if (flag === true) return;
    // return showSnackbar({
    //   text: "Store closed now. Revisit during open hours."
    // });
    this.setState({
      isLoadingMySellers: true
    });
    if (seller.seller_details.basic_details.home_delivery == true) {
      this.props.navigation.navigate(SCREENS.ADDRESS_SCREEN, {
        sellerId: seller.id,
        orderType: ORDER_TYPES.FMCG
      });
      this.setState({ isMySellersModalVisible: false });
    } else {
      this.setState({ isOrderOnline: true });
    }
  };
  orderNow = async () => {
    const selectedSeller = this.props.navigation.getParam("selectedSeller", []);

    // this.props.navigation.navigate(SCREENS.ADDRESS_SCREEN, {
    //   sellerId: selectedSeller.id,
    //   orderType: ORDER_TYPES.FMCG,
    //   flag: true
    // });
    this.setState({ isOrderOnline: false, isMySellersModalVisible: false });
    try {
      const res = await placeOrder({
        sellerId: selectedSeller.id,
        orderType: ORDER_TYPES.FMCG,
        collect_at_store: true
      });
      const orderId = res.result.id;
      this.props.navigation.popToTop();
      this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
        orderId,
        flag: true
      });
    } catch (e) {
      console.log("error", e.message);
      return showSnackbar({ text: e.message });
    } finally {
      this.setState({ showLoader: false });
    }
  };

  orderLater = () => {
    this.setState({ isOrderOnline: false });
  };
  closeModal = () => {
    this.setState({ isOrderOnline: false });
  };

  openRedeemPointsScreen = seller => {
    this.props.navigation.navigate(SCREENS.MY_SELLERS_REDEEM_POINTS_SCREEN, {
      seller
    });
  };

  changeIndexQuantity = (index, quantity) => {
    const { navigation } = this.props;
    navigation.state.params.changeIndexQuantity(
      index,
      quantity,
      ({ wishList, skuItemIdsCurrentlyModifying }) => {
        this.setState({ wishList, skuItemIdsCurrentlyModifying }, () => {
          this.props.navigation.setParams({
            showShareBtn: this.state.wishList.length > 0
          });
        });
      }
    );
  };

  render() {
    const { navigation } = this.props;
    //const measurementTypes = navigation.getParam("measurementTypes", []);

    const {
      isShareModalVisible,
      wishList,
      skuItemIdsCurrentlyModifying,
      isLoadingMySellers,
      sellers,
      isMySellersModalVisible,
      isOrderOnline
    } = this.state;

    console.log("wishList in index: ", wishList);
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 5 }}>
        {wishList.length == 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20
            }}
          >
            <Image
              style={{ width: 150, height: 150 }}
              source={require("../../images/blank_shopping_list.png")}
            />
            <Text
              weight="Medium"
              style={{
                textAlign: "center",
                fontSize: 16,
                marginVertical: 30,
                color: colors.secondaryText
              }}
            >
              {`You do not have a Shopping List.\n Start adding items to create your Shopping List.`}
            </Text>
            <Button
              onPress={() => navigation.goBack()}
              style={{ width: 250 }}
              text="Create Shopping List"
              color="secondary"
            />
          </View>
        ) : (
          <View
            ref={ref => (this.viewToShare = ref)}
            style={{ flex: 1, backgroundColor: "#fff" }}
          >
            <SelectedItemsList
              show={this.state.showPlusMinusDelete}
              //measurementTypes={measurementTypes}
              selectedItems={wishList}
              skuItemIdsCurrentlyModifying={skuItemIdsCurrentlyModifying}
              changeIndexQuantity={this.changeIndexQuantity}
            />
          </View>
        )}
        <Modal
          isVisible={isShareModalVisible}
          title="Share Via"
          onClosePress={() => this.setState({ isShareModalVisible: false })}
          style={{
            height: 200,
            backgroundColor: "#fff"
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                padding: 20,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View style={styles.chatOptionContainer}>
                <TouchableOpacity
                  style={styles.chatOption}
                  onPress={this.shareWithWhatsapp}
                >
                  <Image
                    source={require("../../images/whatsapp.png")}
                    style={styles.chatImage}
                  />
                </TouchableOpacity>
                <Text weight="Medium">WhatsApp</Text>
              </View>
            </View>
          </View>
        </Modal>
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
        {/* {this.state.sellers.length > 0 && wishList.length > 0 ? (
          <Button
            onPress={this.onSharePress}
            text="Place Order"
            color="secondary"
            style={{
              height: 50,
              width: 250,
              alignSelf: "center",
              marginBottom: 15
            }}
            textStyle={{ fontSize: 18 }}
          />
        ) : null}
        {this.state.sellers.length == 0 && wishList.length > 0 ? (
          <Text style={styles.noSellerText}>
            Please invite and add or simply add your nearby retailers to start
            placing order and avail multiple benefits
          </Text>
        ) : null} */}

        {wishList.length > 0 && !isLoadingMySellers ? (
          this.state.sellers.length > 0 ? (
            <Button
              onPress={this.onSharePress}
              text="Place Order"
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
              Please invite or add a nearby Seller in ‘My Seller’ section to
              Place Order or simply use this List to aid you in your next
              Shopping trip.
            </Text>
          )
        ) : null}
        <Modal
          isVisible={isOrderOnline}
          title="Order Online"
          style={{
            height: 350,
            ...defaultStyles.card
          }}
          onClosePress={this.closeModal}
        >
          <View
            style={{
              flex: 1,
              padding: 10,
              justifyContent: "center"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 13
              }}
            >
              <Image
                style={{ width: 90, height: 90 }}
                source={require("../../images/sad.png")}
              />
            </View>
            <Text
              style={{
                padding: 10,
                textAlign: "center",
                fontSize: 16,
                marginTop: 3,
                lineHeight: 23
              }}
            >
              <Text weight="Bold">Oops</Text>, Home Delivery not available
              currently. Come back to Order later or proceed to Order Now &
              Collect at Store
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {/* <Button
                text="Order Later"
                onPress={this.orderLater}
                style={{
                  width: 150,
                  alignSelf: "center",
                  marginRight: 5,
                  height: 40
                }}
                color="grey"
              /> */}
              <Button
                text="Collect At Store"
                onPress={this.orderNow}
                style={{
                  width: 150,
                  alignSelf: "center",

                  height: 40
                }}
                color="secondary"
              />
            </View>
          </View>
        </Modal>
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

export default connect(mapStateToProps)(MyShoppingList);
