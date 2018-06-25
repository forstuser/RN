import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, Button } from "../../elements";
import OfferItem from "./offer-item";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";

export default class OfferCategory extends React.Component {
  render() {
    const { offerCategory, onViewAllPress } = this.props;

    if (offerCategory.offer_counts == 0) {
      return null;
    }

    const {
      discount: discountOffers,
      cashback: cashbackOffers,
      others: otherOffers
    } = offerCategory.offers;
    const offers = [...discountOffers, ...cashbackOffers, ...otherOffers];

    return (
      <View style={{ padding: 10, paddingRight: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text weight="Bold" style={{ fontSize: 16, marginLeft: 5 }}>
              {offerCategory.category_name} Offers
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: colors.mainBlue,
                marginVertical: 5,
                marginLeft: 5
              }}
            >
              ({offerCategory.offer_counts} offers available)
            </Text>
          </View>
          <Button
            onPress={onViewAllPress}
            style={{ height: 28, marginRight: 15 }}
            textStyle={{ fontSize: 11, paddingHorizontal: 20 }}
            text="View All"
            color="secondary"
            type="outline"
          />
        </View>
        <FlatList
          data={offers.slice(0, 6)}
          horizontal={true}
          renderItem={({ item }) => (
            <OfferItem
              item={item}
              selectedFilters
              categoryImageUrl={API_BASE_URL + offerCategory.image_url}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}
