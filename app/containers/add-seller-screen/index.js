import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  TextInput
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import ScrollableTabView, {
  ScrollableTabBar
} from "react-native-scrollable-tab-view";

import { getSellers, getMySellers, linkSeller } from "../../api";

import { Text, Image, Button } from "../../elements";
import DrawerScreenContainer from "../../components/drawer-screen-container";

import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { defaultStyles } from "../../theme";

import InviteSellerModal from "./invite-seller-modal";
import { showSnackbar } from "../../utils/snackbar";

export default class MySellersScreen extends React.Component {
  static navigationOptions = {
    title: "Add Seller"
  };

  state = {
    mySellers: [],
    sellers: [],
    isLoadingMySellers: false,
    isLoadingSellers: false,
    error: null,
    isSearchDone: false
  };

  componentDidMount() {
    this.getMySellers();
  }

  getSellers = async () => {
    this.setState({
      isLoadingSellers: true
    });

    const { searchTerm } = this.state;
    try {
      const res = await getSellers({ searchTerm });
      this.setState({ sellers: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoadingSellers: false, isSearchDone: true });
    }
  };

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

  linkSeller = async seller => {
    try {
      this.setState({ isLoadingSellers: true });
      await linkSeller(seller.id);
      this.setState({ mySellers: [...this.state.mySellers, seller] });
      showSnackbar({ text: "Seller added to my sellers" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoadingSellers: false });
    }
  };

  render() {
    const { navigation } = this.props;
    const {
      mySellers,
      sellers,
      isLoadingMySellers,
      isLoadingSellers,
      searchTerm,
      isSearchDone
    } = this.state;

    console.log("sellers: ", sellers);

    const mySellersIds = mySellers.map(seller => seller.id);

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            ...defaultStyles.card,
            margin: 10,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <TextInput
            style={{
              flex: 1,
              height: 36,
              padding: 10
            }}
            value={searchTerm}
            placeholder="Search Seller by mobile number"
            onChangeText={searchTerm =>
              this.setState({ searchTerm, isSearchDone: false })
            }
            returnKeyType="search"
            onSubmitEditing={this.getSellers}
            underlineColorAndroid="transparent"
          />
          <Icon
            name="ios-search"
            size={25}
            color="#ddd"
            style={{ marginRight: 10 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={sellers}
            refreshing={isLoadingSellers}
            onRefresh={this.getSellers}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    ...defaultStyles.card,
                    marginHorizontal: 10,
                    marginVertical: 5,
                    borderRadius: 10,
                    padding: 15
                  }}
                >
                  <Text weight="Bold" style={{ fontSize: 13 }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 11, marginVertical: 5 }}>
                    {item.contact_no}
                  </Text>
                  <Text style={{ fontSize: 11 }}>{item.address}</Text>
                  {!mySellersIds.includes(item.id) ? (
                    <Button
                      onPress={() => this.linkSeller(item)}
                      text="Add Seller"
                      color="secondary"
                      style={{ width: 150, marginTop: 25, height: 40 }}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  padding: 20
                }}
              >
                <Text style={{ fontSize: 11, textAlign: "center" }}>
                  {isSearchDone
                    ? `Your Seller is not in our network currently. Please invite
                  seller to avail additional benefits.`
                    : `Search your seller by phone number`}
                </Text>
                {isSearchDone ? (
                  <Button
                    onPress={() => this.inviteSellerModal.show(searchTerm)}
                    text="Invite Seller"
                    color="secondary"
                    style={{ width: 150, marginTop: 25, height: 40 }}
                  />
                ) : null}
              </View>
            )}
          />
        </View>
        <InviteSellerModal
          ref={node => {
            this.inviteSellerModal = node;
          }}
        />
      </View>
    );
  }
}
