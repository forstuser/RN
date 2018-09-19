import React from "react";
import { View, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import StarRating from "react-native-star-rating";

import { getMySellers } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import { SCREENS, API_BASE_URL, SELLER_TYPE_IDS } from "../../constants";

export default class SelectSellerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { onSkipPress, selectedSeller } = navigation.state.params;
    return {
      title: "Select Sellers",
      headerRight: !selectedSeller ? (
        <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={onSkipPress}
        >
          <Text style={{ color: colors.pinkishOrange }}>SKIP</Text>
        </TouchableOpacity>
      ) : null
    };
  };

  state = {
    sellers: [],
    isLoading: false,
    error: null,
    selectedSeller: null,
    isHomeDeliveryModalVisible: false
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onSkipPress: () => this.proceedToNextStep()
    });
    this.getMySellers();
  }

  getMySellers = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await getMySellers({hasPos:true});
      this.setState({ sellers: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  openRedeemPointsScreen = seller => {
    this.props.navigation.navigate(SCREENS.MY_SELLERS_REDEEM_POINTS_SCREEN, {
      seller
    });
  };


  selectSeller = seller => {
    if (
      this.state.selectedSeller &&
      this.state.selectedSeller.id == seller.id
    ) {
      this.setState({ selectedSeller: null });
      this.props.navigation.setParams({ selectedSeller: null });
    } else {
      this.setState({ selectedSeller: seller });
      this.props.navigation.setParams({ selectedSeller: seller });
    }
  };

  showHomeDeliveryModalVisible = () => {
    this.setState({ isHomeDeliveryModalVisible: true });
  };

  hideHomeDeliveryModalVisible = () => {
    this.setState({ isHomeDeliveryModalVisible: false });
  };

  proceedToNextStep = isHomeDelivered => {
    this.setState(() => ({ isHomeDeliveryModalVisible: false }));
    const { navigation } = this.props;
    const product = navigation.getParam("product", null);
    const cashbackJob = navigation.getParam("cashbackJob", null);
    const copies = navigation.getParam("copies", []);
    const purchaseDate = navigation.getParam("purchaseDate", null);
    const amount = navigation.getParam("amount", null);
    const isDigitallyVerified = navigation.getParam(
      "isDigitallyVerified",
      false
    );
    const selectedItems = navigation.getParam("selectedItems", []);
    const { selectedSeller } = this.state;

    this.props.navigation.push(SCREENS.CLAIM_CASHBACK_FINAL_SCREEN, {
      product,
      cashbackJob,
      copies,
      purchaseDate,
      amount,
      isDigitallyVerified,
      isHomeDelivered,
      selectedItems,
      selectedSeller
    });
  };

  render() {
    const {
      sellers,
      isLoading,
      error,
      selectedSeller,
      isHomeDeliveryModalVisible
    } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff"
        }}
      >
        <FlatList
          data={sellers}
          refreshing={isLoading}
          onRefresh={this.getMySellers}
          ListEmptyComponent={() => (
            <View
              style={{
                maxWidth: 300,
                alignSelf: "center",
                alignItems: "center",
                marginTop: 35
              }}
            >
              <Text style={{ textAlign: "center" }}>
                You have not added any Sellers. Please add your Seller in My
                Seller section to avail additional Seller benefits in future.
              </Text>
              <Button
                onPress={() => this.proceedToNextStep()}
                text="Next"
                color="secondary"
                style={{ height: 40, width: 140, marginTop: 30 }}
              />
            </View>
          )}
          renderItem={({ item }) => {
            const isSelected =
              selectedSeller && selectedSeller.id == item.id ? true : false;
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
              //   onPress={() => this.selectSeller(item)}
              //   style={{
              //     height: 90,
              //     ...defaultStyles.card,
              //     margin: 10,
              //     borderRadius: 10,
              //     padding: 15,
              //     flexDirection: "row",
              //     alignItems: "center"
              //   }}
              // >
              //   <View
              //     style={{
              //       borderColor: "#efefef",
              //       borderWidth: 1,
              //       width: 64,
              //       height: 64,
              //       borderRadius: 32,
              //       alignItems: "center",
              //       justifyContent: "center",
              //       marginRight: 10
              //     }}
              //   >
              //     <Icon
              //       name="md-checkmark"
              //       size={35}
              //       color={isSelected ? colors.success : "#efefef"}
              //     />
              //   </View>
              //   <Text weight="Bold">{item.name}</Text>
              // </TouchableOpacity>
              <TouchableOpacity
                    onPress={() => this.selectSeller(item)}
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
                    {/* <View
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
                    </View> */}
                  </TouchableOpacity>
            );
          }}
        />
        {selectedSeller ? (
          <Button
            onPress={this.showHomeDeliveryModalVisible}
            text="Send for Seller Approval & Proceed"
            color="secondary"
            borderRadius={0}
          />
        ) : null}
        <Modal
          isVisible={isHomeDeliveryModalVisible}
          useNativeDriver={true}
          onBackButtonPress={this.hideHomeDeliveryModalVisible}
          onBackdropPress={this.hideHomeDeliveryModalVisible}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: 280,
              height: 150,
              alignSelf: "center",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text weight="Medium" style={{ fontSize: 15, marginBottom: 20 }}>
              Did you avail Home Delivery?
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
                text="No"
                style={{ width: 100, height: 40 }}
                textStyle={{ fontSize: 12 }}
                color="secondary"
                type="outline"
                onPress={() => this.proceedToNextStep(false)}
              />
              <Button
                text="Yes"
                style={{ width: 100, height: 40 }}
                color="secondary"
                textStyle={{ fontSize: 12 }}
                onPress={() => this.proceedToNextStep(true)}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
