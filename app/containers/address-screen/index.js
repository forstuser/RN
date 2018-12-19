import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  ImageBackground
} from "react-native";
import { Text, TextInput, Button, Image } from "../../elements";
import AddressView from "./address-view";
import { colors, defaultStyles } from "../../theme";
import Icon from "react-native-vector-icons/Ionicons";
import RNGooglePlaces from "react-native-google-places";
import Modal from "../../components/modal";
import { SCREENS } from "../../constants";
import snackbar, { showSnackbar } from "../../utils/snackbar";
import LoadingOverlay from "./../../components/loading-overlay";
import Analytics from "../../analytics";
// import HeaderBackButton from "./../../components/header-nav-back-btn";

import {
  getUserAddresses,
  updateUserAddresses,
  deleteUserAddresses,
  placeOrder,
  getProfileDetail,
  getDistanceFromSeller
} from "../../api";

class AddressScreen extends Component {
  static navigationOptions = {
    title: "Manage Addresses"
  };
  static navigationOptions = ({ navigation }) => {
    const collectAtStoreFlag = navigation.getParam("collectAtStoreFlag", false);
    const params = navigation.state.params || {};
    return {
      title: collectAtStoreFlag
        ? "Select Your Location"
        : params.sellerId
        ? "Select Delivery Address"
        : "Manage Addresses",
      headerRight:
        params.sellerId && params.showNext ? (
          <Text
            onPress={params.makeOrder}
            weight="Bold"
            style={{ color: colors.pinkishOrange, marginRight: 10 }}
          >
            NEXT
          </Text>
        ) : null
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      latitude: null,
      longitude: null,
      isVisible: false,
      deleteModalShow: false,
      address1: "",
      address2: "",
      addreesID: null,
      btnTXT: "Add",
      headerTitle: "Add New Address",
      pin: "",
      selectedIndex: 0,
      showLoader: false,
      isModelShow: false
    };
  }
  componentDidMount() {
    this.fetchUserAddress();
    this.props.navigation.setParams({
      makeOrder: this.makeOrder
    });
  }
  show = item => {
    this.setState({ isVisible: true });
  };
  hide = () => {
    this.setState({ isVisible: false });
  };
  openModal = () => {
    this.setState({ isModelShow: true });
  };
  closeModal = () => {
    this.setState({ isModelShow: false });
  };
  showDeleteModal = () => {
    this.setState({ deleteModalShow: true });
  };
  hideDeleteModal = () => {
    this.setState({ deleteModalShow: false });
  };
  getProfileDetail = async () => {
    const collectAtStoreFlag = this.props.navigation.getParam(
      "collectAtStoreFlag",
      false
    );
    try {
      const r = await getProfileDetail();
      const user = r.userProfile;
      if (collectAtStoreFlag) {
        this.props.navigation.navigate(SCREENS.ADD_SELLER_SCREEN, {
          fromAddressScreen: true,
          userDetails: user
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  fetchUserAddress = async () => {
    try {
      const userAddresses = await getUserAddresses();
      // console.log("userAddresses", userAddresses.result);
      this.setState({
        addresses: userAddresses.result
      });
      if (this.state.addresses.length > 0) {
        this.props.navigation.setParams({ showNext: true });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  saveAddress = async () => {
    if (this.state.address1 == "") {
      return showSnackbar({ text: "Please enter House/Flat no." });
    }
    this.hide();
    this.setState({ showLoader: true });
    try {
      let item = {
        address_line_1: this.state.address1,
        address_line_2: this.state.address2,
        pin: this.state.pin,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        id: this.state.addreesID
      };
      if (item.id == null) {
        delete item.id;
      }
      const updateAddressResponse = await updateUserAddresses(item);
      console.log("updateAddressResponse", updateAddressResponse);
      this.fetchUserAddress();
      this.getProfileDetail();
      this.setState({ showLoader: false });
    } catch (error) {
      console.log("error: ", error);
    }
  };
  updateAddress = index => {
    console.log(this.state.addresses[index]);
    this.setState({
      address1: this.state.addresses[index].address_line_1,
      address2: this.state.addresses[index].address_line_2,
      addreesID: this.state.addresses[index].id,
      pin: this.state.addresses[index].pin,
      btnTXT: "Update",
      headerTitle: "Update Address"
    });
    this.show();
  };
  setDefault = async index => {
    console.log(this.state.addresses[index]);
    this.setState({ showLoader: true });
    try {
      let item = { address_type: 1, id: this.state.addresses[index].id };
      if (item.id == null) {
        delete item.id;
      }
      const updateAddressResponse = await updateUserAddresses(item);
      console.log("updateAddressResponse", updateAddressResponse);
      this.fetchUserAddress();
      this.setState({ showLoader: false });
    } catch (error) {
      console.log("error: ", error);
    }
  };
  deleteAddressModel = index => {
    console.log(this.state.addresses[index]);
    this.setState({
      addreesID: this.state.addresses[index].id
    });
    this.showDeleteModal();
  };
  deleteAddress = async () => {
    this.hideDeleteModal();
    this.setState({ showLoader: true });
    try {
      const deleteReponse = await deleteUserAddresses(this.state.addreesID);
      // console.log("userAddresses", deleteReponse);
      this.fetchUserAddress();
      this.setState({ showLoader: false });
    } catch (error) {
      console.log("error: ", error);
    }
  };
  selectAddress = index => {
    console.log("selct address", index);
    this.setState({ selectedIndex: index });
  };

  openLocationModal = () => {
    const collectAtStoreFlag = this.props.navigation.getParam(
      "collectAtStoreFlag",
      false
    );

    this.setState({ showLoader: true });
    RNGooglePlaces.openPlacePickerModal()
      .then(place => {
        this.setState({
          latitude: place.latitude,
          longitude: place.longitude,
          address2: place.address || place.name,
          isVisible: true,
          addreesID: null,
          btnTXT: "Add",
          headerTitle: "Add New Address",
          showLoader: false
        });
      })
      .catch(error => console.log(error.message)); // error is a Javascript Error object
  };

  makeOrder = async () => {
    Analytics.logEvent(Analytics.EVENTS.MY_SHOPPING_LIST_SELECT_ADDRESS);
    console.log(
      "collectAtStoreFlag while placing order___________",
      this.props.navigation.getParam("collectAtStoreFlag")
    );
    this.setState({ showLoader: true });
    const isDeliveryPossible = await this.isAddressDeliverable();
    if (isDeliveryPossible) {
      try {
        const res = await placeOrder({
          sellerId: this.props.navigation.getParam("sellerId"),
          orderType: this.props.navigation.getParam("orderType"),
          serviceName: this.props.navigation.getParam("serviceName"),
          serviceTypeId: this.props.navigation.getParam("serviceTypeId"),
          collect_at_store: this.props.navigation.getParam(
            "collectAtStoreFlag"
          ),
          addressId: this.state.addresses[this.state.selectedIndex].id
        });
        const orderId = res.result.id;
        this.props.navigation.popToTop();
        this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
          orderId,
          collectAtStoreFlag: true
        });
      } catch (e) {
        console.log("error", e);
        showSnackbar({ text: e.message });
      } finally {
        this.setState({ showLoader: false });
      }
    } else {
      this.openModal();
      //open model not possible home delivery
    }
  };
  isAddressDeliverable = async () => {
    this.setState({ showLoader: true });
    try {
      const res = await getDistanceFromSeller({
        sellerId: this.props.navigation.getParam("sellerId"),
        addressId: this.state.addresses[this.state.selectedIndex].id
      });
      console.log("response for get distance api", res);
      if (res.result.distance <= 3) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("error", e);
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ showLoader: false });
    }
  };

  render() {
    const {
      showLoader,
      addresses,
      isVisible,
      deleteModalShow,
      address1,
      address2,
      btnTXT,
      pin,
      headerTitle,
      selectedIndex,
      isModelShow
    } = this.state;
    const collectAtStoreFlag = this.props.navigation.getParam(
      "collectAtStoreFlag",
      false
    );
    return (
      <ImageBackground
        style={{ flex: 1, width: null, height: null }}
        source={require("../../images/back_image_address.png")}
        resizeMode="cover"
      >
        <View style={styles.constainer}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              {addresses.map((item, index) => {
                return (
                  <AddressView
                    selectedIndex={selectedIndex}
                    index={index}
                    address={item}
                    selectAddress={this.selectAddress}
                    updateAddress={this.updateAddress}
                    setDefault={this.setDefault}
                    deleteAddressModel={this.deleteAddressModel}
                    sellerId={this.props.navigation.getParam("sellerId")}
                  />
                );
              })}
              {addresses.length > 0 ? (
                <View
                  style={{
                    top: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text>---- </Text>
                  <View style={styles.or}>
                    <Text style={styles.orText}>OR</Text>
                  </View>
                  <Text> ----</Text>
                </View>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() => {
                this.openLocationModal();
              }}
              style={styles.search}
            >
              <Text style={styles.searchText}>
                {collectAtStoreFlag ? "Select Location" : "Add New Address"}
              </Text>
              <Text>
                <Icon name="ios-pin" size={20} color={colors.pinkishOrange} />
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <Modal
            isVisible={isVisible}
            title={headerTitle}
            onClosePress={this.hide}
            onBackButtonPress={this.hide}
            onBackdropPress={this.hide}
            style={{ height: 300, backgroundColor: "#fff" }}
          >
            <View style={{ width: 320 }}>
              <TextInput
                placeholder="House/Flat No*"
                value={address1}
                style={{ borderRadius: 5, paddingHorizontal: 10 }}
                onChangeText={address1 => this.setState({ address1 })}
              />
              <TextInput
                placeholder="Address"
                value={address2}
                style={{ borderRadius: 5, paddingHorizontal: 10 }}
                onChangeText={address2 => this.setState({ address2 })}
              />
              <TextInput
                keyboardType="numeric"
                placeholder="Pin"
                value={pin}
                style={{ borderRadius: 5, paddingHorizontal: 10 }}
                onChangeText={pin => this.setState({ pin })}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                width: 300,
                justifyContent: "space-between",
                alignSelf: "center"
              }}
            >
              <Button
                text="Cancel"
                onPress={this.hide}
                color="grey"
                style={styles.btn}
              />
              <Button
                text={btnTXT}
                onPress={this.saveAddress}
                color="secondary"
                style={styles.btn}
              />
            </View>
          </Modal>

          <Modal
            isVisible={deleteModalShow}
            title={"Delete Address"}
            onClosePress={this.hideDeleteModal}
            onBackButtonPress={this.hideDeleteModal}
            onBackdropPress={this.hideDeleteModal}
            style={{ height: 200, backgroundColor: "#fff" }}
          >
            <View style={{ height: 150, backgroundColor: "#fff" }}>
              <View style={{ width: 260, alignSelf: "center", top: 25 }}>
                <Text
                  weight="Regular"
                  style={{ textAlign: "center", fontSize: 16 }}
                >
                  Are you sure you want to delete this address?
                </Text>
              </View>
              <View
                style={{
                  top: 40,
                  flexDirection: "row",
                  width: 260,
                  justifyContent: "space-between",
                  alignSelf: "center"
                }}
              >
                <Button
                  text="No"
                  onPress={this.hideDeleteModal}
                  color="grey"
                  style={styles.btn}
                />
                <Button
                  text="Yes"
                  onPress={this.deleteAddress}
                  color="secondary"
                  style={styles.btn}
                />
              </View>
            </View>
          </Modal>
          <Modal
            isVisible={isModelShow}
            title="Outside Delivery"
            style={{
              height: 350,
              ...defaultStyles.card
            }}
            onClosePress={this.closeModal}
          >
            <View
              style={{
                flex: 1,
                padding: 10,
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 13
                }}
              >
                <Image
                  style={{ width: 90, height: 90 }}
                  source={require("../../images/sad.png")}
                />
              </View>
              <Text
                style={{
                  padding: 10,
                  textAlign: "center",
                  fontSize: 16,
                  marginTop: 3,
                  lineHeight: 23
                }}
              >
                Oops, your selected location is outside our Delivery Zone.
                Please select another Store for your Order.
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {/* <Button
                text="Order Later"
                onPress={this.orderLater}
                style={{
                  width: 150,
                  alignSelf: "center",
                  marginRight: 5,
                  height: 40
                }}
                color="grey"
              /> */}
                <Button
                  text="OK"
                  onPress={this.closeModal}
                  style={{
                    width: 150,
                    alignSelf: "center",

                    height: 40
                  }}
                  color="secondary"
                />
              </View>
            </View>
          </Modal>
          <LoadingOverlay visible={showLoader} />
        </View>
      </ImageBackground>
    );
  }
}
const styles = {
  constainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  or: {
    backgroundColor: "grey",
    borderRadius: 20,
    width: 35,
    height: 35,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center"
  },
  orText: {
    color: "#fff",
    marginTop: -2
  },
  search: {
    height: 45,
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    marginBottom: 12,
    borderRadius: 10,
    ...defaultStyles.card
  },
  searchText: {
    marginTop: 2,
    color: colors.secondaryText
  },
  btn: {
    height: 40,
    width: 120,
    alignSelf: "center",
    marginTop: 20
  }
};

export default AddressScreen;
