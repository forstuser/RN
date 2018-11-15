import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Picker
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
import InviteSellerNameModal from "./invite-seller-name";
import AddSellerHeader from "./add-seller-header";
import { SCREENS } from "../../constants";
import LinearGradient from "react-native-linear-gradient";

export default class MySellersScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    mySellers: [],
    sellers: [],
    isLoadingMySellers: false,
    isLoadingSellers: false,
    error: null,
    isSearchDone: false,
    location: null,
    searchTerm: "",
    userDetails: null,
    selectedAddress: null,
    addresses: []
  };

  componentWillMount() {
    let city = this.props.navigation.getParam("city", null);
    this.setState({ location: city });
    let userProfile = this.props.navigation.getParam("userDetails", null);
    this.setState({ userDetails: userProfile });
    if (
      userProfile &&
      userProfile.addresses &&
      userProfile.addresses.length > 0
    ) {
      this.setState({ selectedAddress: userProfile.addresses[0] }, () =>
        this.getSellersFromDropDown()
      );
    }
  }

  getSellers = async () => {
    const { searchTerm, location, selectedAddress } = this.state;
    const latitude = selectedAddress.latitude;
    const longitude = selectedAddress.longitude;
    if (searchTerm === undefined || searchTerm === "") {
      if (location != "Gurgaon")
        return showSnackbar({
          text: "Please enter either name or mobile number"
        });
    } else if (!isNaN(searchTerm) && searchTerm.length < 10) {
      return showSnackbar({ text: "Please enter 10 digit mobile number" });
    }
    this.setState({
      isLoadingSellers: true
    });
    try {
      let res;
      if (
        location == "Gurgaon" &&
        (searchTerm === undefined || searchTerm === "")
      ) {
        res = await getSellers({ is_default: true, latitude, longitude });
      } else {
        res = await getSellers({
          searchTerm,
          is_default: false,
          latitude,
          longitude
        });
      }
      this.setState({ sellers: res.result });
    } catch (error) {
      return showSnackbar({ text: "Something went wrong. Please try again." });
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
    this.setState({ searchTerm, isSearchDone: false }, () => {
      if (!isNaN(searchTerm) && searchTerm.length == 10) {
        this.getSellers();
      } else if (isNaN(searchTerm)) {
        this.getSellers();
      } else if (searchTerm.length === 0) {
        this.getSellersFromDropDown();
      }
    });
  };

  getSellersFromDropDown = async () => {
    const { selectedAddress } = this.state;
    const latitude = selectedAddress.latitude;
    const longitude = selectedAddress.longitude;
    this.setState({
      isLoadingSellers: true
    });
    const res = await getSellers({ latitude, longitude });
    this.setState({ sellers: res.result, isLoadingSellers: false });
  };

  render() {
    const { navigation } = this.props;
    const {
      mySellers,
      sellers,
      isLoadingMySellers,
      isLoadingSellers,
      searchTerm,
      isSearchDone,
      userDetails,
      selectedAddress,
      isloading
    } = this.state;

    const mySellersIds = mySellers.map(seller => seller.id);
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1 }}>
          {/* <AddSellerHeader navigation={navigation} user={userDetails} /> */}
          <View style={styles.container}>
            <LinearGradient
              start={{ x: 0.0, y: 0 }}
              end={{ x: 0.0, y: 1 }}
              colors={[colors.mainBlue, colors.aquaBlue]}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
            />
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name="md-arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            {!userDetails ? (
              <Text weight="Bold" style={styles.heading}>
                Search Seller
              </Text>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    width: 250,
                    height: 25,
                    backgroundColor: "#fff",

                    borderRadius: 10
                  }}
                >
                  <Picker
                    mode="dropdown"
                    selectedValue={
                      selectedAddress
                        ? selectedAddress
                        : userDetails.addresses[0]
                    }
                    style={{
                      height: 25,
                      width: 250,
                      //backgroundColor: "#fff",
                      color: colors.pinkishOrange
                    }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ selectedAddress: itemValue }, () =>
                        this.getSellersFromDropDown()
                      )
                    }
                  >
                    {userDetails.addresses.map(address => (
                      <Picker.Item
                        label={
                          address.address_line_1
                            ? address.address_line_1
                                .concat(", ")
                                .concat(address.address_line_2)
                            : address.address_line_2
                        }
                        value={address}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </View>
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
                    <Text style={{ fontSize: 11, marginTop: 5 }}>
                      Contact no. - {item.contact_no}
                    </Text>
                    {item.city ? (
                      <Text style={{ fontSize: 11, marginTop: 5 }}>
                        City - {item.city.name}
                      </Text>
                    ) : null}
                    {item.location ? (
                      <Text style={{ fontSize: 11, marginTop: 5 }}>
                        Locality - {item.location.name}
                      </Text>
                    ) : null}
                    <Text style={{ fontSize: 11, marginTop: 5 }}>
                      Address - {item.address}
                    </Text>
                    {!mySellersIds.includes(item.id) ? (
                      <Button
                        onPress={() => this.linkSeller(item)}
                        text="Add Seller"
                        color="secondary"
                        style={{ width: 150, marginTop: 25, height: 40 }}
                      />
                    ) : (
                      <Text
                        style={{
                          color: colors.success,
                          fontSize: 14,
                          marginTop: 15
                        }}
                      >
                        Already added
                      </Text>
                    )}
                    <View style={{ position: "absolute", top: 20, right: 10 }}>
                      <Text>
                        {item.distance ? item.distance : null}{" "}
                        <Text>
                          {item.distanceMetrics ? item.distanceMetrics : null}{" "}
                        </Text>
                        <Text>
                          {item.distance && item.distanceMetrics
                            ? "away"
                            : null}
                        </Text>
                      </Text>
                    </View>
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
                      ? `This seller is not in our network. Invite your Seller to avail additional Offers, faster Home Delivery, Credit Loyalty, Home Services, & Online Order convenience`
                      : !isLoadingMySellers
                        ? `Search your seller by name or mobile number`
                        : null}
                  </Text>
                  {isSearchDone ? (
                    <Button
                      onPress={
                        !isNaN(searchTerm)
                          ? () => this.inviteSellerModal.show(searchTerm)
                          : () => this.inviteSellerNameModal.show(searchTerm)
                      }
                      text="Invite Seller"
                      color="secondary"
                      style={{ width: 150, marginTop: 25, height: 40 }}
                    />
                  ) : null}
                </View>
              )}
            />
          </View>
        </View>
        <InviteSellerModal
          ref={node => {
            this.inviteSellerModal = node;
          }}
        />
        <InviteSellerNameModal
          ref={node => {
            this.inviteSellerNameModal = node;
          }}
        />
        <LoadingOverlay visible={isloading} />
      </View>
    );
  }
}

const styles = {
  container: {
    height: 50
  },
  backIcon: {
    padding: 10,
    position: "absolute",
    top: 0,
    left: 10,
    zIndex: 2
  },
  heading: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginTop: 10
  }
};
