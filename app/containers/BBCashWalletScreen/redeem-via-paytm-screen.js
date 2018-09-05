import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";

import { Text, Button, Image } from "../../elements";

export default class RedeemViaPaytmScreen extends React.Component {
  static navigationOptions = {
    title: "Redeem Via Paytm"
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    // this.state = {
    //   pointsToRedeem: seller.loyalty_total
    // };
  }

//   changePointsToRedeem = pointsToRedeem => {
//     this.state({ pointsToRedeem });
//   };

  render() {
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    //const { pointsToRedeem } = this.state;

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
              //value={String(pointsToRedeem)}
              value='1000'
              //onChangeText={this.changePointsToRedeem}
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
          Please confirm your Paytm Number - 7589145713 or go back to Redeem Via Seller
        </Text>
        <Button
          text="Confirm Number"
          color="secondary"
          style={{ height: 37, width: 160, marginTop: 25 }}
          textStyle={{ fontSize: 13.5 }}
          onPress={() => alert('Button Pressed')}
        />
      </View>
    );
  }
}
