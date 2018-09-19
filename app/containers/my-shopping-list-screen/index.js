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
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";

import { loginToApplozic, openChatWithSeller } from "../../applozic";

import { API_BASE_URL, getMySellers, placeOrder } from "../../api";
import StarRating from "react-native-star-rating";

import { Text, Button } from "../../elements";
import { colors, defaultStyles } from "../../theme";

import Modal from "../../components/modal";
import LoadingOverlay from "../../components/loading-overlay";
import QuantityPlusMinus from "../../components/quantity-plus-minus";

import SelectedItemsList from "./selected-items-list";
import { showSnackbar } from "../../utils/snackbar";
import { SCREENS, ORDER_TYPES, SELLER_TYPE_IDS } from "../../constants";

class MyShoppingList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const showShareBtn = navigation.getParam("showShareBtn", false);
    return {
      title: "My Shopping List",
      headerRight: showShareBtn ? (
        <TouchableOpacity
          onPress={navigation.state.params.onSharePress}
          style={{ marginRight: 20 }}
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
    sellers: []
  };

  componentDidMount() {
    const wishList = this.props.navigation.getParam("wishList", []);
    this.setState({ wishList });

    this.props.navigation.setParams({
      onSharePress: this.onSharePress,
      showShareBtn: wishList.length > 0
    });
  }

  onSharePress = () => {
    // this.setState({ isMySellersModalVisible: true });
    this.getMySellers();
  };

  getMySellers = async () => {
    this.setState({
      isLoadingMySellers: true,
      isShareModalVisible: false,
      isMySellersModalVisible: true
    });
    try {
      const res = await getMySellers();
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

  selectSellerForOrder = seller => {
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

    console.log("measurementTypes: ", measurementTypes);

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
              style={{ textAlign: "center", fontSize: 15, marginVertical: 30 }}
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
          <SelectedItemsList
            measurementTypes={measurementTypes}
            selectedItems={wishList}
            skuItemIdsCurrentlyModifying={skuItemIdsCurrentlyModifying}
            changeIndexQuantity={this.changeIndexQuantity}
          />
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

              <View style={styles.chatOptionContainer}>
                <TouchableOpacity
                  onPress={this.getMySellers}
                  style={styles.chatOption}
                >
                  <Image
                    source={require("../../images/chat.png")}
                    style={styles.chatImage}
                  />
                </TouchableOpacity>
                <Text weight="Medium">Chat</Text>
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
                if (
                  item.loyalty_total > item.minimum_points &&
                  item.loyalty_total > 0
                )
                  btnRedeemPoints = (
                    <Button
                      onPress={() => {
                        this.openRedeemPointsScreen(item);
                      }}
                      text="Redeem Points"
                      color="secondary"
                      style={{ height: 30, width: 115, marginTop: 10 }}
                      textStyle={{ fontSize: 11 }}
                    />
                  );
                return (
                  // <TouchableOpacity
                  //   onPress={() => this.selectSellerForOrder(item)}
                  //   style={{
                  //     height: 80,
                  //     ...defaultStyles.card,
                  //     margin: 10,
                  //     borderRadius: 10,
                  //     padding: 15,
                  //     flexDirection: "row",
                  //     alignItems: "center"
                  //   }}
                  // >
                  //   <Text weight="Bold">{item.name}</Text>
                  // </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.selectSellerForOrder(item)}
                    style={{
                      ...defaultStyles.card,
                      margin: 10,
                      borderRadius: 10,
                      overflow: "hidden"
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
                            ({item.ratings})
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
                          {item.offer_count ? (
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
                            <Icon
                              name="md-information-circle"
                              size={15}
                              style={{ marginTop: 2, marginLeft: 5 }}
                            />
                          </TouchableOpacity>
                        </View>
                        {btnRedeemPoints}
                        <ScrollView horizontal style={{ marginTop: 11 }}>
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
                                {category.category_name}
                              </Text>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        height: 30,
                        backgroundColor: "#d9d9d9",
                        paddingTop: 1
                      }}
                    >
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
                      <TouchableOpacity
                        onPress={() => this.startChatWithSeller(item)}
                        style={[styles.bottomButton, { marginHorizontal: 1 }]}
                      >
                        <Icon
                          name="ios-chatbubbles-outline"
                          style={styles.bottomButtonIcon}
                          color={colors.pinkishOrange}
                        />
                        <Text weight="Medium" style={styles.bottomButtonText}>
                          Chat
                        </Text>
                      </TouchableOpacity>
                      {item.seller_type_id == SELLER_TYPE_IDS.VERIFIED && (
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              SCREENS.MY_SELLERS_ASSISTED_SERVICES_SCREEN,
                              { seller: item }
                            )
                          }
                          style={styles.bottomButton}
                        >
                          <Icon
                            name="ios-construct-outline"
                            style={styles.bottomButtonIcon}
                            color={colors.pinkishOrange}
                          />
                          <Text weight="Medium" style={styles.bottomButtonText}>
                            Assisted Services
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
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
  }
});

const mapStateToProps = state => {
  return {
    user: state.loggedInUser
  };
};

export default connect(mapStateToProps)(MyShoppingList);
