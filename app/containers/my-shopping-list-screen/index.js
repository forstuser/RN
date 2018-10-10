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

import { API_BASE_URL, getMySellers, placeOrder } from "../../api";
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
      title: "My Shopping List",
      headerRight: showShareBtn ? (
        <TouchableOpacity
          //onPress={navigation.state.params.onSharePress}
          onPress={navigation.state.params.onSharePressIcon}
          style={{ marginRight: 10, padding: 10 }}
        >
          <Icon name="md-share" size={25} color={colors.mainBlue} />
        </TouchableOpacity>
      ) : null
    };
  };

  state = {
    isShareModalVisible: false,
    wishList: [],
    skuItemIdsCurrentlyModifying: [],
    isLoadingMySellers: false,
    isMySellersModalVisible: false,
    sellers: [],
    showPlusMinusDelete: false
  };

  componentDidMount() {
    const wishList = this.props.navigation.getParam("wishList", []);
    this.setState({ wishList });

    this.getMySellers();

    this.props.navigation.setParams({
      onSharePressIcon: this.onSharePressIcon,
      showShareBtn: wishList.length > 0
    });
  }

  onSharePress = () => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_PLACE_ORDER);
    const selectedSeller = this.props.navigation.getParam("selectedSeller", []);
    //console.log('selectedSellers ', selectedSellers);
    if (!selectedSeller) {
      this.setState({ isMySellersModalVisible: true });
    } else {
      this.proceedToAddressScreen(selectedSeller);
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

  proceedToAddressScreen = seller => {
    this.props.navigation.navigate(SCREENS.ADDRESS_SCREEN, {
      sellerId: seller.id,
      orderType: ORDER_TYPES.FMCG
    });
  };

  selectSellerForOrder = (seller, flag) => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_SELECT_SELLER);
    if (flag === true)
      return showSnackbar({
        text: "Store closed now. Revisit during open hours."
      });
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
    const measurementTypes = navigation.getParam("measurementTypes", []);

    const {
      isShareModalVisible,
      wishList,
      skuItemIdsCurrentlyModifying,
      isLoadingMySellers,
      sellers,
      isMySellersModalVisible
    } = this.state;

    console.log("measurementTypes in index: ", measurementTypes);
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
              measurementTypes={measurementTypes}
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
                let currrentTime = new Date();
                let timeInFormat = currrentTime.toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true
                });

                let closeTime = item.seller_details.basic_details.close_time;
                let startTime = item.seller_details.basic_details.start_time;
                console.log(
                  "Close Time__________________",
                  moment(closeTime, ["h:mm A"]).format("HH:mm")
                );
                console.log(
                  "Current Time__________________",
                  moment(timeInFormat, ["h:mm A"]).format("HH:mm")
                );
                if (
                  moment(timeInFormat, ["h:mm A"]).format("HH:mm") >
                    moment(closeTime, ["h:mm A"]).format("HH:mm") ||
                  moment(timeInFormat, ["h:mm A"]).format("HH:mm") <
                    moment(startTime, ["h:mm A"]).format("HH:mm") ||
                  item.is_logged_out === true
                ) {
                  flag = true;
                }
                console.log("Flag____________________:", flag);
                return (
                  <TouchableOpacity
                    onPress={() => this.selectSellerForOrder(item, flag)}
                    style={{
                      ...defaultStyles.card,
                      margin: 10,
                      borderRadius: 10,
                      overflow: "hidden",
                      backgroundColor: flag === true ? "#777" : "#fff"
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row"
                      }}
                    >
                      <View style={{ padding: 12 }}>
                        <View
                          style={{
                            width: 68,
                            height: 68,
                            borderRadius: 34,
                            backgroundColor: "#eee"
                          }}
                        >
                          <Image
                            style={{
                              width: 68,
                              height: 68,
                              borderRadius: 34
                            }}
                            source={{
                              uri:
                                API_BASE_URL +
                                `/consumer/sellers/${item.id}/upload/1/images/0`
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
                              backgroundColor:
                                item.is_logged_out === true
                                  ? "#ddd"
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

                        {item.seller_type_id == SELLER_TYPE_IDS.VERIFIED && (
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
                      <View style={{ padding: 12, paddingLeft: 0, flex: 1 }}>
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 1, justifyContent: "center" }}>
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
                          <Text style={{ fontSize: 13 }}>Credit Due : </Text>
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
                              style={{ fontSize: 13, color: colors.mainText }}
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
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text style={{ fontSize: 13 }}>Points Earned : </Text>

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
                              style={{ fontSize: 13, color: colors.mainText }}
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
                );
              }}
            />
          </View>
        </Modal>
        {this.state.sellers.length > 0 && wishList.length > 0 ? (
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

export default connect(mapStateToProps)(MyShoppingList);
