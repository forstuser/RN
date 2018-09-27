import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";

import { connect } from "react-redux";
import { Text, Button, Image } from "../../elements";
import { redeemToPaytm } from "../../api";

import LoadingOverlay from "../../components/loading-overlay";

import { showSnackbar } from "../../utils/snackbar";
import { SCREENS } from "../../constants";

class RedeemViaPaytmScreen extends React.Component {
  static navigationOptions = {
    title: "Redeem Via Paytm"
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  redeemAmount = async () => {
    const { navigation } = this.props;
    const totalCashback = navigation.getParam("totalCashback", 0);

    this.setState({ isLoading: true });
    try {
      const res = await redeemToPaytm();
      showSnackbar({
        text: "Cashback successfull"
      });
      navigation.goBack();
    } catch (e) {
      return showSnackbar({
        text: e.message
      });
    } finally {
      this.setState({ isLoading: false });
    }
    this.props.navigation.navigate(SCREENS.BB_CASH_WALLET_SCREEN);
  };

  render() {
    const { navigation } = this.props;
    const totalCashback = navigation.getParam("totalCashback", 0);

    const seller = navigation.getParam("seller", {});
    const { isLoading } = this.state;

    //console.log("pointsToRedeem: ", pointsToRedeem);

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          padding: 20,
          alignItems: "center"
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 27, marginTop: -8, marginRight: 8 }}>
            BBCash :
          </Text>

          <Text
            style={{
              color: "#000",
              fontSize: 18,
              fontWeight: "bold",
              minWidth: 80,
              textAlign: "center"
            }}
          >
            {totalCashback}
          </Text>
        </View>
        <Text style={{ textAlign: "center", fontSize: 11, marginTop: 20 }}>
          Please confirm your Paytm Number - {this.props.userPhoneNumber} or go
          back to Redeem Via Seller
        </Text>
        <Button
          text="Confirm Number"
          color="secondary"
          style={{ height: 37, width: 160, marginTop: 25 }}
          textStyle={{ fontSize: 13.5 }}
          onPress={this.redeemAmount}
        />
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userPhoneNumber: state.loggedInUser.phone
  };
};

export default connect(mapStateToProps)(RedeemViaPaytmScreen);
