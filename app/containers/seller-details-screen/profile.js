import React from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";

import { API_BASE_URL, getMySellers } from "../../api";

import { Text, Button, Image } from "../../elements";
import Checkbox from "../../components/checkbox";

import { colors, defaultStyles } from "../../theme";

const KeyValue = ({ keyText, valueText, ValueComponent }) => (
  <View style={{ flexDirection: "row", marginVertical: 3 }}>
    <View
      style={{
        flexDirection: "row",
        width: 100,
        justifyContent: "space-between"
      }}
    >
      <Text style={{ fontSize: 9 }}>{keyText}</Text>
      <Text style={{ fontSize: 9 }}>:</Text>
    </View>
    {ValueComponent ? (
      <ValueComponent />
    ) : (
      <Text weight="Medium" style={{ fontSize: 9, marginLeft: 20 }}>
        {valueText}
      </Text>
    )}
  </View>
);

const PaymentMode = ({ isAvailable, name }) => (
  <View
    style={{
      flexDirection: "row",
      marginVertical: 3,
      alignItems: "center",
      marginLeft: 20,
      width: 70
    }}
  >
    <Checkbox isChecked={isAvailable} style={{ height: 16, width: 16 }} />
    <Text style={{ fontSize: 9, marginLeft: 5 }}>{name}</Text>
  </View>
);

const Review = ({ imageUrl, name, ratings, reviewText }) => (
  <View style={{ flexDirection: "row", marginVertical: 3 }}>
    <View style={{ width: 35, marginRight: 10 }}>
      {imageUrl ? (
        <Image
          style={{ width: 35, height: 35, borderRadius: 18 }}
          source={{ uri: imageUrl }}
        />
      ) : (
        <View>
          <Icon name="md-contact" size={43} color={colors.secondaryText} />
        </View>
      )}
    </View>
    <View style={{ flex: 1 }}>
      <Text weight="Medium" style={{ fontSize: 9, marginTop: 5 }}>
        {name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline"
        }}
      >
        <StarRating
          starColor={colors.yellow}
          disabled={true}
          maxStars={5}
          rating={Number(ratings)}
          halfStarEnabled={true}
          starSize={11}
          starStyle={{ marginHorizontal: 0 }}
        />
        <Text
          weight="Medium"
          style={{
            fontSize: 10,
            marginLeft: 2,
            color: colors.secondaryText
          }}
        >
          ({ratings})
        </Text>
      </View>

      <Text style={{ fontSize: 8, marginTop: 3 }}>{reviewText}</Text>
    </View>
  </View>
);

export default class SellerProfileTab extends React.Component {
  render() {
    const { seller } = this.props;
    return (
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View
          style={{
            width: "100%",
            height: 130,
            borderBottomColor: "#eee",
            borderBottomWidth: 1
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%"
            }}
            source={{ uri: API_BASE_URL + seller.image }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            marginTop: 8
          }}
        >
          <StarRating
            starColor={colors.yellow}
            disabled={true}
            maxStars={5}
            rating={Number(3.5)}
            halfStarEnabled={true}
            starSize={11}
            starStyle={{ marginHorizontal: 0 }}
          />
          <Text
            weight="Medium"
            style={{
              fontSize: 10,
              marginLeft: 2,
              color: colors.secondaryText
            }}
          >
            ({seller.ratings})
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4
          }}
        >
          <Text weight="Medium" style={{ fontSize: 13.5 }}>
            {seller.name}
          </Text>
          <View
            style={{
              marginTop: 5,
              marginLeft: 3,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: seller.is_onboarded
                ? colors.success
                : colors.danger,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon
              name={seller.is_onboarded ? "md-checkmark" : "md-remove"}
              color="#fff"
              size={12}
            />
          </View>
        </View>
        <Text style={{ fontSize: 9, marginTop: 5, textAlign: "center" }}>
          {seller.address}
        </Text>
        <View
          style={{
            width: 155,
            borderColor: "#d9d9d9",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            height: 28,
            justifyContent: "center",
            marginTop: 10
          }}
        >
          <Text style={{ fontSize: 9, textAlign: "center", marginTop: -2 }}>
            {seller.owner_name}
          </Text>
        </View>
        <View
          style={{
            width: 155,
            borderColor: "#d9d9d9",
            borderBottomWidth: 1,
            height: 28,
            justifyContent: "center"
          }}
        >
          <Text style={{ fontSize: 9, textAlign: "center", marginTop: -2 }}>
            S M W T F S{`          `}
            10:00am - 9:00pm
          </Text>
        </View>
        <View style={{ flexDirection: "row", width: 180, paddingTop: 10 }}>
          <TouchableOpacity style={[styles.button]}>
            <Icon
              name="ios-call-outline"
              style={styles.buttonIcon}
              color={colors.pinkishOrange}
            />
            <Text weight="Medium" style={styles.buttonText}>
              Call
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { marginHorizontal: 1 }]}>
            <Icon
              name="ios-navigate-outline"
              style={styles.buttonIcon}
              color={colors.pinkishOrange}
            />
            <Text weight="Medium" style={styles.buttonText}>
              Directions
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%" }}>
          <View
            style={{
              ...defaultStyles.card,
              margin: 10,
              borderRadius: 10,
              paddingVertical: 5,
              paddingHorizontal: 20
            }}
          >
            <KeyValue keyText="No. of Transactions" valueText="23" />
            <KeyValue keyText="Credit" valueText={seller.credit_total} />
            <KeyValue keyText="Points" valueText={seller.loyalty_total} />
          </View>
        </View>
        <View style={{ width: "100%" }}>
          <View
            style={{
              ...defaultStyles.card,
              margin: 10,
              borderRadius: 10,
              paddingVertical: 5,
              paddingHorizontal: 20
            }}
          >
            <KeyValue keyText="Connected Since" valueText="May 2018" />
            <KeyValue
              keyText="Store Contact No"
              valueText={seller.contact_no}
            />
            <KeyValue
              keyText="Home Delivery"
              valueText={`Yes\n(Within 7 km, between 10:00am to 9:00pm)`}
            />
            <KeyValue
              keyText="Payment Mode"
              ValueComponent={() => (
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <PaymentMode isAvailable={false} name="COD" />
                    <PaymentMode isAvailable={true} name="POS" />
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <PaymentMode isAvailable={false} name="Paytm" />
                    <PaymentMode isAvailable={false} name="Credit" />
                  </View>
                </View>
              )}
            />
          </View>
        </View>
        <Button
          text="Write A Review"
          color="secondary"
          style={{
            width: 120,
            height: 28,
            alignSelf: "flex-end",
            marginRight: 10
          }}
          textStyle={{ fontSize: 11.5 }}
        />
        <View style={{ width: "100%" }}>
          <View
            style={{
              ...defaultStyles.card,
              margin: 10,
              borderRadius: 10,
              paddingVertical: 5,
              paddingHorizontal: 15
            }}
          >
            <Text weight="Medium" style={{ fontSize: 11 }}>
              Reviews
            </Text>
            <Review
              name="Pramjeet"
              ratings={4.1}
              reviewText={`Quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehen derit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff"
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 5
  },
  buttonText: {
    fontSize: 9,
    color: colors.pinkishOrange
  }
});
