import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import { Text, Button, Image } from "../../elements";

import image1 from "../../images/bill-guideline/1.png";
import image2 from "../../images/bill-guideline/2.png";
import image3 from "../../images/bill-guideline/3.png";
import image4 from "../../images/bill-guideline/4.png";
import image5 from "../../images/bill-guideline/5.png";
import image6 from "../../images/bill-guideline/6.png";
import image7 from "../../images/bill-guideline/7.png";
import image8 from "../../images/bill-guideline/8.png";
const deviceWidth = Dimensions.get("window").width;
export default class BillList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guidelines: [
        {
          id: 1,
          imageUrl: image1,
          heading: "Bills include grocery items"
        },
        {
          id: 2,
          imageUrl: image2,
          heading: "Purchase date & Bill upload date is same"
        },
        {
          id: 3,
          imageUrl: image3,
          heading: "Bills are unmodified & unduplicated"
        },
        {
          id: 4,
          imageUrl: image4,
          heading: "Only printed Bills, not handwritten"
        },
        {
          id: 5,
          imageUrl: image5,
          heading: "Bill has Seller details"
        },
        {
          id: 6,
          imageUrl: image6,
          heading: "Use + sign to capture a long Bill in multiple images"
        },
        {
          id: 7,
          imageUrl: image7,
          heading: "Capture Bill edges within the frame"
        },
        {
          id: 8,
          imageUrl: image8,
          heading: "Bill is readable & in good condition"
        }
      ]
    };
  }
  render() {
    const { guidelines } = this.state;
    return (
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <Text
          weight="Bold"
          style={{
            fontSize: 16,
            textAlign: "center",
            marginTop: 10,
            marginLeft: 30,
            marginRight: 30
          }}
        >
          Ensure you follow this so that your Bills are not rejected and are
          verified faster
        </Text>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {guidelines.map(guideline => (
              <View
                style={{
                  width: deviceWidth / 2,
                  height: deviceWidth / 2,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  style={{
                    height: 90,
                    width: 90,
                    borderRadius: 90,
                    backgroundColor: "#efefef"
                    // borderWidth: 1,
                    // borderColor: "grey"
                  }}
                  source={guideline.imageUrl}
                  resizeMode="contain"
                />
                <Text
                  style={{ fontSize: 14, textAlign: "center", padding: 15 }}
                >
                  {guideline.heading}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    );
  }
}
