import React from "react";
import { View, TouchableOpacity, FlatList, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import StarRating from "react-native-star-rating";
import Analytics from "../../analytics";

import { getMySellers } from "../../api";
import { Text, Button, Image } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import { SCREENS, API_BASE_URL, SELLER_TYPE_IDS } from "../../constants";

export default class SelectSellerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { onSkipPress, selectedSeller } = navigation.state.params;
    return {
      title: "Select Seller",
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
      onSkipPress: () => {
        Analytics.logEvent(Analytics.EVENTS.CASHBACK_SELLER_SKIP);
        this.proceedToNextStep();
      }
    });
    this.getMySellers();
  }

  getMySellers = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await getMySellers({ hasPos: true, for_claim: true });
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
    Analytics.logEvent(Analytics.EVENTS.CASHBACK_SELLER_SELECT);

    const { selectedSeller } = this.state;

    if (selectedSeller.seller_type_id == SELLER_TYPE_IDS.VERIFIED) {
      this.setState({ isHomeDeliveryModalVisible: true });
    } else {
      this.proceedToNextStep();
    }
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
        {this.state.sellers.length > 0 ? (
          <View style={{ backgroundColor: "#fcf3d0" }}>
            <Text
              weight="Bold"
              style={{
                fontSize: 14,
                color: colors.mainText,
                textAlign: "center",
                marginTop: 10,
                padding: 10
              }}
            >
              Select Seller for this purchase, or if the Seller is not listed
              here, Skip.
            </Text>
          </View>
        ) : null}
        <FlatList
          data={sellers}
          refreshing={isLoading}
          onRefresh={this.getMySellers}
          ListEmptyComponent={() => {
            if (isLoading) return null;
            return (
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
            );
          }}
          renderItem={({ item }) => {
            const isSelected =
              selectedSeller && selectedSeller.id == item.id ? true : false;

            return (
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
                        <Text style={{ fontSize: 11 }}>{item.owner_name}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ fontSize: 13 }}>Credit Due : </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          paddingVertical: 5,
                          alignItems: "center"
                        }}
                      >
                        <Text style={{ fontSize: 13, color: colors.mainText }}>
                          Rs. {item.credit_total}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ fontSize: 13 }}>Points Earned : </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          paddingVertical: 5,
                          alignItems: "center"
                        }}
                      >
                        <Text style={{ fontSize: 13, color: colors.mainText }}>
                          {item.loyalty_total}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {isSelected && (
                  <View
                    style={{
                      flexDirection: "row",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding: 14,
                      backgroundColor: "rgba(0,0,0,.5)"
                    }}
                  >
                    <View
                      style={{
                        borderColor: "#efefef",
                        borderWidth: 1,
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10
                      }}
                    >
                      <Icon
                        name="md-checkmark"
                        size={35}
                        color={colors.success}
                      />
                    </View>
                  </View>
                )}
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
              height: 175,
              alignSelf: "center",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text weight="Medium" style={{ fontSize: 15, marginBottom: 20 }}>
              Did you avail Home Delivery?
            </Text>
            <Text
              weight="Medium"
              style={{
                textAlign: "center",
                fontSize: 14,
                marginBottom: 20,
                fontStyle: "italic"
              }}
            >
              (We incentivise your seller for every Home Delivery.)
            </Text>
            <Image
              source={require("../../images/happy.png")}
              style={{ marginTop: -13, height: 20, width: 20 }}
              resizeMode="contain"
            />
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
