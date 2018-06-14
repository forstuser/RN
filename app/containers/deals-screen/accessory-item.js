import React from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import StarRating from "react-native-star-rating";
import { Text, Image } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import amazonLogo from "../../images/amazon_logo.png";
import NavigationService from "../../navigation";
import { SCREENS } from "../../constants";
import flipkartLogo from "../../images/flipkart_logo.png";

export default class AccessoryItem extends React.Component {
  onAccessoriesPress = item => {
    NavigationService.navigate(SCREENS.ECOMMERCE_SCREEN, { item });
  };
  render() {
    const { item } = this.props;

    return (
      <View
        style={{
          height: 200,
          width: 150,
          margin: 5,
          borderRadius: 5,
          marginRight: 15,
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          ...defaultStyles.card
        }}
      >
        <Image
          source={{ uri: item.details.image }}
          style={{ width: 80, height: 65 }}
          resizeMode="contain"
        />
        <Text
          weight="Medium"
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#616161",
            marginTop: 15
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 5,
            alignItems: "center"
          }}
        >
          <StarRating
            starColor={colors.pinkishOrange}
            disabled={true}
            maxStars={5}
            rating={item.details.rating}
            halfStarEnabled={true}
            starSize={11}
            starStyle={{ marginHorizontal: 0 }}
          />
          <Text
            weight="Medium"
            style={{ fontSize: 11, color: "#b6b6b6", marginLeft: 2 }}
          >
            ({item.details.rating})
          </Text>
        </View>

        <View
          style={{
            borderColor: colors.mainBlue,
            borderWidth: 1,
            height: 28,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 12,
            minWidth: 100,
            marginTop: 10
          }}
        >
          <Image
            source={
              item.details.seller == "flipkart" ? flipkartLogo : amazonLogo
            }
            style={{ width: 18, height: 18, margin: 5 }}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={() => this.onAccessoriesPress(item)}
            style={{
              flex: 1,
              borderLeftWidth: 1,
              borderColor: colors.mainBlue,
              height: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              weight="Bold"
              style={{ fontSize: 12, color: colors.mainBlue }}
            >
              ₹ {item.details.price}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
