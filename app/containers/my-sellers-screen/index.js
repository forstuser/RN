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
import { defaultStyles } from "../../theme";
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
                    height: 90,
                    ...defaultStyles.card,
                    margin: 10,
                    borderRadius: 10,
                    padding: 15,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Text weight="Bold">{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </DrawerScreenContainer>
    );
  }
}
