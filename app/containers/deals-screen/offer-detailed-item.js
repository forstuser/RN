import React from "react";
import {
  StyleSheet,
  View,
  Clipboard,
  TouchableOpacity,
  Linking
} from "react-native";
import StarRating from "react-native-star-rating";
import moment from "moment";
import Snackbar from "react-native-snackbar";
import { Text, Image, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

export default class OfferDetailedView extends React.Component {
  copyPromoCode = () => {
    const { item } = this.props;
    Clipboard.setString(item.promo_code);
    Snackbar.show({
      title: "Promo code copied!!",
      duration: Snackbar.LENGTH_SHORT
    });
  };
  render() {
    const { item } = this.props;

    return (
      <View
        style={{
          margin: 5,
          borderRadius: 5,
          padding: 20,
          justifyContent: "center",
          ...defaultStyles.card
        }}
      >
        <Image
          source={{ uri: item.logo }}
          style={{ width: "100%", height: 60 }}
          resizeMode="contain"
        />
        <Text
          weight="Bold"
          style={{
            fontSize: 11,
            marginTop: 15
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {item.promo_code ? (
          <View
            style={{
              height: 28,
              flexDirection: "row",
              marginTop: 10
            }}
          >
            <View
              style={{
                borderColor: colors.secondaryText,
                borderWidth: 1,
                borderStyle: "dashed",
                borderTopLeftRadius: 3,
                borderBottomLeftRadius: 3,
                alignItems: "center"
              }}
            >
              <Text
                weight="Bold"
                style={{
                  fontSize: 12,
                  color: colors.pinkishOrange,
                  padding: 5
                }}
              >
                Code - {item.promo_code}
              </Text>
            </View>
            <TouchableOpacity
              onPress={this.copyPromoCode}
              style={{
                backgroundColor: colors.pinkishOrange,
                alignItems: "center",
                justifyContent: "center",
                borderTopRightRadius: 3,
                borderBottomRightRadius: 3,
                marginLeft: -1
              }}
            >
              <Text
                weight="Bold"
                style={{
                  fontSize: 12,
                  color: "#fff",
                  paddingVertical: 6,
                  marginHorizontal: 10
                }}
              >
                Copy
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}

        <Text weight="Bold" style={{ fontSize: 11, marginTop: 10 }}>
          Terms & conditions:
        </Text>
        {[
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        ].map((term, index) => (
          <View key={term} style={{ flexDirection: "row", marginTop: 5 }}>
            <Text weight="Medium" style={{ fontSize: 10 }}>
              {index + 1}.{" "}
            </Text>
            <Text weight="Medium" style={{ fontSize: 10, flex: 1 }}>
              {term}
            </Text>
          </View>
        ))}
        <Button
          onPress={() => Linking.openURL(item.goto_link)}
          color="secondary"
          text="Start Shopping"
          style={{ width: 150, height: 35, alignSelf: "center", marginTop: 20 }}
          textStyle={{ fontSize: 14 }}
        />
      </View>
    );
  }
}