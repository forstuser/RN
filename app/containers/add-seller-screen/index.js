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
import { defaultStyles, colors } from "../../theme";

import InviteSellerModal from "./invite-seller-modal";
import { showSnackbar } from "../../utils/snackbar";

export default class MySellersScreen extends React.Component {
  static navigationOptions = {
    title: "Search Seller"
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
    const { searchTerm } = this.state;
    if (searchTerm === undefined) {
      return showSnackbar({
        text: "Please enter either name or mobile number"
      });
    }
    if (!isNaN(searchTerm) && searchTerm.length < 10) {
      return showSnackbar({ text: "Please enter 10 digit mobile number" });
    }

    this.setState({
      isLoadingSellers: true
    });
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
      showSnackbar({ text: "You have added the seller successfully" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoadingSellers: false });
    }
  };

  onSearchTermChange = searchTerm => {
    //console.log('Search Term: ', searchTerm);
    this.setState({ searchTerm, isSearchDone: false }, () => {
      if (searchTerm.length == 10) {
        this.getSellers();
      }
    });
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
    //console.log("Search term __________________________", typeof(searchTerm));
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
            placeholder="Search Seller by name or mobile number"
            onChangeText={this.onSearchTermChange}
            returnKeyType="search"
            onSubmitEditing={this.getSellers}
            underlineColorAndroid="transparent"
            maxLength={10}
          />
          <Icon
            onPress={this.getSellers}
            name="ios-search"
            size={25}
            color="#ddd"
            style={{ marginRight: 10, padding: 10 }}
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
                  ) : (
                    <Text style={{ color: colors.success, fontSize: 10 }} />
                  )}
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
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    color: colors.secondaryText
                  }}
                >
                  {isSearchDone
                    ? `This seller is not in our network. Invite your Seller to avail additional Offers, faster Home Delivery, Credit Loyalty,Home Services, & Online Order convenience`
                    : `Search your seller by name or phone number`}
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
