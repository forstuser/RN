import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";
import call from "react-native-phone-call";
import { connect } from "react-redux";

import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";

import { loginToApplozic, openChatWithSeller } from "../../applozic";

import { API_BASE_URL, getMySellers, deleteSeller } from "../../api";

import { Text, Image, Button } from "../../elements";
import DrawerScreenContainer from "../../components/drawer-screen-container";
import Modal from "react-native-modal";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { defaultStyles, colors } from "../../theme";
import { SCREENS, SELLER_TYPE_IDS } from "../../constants";
import { showSnackbar } from "../../utils/snackbar";
import Analytics from "../../analytics";
import DeleteSellerModal from "./delete-seller-modal";

//import defaultPic from '../../images/default_seller_img.png';

class MySellersScreen extends React.Component {
  state = {
    mySellers: [],
    isLoadingMySellers: false,
    error: null,
    phoneNumbers: [],
    infoModalVisible: false,
    detailText: "test",
    isDeleteSeller: false
  };
  showInfoDetailsModal = text => {
    this.setState({ infoModalVisible: true, detailText: text });
  };

  hideInfoDetailsModal = () => {
    this.setState({ infoModalVisible: false });
  };
  componentDidMount() {
    // navigator.Geolocation.getCurrentPosition();
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_SELECT_ADDRESS);
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.getMySellers();
      }
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  getMySellers = async () => {
    this.setState({
      isLoadingMySellers: true,
      error: null
    });
    try {
      const res = await getMySellers();
      this.setState({ mySellers: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoadingMySellers: false });
    }
  };

  openAddSellerScreen = location => {
    this.props.navigation.navigate(SCREENS.ADD_SELLER_SCREEN, {
      city: location
    });
  };

  openRedeemPointsScreen = seller => {
    console.log("seller", seller);
    if (seller.loyalty_total == 0) {
      showSnackbar({
        text: "Sorry, you have not earned any loyalty points to be redeemed."
      });
    } else if (seller.minimum_points > seller.loyalty_total) {
      showSnackbar({
        text:
          "Sorry, you can only redeem once you receive a minimum of " +
          seller.minimum_points +
          " loyalty points."
      });
    } else {
      this.props.navigation.navigate(SCREENS.MY_SELLERS_REDEEM_POINTS_SCREEN, {
        seller
      });
    }
  };

  openCallOptions = seller => {
    if (seller.contact_no) {
      this.setState({ phoneNumbers: [seller.contact_no] }, () => {
        this.phoneOptions.show();
      });
    } else {
      showSnackbar({ text: "Phone number not available" });
    }
  };

  handlePhonePress = index => {
    if (index < this.state.phoneNumbers.length) {
      call({ number: this.state.phoneNumbers[index] }).catch(e =>
        showSnackbar({
          text: e.message
        })
      );
    }
  };

  startChatWithSeller = async seller => {
    this.setState({ isMySellersModalVisible: false });
    const { user } = this.props;
    try {
      await loginToApplozic({ id: user.id, name: user.name });
      openChatWithSeller({ id: seller.id });
    } catch (e) {
      showSnackbar({ text: e.message });
    }
  };

  orderOnline = seller => {
    console.log("seller from seller screen", seller);
    this.props.navigation.navigate(SCREENS.CREATE_SHOPPING_LIST_SCREEN, {
      seller: seller
    });
  };

  render() {
    const { navigation, user } = this.props;
    const {
      mySellers,
      isLoadingMySellers,
      phoneNumbers,
      error,
      infoModalVisible,
      detailText,
      isDeleteSeller
    } = this.state;
    if (error) {
      <ErrorOverlay error={error} onRetryPress={this.getMySellers} />;
    }

    return (
      <DrawerScreenContainer
        title="My Sellers"
        navigation={navigation}
        headerRight={
          <View
            style={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{ paddingHorizontal: 5 }}
              onPress={() => this.openAddSellerScreen(user.location)}
            >
              <Icon
                style={{}}
                name="ios-add-circle-outline"
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        }
      >
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={[
              { flexGrow: 1 },
              mySellers.length ? null : { justifyContent: "center" }
            ]}
            data={mySellers}
            refreshing={isLoadingMySellers}
            onRefresh={this.getMySellers}
            ListEmptyComponent={() =>
              !isLoadingMySellers ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20
                  }}
                >
                  <View
                    style={{
                      width: 150,
                      height: 150,
                      backgroundColor: "#f4f4f4",
                      borderRadius: 75,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Image
                      style={{ width: 68, height: 68 }}
                      source={require("../../images/sad_emoticon.png")}
                    />
                  </View>
                  <Text
                    style={{
                      marginTop: 40,
                      textAlign: "center",
                      fontSize: 16,
                      color: colors.secondaryText
                    }}
                  >
                    Add your Neighbourhood Sellers for better response in terms
                    of online orders, faster home delivery and attractive offers
                  </Text>
                  <Button
                    onPress={() => this.openAddSellerScreen(user.location)}
                    text="Add Seller Now"
                    color="secondary"
                    style={{ width: 260, marginTop: 40 }}
                  />
                </View>
              ) : null
            }
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
              btnRedeemPoints = (
                <Button
                  type="outline"
                  onPress={() => {
                    this.openRedeemPointsScreen(item);
                  }}
                  text="Redeem Points"
                  color="secondary"
                  style={{ height: 30, width: 105, marginTop: 10 }}
                  textStyle={{ fontSize: 11 }}
                />
              );
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate(
                      SCREENS.SELLER_DETAILS_SCREEN,
                      { seller: item }
                    )
                  }
                  style={{
                    ...defaultStyles.card,
                    margin: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#d3d3d3"
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
                          width: 70,
                          height: 70,
                          borderRadius: 34,
                          backgroundColor: "#eee",
                          alignItems: "center",
                          justifyContent: "center"
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
                            fontSize: 8,
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
                        {item.offer_count ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate(
                                SCREENS.SELLER_DETAILS_SCREEN,
                                { seller: item, openOffersTabOnStart: true }
                              )
                            }
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
                          </TouchableOpacity>
                        ) : null}
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>Credit Due : </Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              SCREENS.MY_SELLERS_CREDIT_TRANSACTIONS_SCREEN,
                              { seller: item }
                            )
                          }
                          style={{
                            flexDirection: "row",
                            paddingVertical: 5,
                            alignItems: "center"
                          }}
                        >
                          <Text
                            style={{ fontSize: 13, color: colors.mainBlue }}
                          >
                            Rs. {item.credit_total}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.showInfoDetailsModal(
                              "View your Credit Status with the Seller here. "
                            );
                          }}
                        >
                          <Icon
                            name="md-information-circle"
                            size={15}
                            style={{ marginTop: 2, marginLeft: 5 }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={{ fontSize: 13 }}>Points Earned : </Text>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              SCREENS.MY_SELLERS_POINTS_TRANSACTIONS_SCREEN,
                              { seller: item }
                            )
                          }
                          style={{
                            flexDirection: "row",
                            paddingVertical: 5,
                            alignItems: "center"
                          }}
                        >
                          <Text
                            style={{ fontSize: 13, color: colors.mainBlue }}
                          >
                            {item.loyalty_total}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.showInfoDetailsModal(
                              "Earned Loyalty Points on your purchases from this Seller."
                            );
                          }}
                        >
                          <Icon
                            name="md-information-circle"
                            size={15}
                            style={{ marginTop: 2, marginLeft: 5 }}
                          />
                        </TouchableOpacity>
                      </View>
                      {/* <TouchableOpacity
                        onPress={() => this.deleteSellerModal.show(item.id)}
                        style={{
                          marginTop: 3,
                          width: 80
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            textDecorationLine: "underline",
                            color: colors.mainBlue
                          }}
                        >
                          Delete Seller
                        </Text>
                      </TouchableOpacity> */}
                      <View flexDirection="row">
                        {/* {btnOnlineOrder} */}
                        {btnRedeemPoints}

                        {/* <View onStartShouldSetResponder={() => true}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={{
                            marginTop: 11,
                            paddingVertical: 5
                          }}
                        >
                          {item.categories.map(category => (
                            <View
                              style={{
                                height: 18,
                                borderColor: colors.pinkishOrange,
                                borderWidth: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 9,
                                paddingHorizontal: 7,
                                marginRight: 4
                              }}
                            >
                              <Text
                                style={{
                                  color: colors.pinkishOrange,
                                  fontSize: 8,
                                  marginTop: -3
                                }}
                              >
                                {category.category_4_name}
                              </Text>
                            </View>
                          ))}
                        </ScrollView>
                      </View> */}
                      </View>
                      <TouchableOpacity
                        onPress={() => this.deleteSellerModal.show(item.id)}
                        style={{
                          position: "absolute",
                          bottom: 10,
                          right: 10,
                          height: 30,
                          backgroundColor: "#fff",
                          width: 35,
                          borderWidth: 1,
                          borderColor: colors.pinkishOrange,
                          borderRadius: 15
                        }}
                      >
                        <Icon
                          style={{ marginLeft: 10, marginTop: 3 }}
                          name="md-trash"
                          size={20}
                          color={colors.pinkishOrange}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      height: 40,
                      backgroundColor: "#d9d9d9",
                      paddingTop: 1,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      overflow: "hidden"
                    }}
                  >
                    {item.is_fmcg === true && flag === false ? (
                      <TouchableOpacity
                        onPress={() => this.orderOnline(item)}
                        style={styles.bottomButton}
                      >
                        <Image
                          source={require("../../images/purchase.png")}
                          style={{ height: 17, width: 17, marginRight: 3 }}
                          resizeMode="contain"
                        />
                        <Text weight="Medium" style={styles.bottomButtonText}>
                          Order Online
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      onPress={() => this.openCallOptions(item)}
                      style={styles.bottomButton}
                    >
                      <Icon
                        name="ios-call-outline"
                        style={styles.bottomButtonIcon}
                        color={colors.pinkishOrange}
                      />
                      <Text weight="Medium" style={styles.bottomButtonText}>
                        Call
                      </Text>
                    </TouchableOpacity>
                    {item.seller_type_id == SELLER_TYPE_IDS.VERIFIED &&
                      item.is_assisted &&
                      item.assisted_services.length > 0 && (
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              SCREENS.MY_SELLERS_ASSISTED_SERVICES_SCREEN,
                              { seller: item }
                            )
                          }
                          style={[
                            styles.bottomButton,
                            { flex: 1.5, marginLeft: 1 }
                          ]}
                        >
                          <Icon
                            name="ios-construct-outline"
                            style={styles.bottomButtonIcon}
                            color={colors.pinkishOrange}
                          />
                          <Text weight="Medium" style={styles.bottomButtonText}>
                            Home Services
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <ActionSheet
            onPress={this.handlePhonePress}
            ref={o => (this.phoneOptions = o)}
            title={
              phoneNumbers.length > 0
                ? "Select a phone number"
                : "Phone Number Not Available"
            }
            cancelButtonIndex={phoneNumbers.length}
            options={[...phoneNumbers, "Cancel"]}
          />
          <DeleteSellerModal
            ref={node => {
              this.deleteSellerModal = node;
            }}
            getMySellers={this.getMySellers}
          />
          <Modal
            isVisible={infoModalVisible}
            useNativeDriver
            onBackButtonPress={this.hideInfoDetailsModal}
            onBackdropPress={this.hideInfoDetailsModal}
          >
            <View
              style={{
                backgroundColor: "#fff",
                height: 100,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                padding: 10
              }}
            >
              <Text>{detailText}</Text>
            </View>
          </Modal>
        </View>
      </DrawerScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  bottomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff",
    borderRightWidth: 2,
    borderRightColor: "#eee"
  },
  bottomButtonIcon: {
    fontSize: 20,
    marginRight: 5
  },
  bottomButtonText: {
    fontSize: 12
  }
});

const mapStateToProps = state => {
  return {
    user: state.loggedInUser
  };
};

export default connect(mapStateToProps)(MySellersScreen);
