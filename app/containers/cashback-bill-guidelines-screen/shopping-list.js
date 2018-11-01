import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Text, Button, Image } from "../../elements";
import image1 from "../../images/bill-guideline/9.png";
import image2 from "../../images/bill-guideline/10.png";
import image3 from "../../images/bill-guideline/11.png";
import image4 from "../../images/bill-guideline/12.png";
import image5 from "../../images/bill-guideline/13.png";

export default class ShoppingList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guidelines: [
        {
          id: 1,
          imageUrl: image1,
          heading: `Maximize your Cashback by creating your Shopping List to include items having Bonus Cashback or higher Cashback.`
        },
        {
          id: 2,
          imageUrl: image2,
          heading: `Shopping with a list is Systematic and Less Time consuming`
        },
        {
          id: 3,
          imageUrl: image3,
          heading: `Can be shared with your Family or a Seller for order & additional benefits`
        },
        {
          id: 4,
          imageUrl: image4,
          heading: `Submitting Cashback Claim is Easier as your Shopping List only needs to be edited to include items bought`
        },
        {
          id: 5,
          imageUrl: image5,
          heading: `Cashback Claim Approval is smoother & faster with a Shopping List`
        }
      ]
    };
  }
  render() {
    const { guidelines } = this.state;
    return (
      <FlatList
        data={guidelines}
        renderItem={({ item }) => (
          <View style={{ margin: 10, flexDirection: "row" }}>
            <Image
              style={{ height: 70, width: 70 }}
              source={item.imageUrl}
              resizeMode="contain"
            />
            <View
              style={{
                padding: 10,
                width: 300
              }}
            >
              <Text style={{ fontSize: 14 }}>{item.heading}</Text>
            </View>
          </View>
        )}
      />
    );
  }
}
