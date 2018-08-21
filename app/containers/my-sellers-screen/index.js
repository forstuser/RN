import React from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

import { getMySellers } from "../../api";

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
                  style={{
                    ...defaultStyles.card,
                    margin: 10,
                    borderRadius: 10
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
                        />
                        <View
                          style={{
                            position: "absolute",
                            right: 10,
                            bottom: 0,
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: colors.success,
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Icon name="md-checkmark" color="#fff" size={12} />
                        </View>
                      </View>
                    </View>
                    <View style={{ padding: 12, paddingLeft: 0, flex: 1 }}>
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text weight="Bold" style={{ fontSize: 13 }}>
                            {item.name}
                          </Text>
                          <Text style={{ fontSize: 11 }}>John Smith</Text>
                        </View>
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
                            {`3\nOffers`}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 11 }}>Credit Due : </Text>
                        <Text style={{ fontSize: 11, color: colors.mainBlue }}>
                          Rs. {item.credit_total}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 11 }}>Points Earned : </Text>
                        <Text style={{ fontSize: 11, color: colors.mainBlue }}>
                          {item.loyalty_total}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      height: 30,
                      borderTopColor: "#d9d9d9",
                      borderTopWidth: 1
                    }}
                  >
                    <Text>Call</Text>
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
