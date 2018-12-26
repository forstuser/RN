import React, { Component } from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";

import RNGooglePlaces from "react-native-google-places";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { Text, Button, Image, TextInput } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import { shareLocationOnBoarding, updateUserAddresses } from "../../api";
import { showSnackbar } from "../../utils/snackbar";
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import Modal from "react-native-modal";
import Modal1 from "../../components/modal";

const windowWidth = Dimensions.get("window").width;
const leftAbsolute = (windowWidth - 250) / 2;

class SelectSellerScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    addressModal: false,
    skipModal: false,
    sellerExistModal: false,
    noSellerModal: false,
    address1: "",
    address2: "",
    pin: "",
    latitude: null,
    longitude: null
  };

  saveAddress = async () => {
    const { address2, pin, latitude, longitude } = this.state;
    const lat = latitude.toString();
    const long = longitude.toString();
    try {
      let item = {
        address_line_2: address2,
        pin: pin,
        latitude: latitude,
        longitude: longitude
      };
      const res = await shareLocationOnBoarding(lat, long);
      console.log("LocationShareOnBoardingResponse____", res);
      this.setState({ addressModal: false });
      if (res.result > 0) {
        this.setState({ sellerExistModal: true });
      } else this.setState({ noSellerModal: true });
      const updateAddressResponse = await updateUserAddresses(item);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      this.setState({ addressModal: false });
    }
  };

  openLocationModal = () => {
    this.setState({ skipModal: false });
    RNGooglePlaces.openPlacePickerModal()
      .then(place => {
        this.setState({
          latitude: place.latitude,
          longitude: place.longitude,
          address2: place.address || place.name
        });
        this.saveAddress();
      })
      .catch(error => console.log(error.message));
  };

  OnSkip = () => {
    this.setState({ skipModal: true });
  };

  goToMySeller = () => {
    this.setState({ sellerExistModal: false });
    this.props.navigation.navigate(SCREENS.APP_STACK_DUMMY);
  };

  goToShopAndEarn = () => {
    this.setState({ skipModal: false, noSellerModal: false });
    this.props.navigation.navigate(SCREENS.APP_STACK);
  };

  hideSkipModal = () => {
    this.setState({ skipModal: false });
  };

  hideAddressModal = () => {
    this.setState({ addressModal: false });
  };

  hideSellerExistModal = () => {
    this.setState({ sellerExistModal: false });
  };

  hideNoSellerModal = () => {
    this.setState({ noSellerModal: false });
  };

  render() {
    const {
      addressModal,
      skipModal,
      sellerExistModal,
      noSellerModal,
      address1,
      address2,
      pin
    } = this.state;
    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: leftAbsolute
          }}
        >
          <Button
            onPress={this.OnSkip}
            style={styles.skipBtn}
            text="Skip"
            type="outline"
            color="secondary"
            outlineBtnStyle={{ borderColor: "#d7d7d7" }}
          />
        </View>
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
          <Text weight="Bold" style={styles.heading}>
            Share Your Location
          </Text>
        </View>
        <View>
          <View style={{ width: windowWidth - 40, marginLeft: 20 }}>
            <TouchableOpacity
              onPress={this.openLocationModal}
              style={styles.search}
            >
              <Text style={styles.searchText}>Share Location</Text>
              <Text>
                <Icon name="ios-pin" size={22} color={colors.pinkishOrange} />
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.showText}>
              Share your Location to automatically add Grocery Stores in your
              Neighbourhood for Easy Grocery Shopping & Instant Cashback
            </Text>
          </View>
        </View>
        <Modal1
          isVisible={addressModal}
          title="Add New Address"
          onClosePress={this.hideAddressModal}
          onBackButtonPress={this.hideAddressModal}
          onBackdropPress={this.hideAddressModal}
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
              onPress={this.hideAddressModal}
              color="grey"
              style={styles.btn}
            />
            <Button
              text="Add"
              onPress={this.saveAddress}
              color="secondary"
              style={styles.btn}
            />
          </View>
        </Modal1>
        <Modal
          isVisible={skipModal}
          useNativeDriver
          onBackButtonPress={this.hideSkipModal}
          onBackdropPress={this.hideSkipModal}
        >
          <View
            style={{
              backgroundColor: "#fff",
              height: 300,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              padding: 10
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20
              }}
            >
              <Image
                style={{ width: 90, height: 90 }}
                source={require("../../images/skip_location.png")}
              />
            </View>
            <Text
              style={{
                padding: 20,
                textAlign: "center",
                fontSize: 16,
                marginTop: 10
              }}
            >
              <Text weight="Bold">Are you sure?</Text> If you Skip, you will
              have to add nearby Grocery Stores manually in 'My Sellers'
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 0
              }}
            >
              <Button
                text="Skip"
                onPress={this.goToShopAndEarn}
                style={{
                  width: 150,
                  alignSelf: "center",
                  marginRight: 5,
                  height: 45
                }}
                color="grey"
              />
              <Button
                text="Share Location"
                onPress={this.openLocationModal}
                style={{
                  width: 150,
                  alignSelf: "center",

                  height: 45
                }}
                color="secondary"
              />
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={sellerExistModal}
          useNativeDriver
          onBackButtonPress={this.hideSellerExistModal}
          onBackdropPress={this.hideSellerExistModal}
        >
          <View
            style={{
              backgroundColor: "#fff",
              height: 300,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              padding: 10
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20
              }}
            >
              <Image
                style={{ width: 90, height: 90 }}
                source={require("../../images/happiness.png")}
              />
            </View>
            <Text
              style={{
                padding: 20,
                textAlign: "center",
                fontSize: 16,
                marginTop: 10
              }}
            >
              <Text weight="Bold">Hurray!</Text> We have added your
              Neighbourhood Grocery Stores in ‘My Seller’ section to help you
              Shop & Earn Cashback.
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 0
              }}
            >
              <Button
                text="Go to My Seller"
                onPress={this.goToMySeller}
                style={{
                  width: 170,
                  alignSelf: "center",

                  height: 45
                }}
                color="secondary"
              />
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={noSellerModal}
          useNativeDriver
          onBackButtonPress={this.hideNoSellerModal}
          onBackdropPress={this.hideNoSellerModal}
        >
          <View
            style={{
              backgroundColor: "#fff",
              height: 300,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              padding: 10
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20
              }}
            >
              <Image
                style={{ width: 90, height: 90 }}
                source={require("../../images/sad.png")}
              />
            </View>
            <Text
              style={{
                padding: 20,
                textAlign: "center",
                fontSize: 16,
                marginTop: 10
              }}
            >
              <Text weight="Bold">Oops!</Text> We did not find any BinBill
              Stores in your neighbourhood at the moment. You can invite your
              nearby Stores for Orders or simply upload your Grocery Bills to
              Earn Cashback.
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 0
              }}
            >
              <Button
                text="Ok"
                onPress={this.goToShopAndEarn}
                style={{
                  width: 150,
                  alignSelf: "center",

                  height: 45
                }}
                color="secondary"
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = {
  container: {
    height: 50
  },
  heading: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    marginTop: 15
  },
  showText: {
    color: colors.secondaryText,
    fontSize: 15,
    padding: 30,
    textAlign: "center"
  },
  skipBtn: {
    margin: 10,
    width: 250
  },
  search: {
    padding: 10,
    height: 45,
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
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

export default SelectSellerScreen;
