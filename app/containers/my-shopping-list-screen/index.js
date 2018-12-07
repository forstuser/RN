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
    };
  };

  state = {
    wishList: [],
    skuItemIdsCurrentlyModifying: [],
    isLoadingMySellers: false,
    sellers: [],
    showPlusMinusDelete: false,
    isModelShow: false,
    title: "",
    description: "",
    btnText: "",
    selectedSeller: null,
    showLoader: false,
    sellerIsLogout: false,
    collectAtStore: false
  };

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        const wishList = this.props.navigation.getParam("wishList", []);
        this.setState({ wishList });
        this.getMySellers();
      }
    );
  }

  onPlaceOrder = async () => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_PLACE_ORDER);
    const selectedSeller = this.props.navigation.getParam("selectedSeller", []);
    let sellerId = selectedSeller.id || 0;
    console.log("selectedSeller is ", selectedSeller);
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
    // all conditions here
    if (res.is_logged_out == true) {
      this.setState({
        isModelShow: true,
        sellerIsLogout: true,
        title: "Logged Out",
        description: `Oops! It seems that ${
          selectedSeller.seller_name
        } is not logged in at the moment. Please try to order later`,
        btnText: "OK"
      });
    } else if (
      !this.isShopClosed(res.shop_open_day, res.start_time, res.close_time)
    ) {
      this.setState({
        isModelShow: true,
        title: "Shop Closed",
        description: ` Store closed now. Revisit during open hours.`,
        btnText: "OK"
      });
    } else if (res.home_delivery == false) {
      this.setState({
        isModelShow: true,
        collectAtStore: true,
        title: "Order Online",
        description: `Oops,Home Delivery not available
      currently. Come back to Order later or proceed to Order Now &
      Collect at Store`,
        btnText: "Collect at Store"
      });
    } else if (res.home_delivery == true || collectAtStoreFlag == true)
      this.proceedToAddressScreen(selectedSeller);
  };

  // function for check shop is closed or not
  isShopClosed = (shop_open_day, start_time, close_time) => {
    let days = JSON.parse("[" + shop_open_day + "]");
    let startTime = moment(moment(start_time, ["h:mm A"])).format("HH:mm");
    let closeTime = moment(moment(close_time, ["h:mm A"])).format("HH:mm");
    let currentTime = moment(moment(moment(), ["h:mm A"])).format("HH:mm");
    return days.includes(moment().day()) &&
      (currentTime >= startTime && currentTime <= closeTime)
      ? true
      : false;
  };

  getMySellers = async () => {
    this.setState({
      isLoadingMySellers: true
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
        collectAtStoreFlag: collectAtStoreFlag
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
          collectAtStoreFlag: true
        });
      } catch (e) {
        console.log("error", e);
        showSnackbar({ text: e.message });
      } finally {
        this.setState({ showLoader: false });
      }
    }
  };

  orderNow = async () => {
    const selectedSeller = this.props.navigation.getParam("selectedSeller", []);
    this.setState({ isModelShow: false });
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
        collectAtStoreFlag: true
      });
    } catch (e) {
      console.log("error", e.message);
      return showSnackbar({ text: e.message });
    } finally {
      this.setState({ showLoader: false });
    }
  };

  orderLater = () => {
    this.setState({ isModelShow: false });
  };
  closeModal = () => {
    this.setState({ isModelShow: false });
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
      // isShareModalVisible,
      wishList,
      skuItemIdsCurrentlyModifying,
      isLoadingMySellers,
      sellers,
      isModelShow,
      title,
      description,
      btnText,
      sellerIsLogout,
      collectAtStore
    } = this.state;

    const selectedSeller = this.props.navigation.getParam("selectedSeller", []);
    console.log("selectedSellers in Shopping List__________: ", selectedSeller);
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
              measurementTypes={measurementTypes}
              selectedItems={wishList}
              skuItemIdsCurrentlyModifying={skuItemIdsCurrentlyModifying}
              changeIndexQuantity={this.changeIndexQuantity}
            />
          </View>
        )}
        {wishList.length > 0 && !isLoadingMySellers ? (
          this.state.sellers.length > 0 ? (
            <Button
              onPress={this.onPlaceOrder}
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
          isVisible={isModelShow}
          title={title}
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
              {description}
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
                text={btnText}
                onPress={collectAtStore ? this.orderNow : this.closeModal}
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
