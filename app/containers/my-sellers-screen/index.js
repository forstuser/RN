import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";

import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

import { API_BASE_URL, getMySellers } from "../../api";

import { Text, Image, Button } from "../../elements";
import DrawerScreenContainer from "../../components/drawer-screen-container";

import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { defaultStyles, colors } from "../../theme";
import { SCREENS } from "../../constants";

export default class MySellersScreen extends React.Component {
  state = {
    mySellers: [],
    isLoadingMySellers: false,
    error: null
  };

  componentDidMount() {
    this.getMySellers();
  }

  getMySellers = async () => {
    this.setState({
      isLoadingMySellers: true
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

  openAddSellerScreen = () => {
    this.props.navigation.navigate(SCREENS.ADD_SELLER_SCREEN);
  };

  render() {
    const { navigation } = this.props;
    const { mySellers, isLoadingMySellers } = this.state;

    console.log("mySellers: ", mySellers);

    return (
      <DrawerScreenContainer
        title="My Sellers"
        navigation={navigation}
        headerRight={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{ paddingHorizontal: 5 }}
              onPress={this.openAddSellerScreen}
            >
              <Icon
                style={{ marginTop: 1 }}
                name="ios-add-circle-outline"
                size={22}
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
                  <Text style={{ marginTop: 40, textAlign: "center" }}>
                    You have not added any Sellers as yet. Add your Seller to
                    avail additional benefits from Seller.
                  </Text>
                  <Button
                    text="Add Seller Now"
                    color="secondary"
                    style={{ width: 260, marginTop: 40 }}
                  />
                </View>
              ) : null
            }
            renderItem={({ item }) => {
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
                    overflow: "hidden"
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row"
                    }}
                  >
                    <View style={{ padding: 12 }}>
                      <View style={{}}>
                        <Image
                          style={{
                            width: 68,
                            height: 68,
                            borderRadius: 35,
                            backgroundColor: "#eee"
                          }}
                          source={{ uri: API_BASE_URL + item.image }}
                        />
                        <View
                          style={{
                            position: "absolute",
                            right: 10,
                            bottom: 0,
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: item.is_onboarded
                              ? colors.success
                              : colors.danger,
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Icon
                            name={
                              item.is_onboarded ? "md-checkmark" : "md-remove"
                            }
                            color="#fff"
                            size={12}
                          />
                        </View>
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
                          rating={Number(3.5)}
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
                      {!item.is_service ? (
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
                    </View>
                    <View style={{ padding: 12, paddingLeft: 0, flex: 1 }}>
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text weight="Bold" style={{ fontSize: 13 }}>
                            {item.name}
                          </Text>
                          <Text style={{ fontSize: 11 }}>John Smith</Text>
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

                      <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <Text style={{ fontSize: 11 }}>Credit Due : </Text>
                        <Text style={{ fontSize: 11, color: colors.mainBlue }}>
                          Rs. {item.credit_total}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <Text style={{ fontSize: 11 }}>Points Earned : </Text>
                        <Text style={{ fontSize: 11, color: colors.mainBlue }}>
                          {item.loyalty_total}
                        </Text>
                      </View>
                      <Button
                        text="Redeem Points"
                        color="secondary"
                        style={{ height: 30, width: 115, marginTop: 10 }}
                        textStyle={{ fontSize: 11 }}
                      />
                      <ScrollView>
                        {item.categories.map(category => (
                          <View>
                            <Text>{String(category)}</Text>
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
                    <TouchableOpacity style={styles.bottomButton}>
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
                    <TouchableOpacity style={styles.bottomButton}>
                      <Icon
                        name="ios-construct-outline"
                        style={styles.bottomButtonIcon}
                        color={colors.pinkishOrange}
                      />
                      <Text weight="Medium" style={styles.bottomButtonText}>
                        Assisted Services
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
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
