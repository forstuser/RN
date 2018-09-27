import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";

import { Text, Button, Image } from "../../elements";
import { redeemSellerPoints } from "../../api";
import { showSnackbar } from "../../utils/snackbar";
import { SCREENS } from "../../constants";

export default class RedeemSellerPoints extends React.Component {
  static navigationOptions = {
    title: "Redeem Points"
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    this.state = {
      isLoading: false,
      pointsToRedeem: seller.loyalty_total,
      sellerId: seller.id
    };
  }

  changePointsToRedeem = pointsToRedeem => {
    this.setState({ pointsToRedeem });
  };

  redeemPoints = async () => {
    //alert('Redeem');
    const { sellerId, pointsToRedeem } = this.state;
    try {
      this.setState({ isLoading: true });
      const res = await redeemSellerPoints({
        sellerId: sellerId,
        pointsToRedeem: pointsToRedeem
      });
      console.log("Result: ", res);
      showSnackbar({ text: "Points Redeemed!" });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }

    this.props.navigation.navigate(SCREENS.MY_SELLERS_SCREEN);
  };

  render() {
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    const { pointsToRedeem } = this.state;

    console.log("pointsToRedeem: ", pointsToRedeem);

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
            Loyalty Points :
          </Text>
          <View
            style={{
              borderRadius: 5,
              height: 46,
              borderColor: "#d9d9d9",
              borderWidth: 1
            }}
          >
            <TextInput
              underlineColorAndroid="transparent"
              value={String(pointsToRedeem)}
              onChangeText={this.changePointsToRedeem}
              style={{
                color: "#000",
                fontSize: 18,
                fontWeight: "bold",
                minWidth: 80,
                textAlign: "center"
              }}
            />
          </View>
        </View>
        <Text style={{ textAlign: "center", fontSize: 11, marginTop: 20 }}>
          Please confirm number of points points to be redeemed.
        </Text>
        <Button
          onPress={this.redeemPoints}
          text="Confirm"
          color="secondary"
          style={{ height: 37, width: 140, marginTop: 25 }}
          textStyle={{ fontSize: 13.5 }}
        />
      </View>
    );
  }
}
