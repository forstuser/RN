import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";

const directionIcon = require("../../images/ic_directions.png");
const callIcon = require("../../images/ic_call.png");

const ProductListItem = ({ product }) => {
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Image
          style={styles.image}
          source={{ uri: API_BASE_URL + "/" + product.cImageURL + "1" }}
        />
        <View style={styles.texts}>
          <Text weight="Bold" style={styles.name}>
            {product.productName}
          </Text>
          <Text style={styles.sellerName}>{product.sellers.sellerName}</Text>
          <Text weight="Medium" style={styles.purchaseDate}>
            {moment(product.purchaseDate).format("MMM DD, YYYY")}
          </Text>
        </View>
        <Text weight="Bold" style={styles.amount}>
          ₹ {product.value}
        </Text>
      </View>
      {product.categoryId == 22 && (
        <View style={styles.directionAndCall}>
          <TouchableOpacity style={styles.directionAndCallItem}>
            <Text weight="Bold" style={styles.directionAndCallText}>
              Directions
            </Text>
            <Image style={styles.directionAndCallIcon} source={directionIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.directionAndCallItem}>
            <Text weight="Bold" style={styles.directionAndCallText}>
              Call
            </Text>
            <Image style={styles.directionAndCallIcon} source={callIcon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  details: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row"
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16
  },
  texts: {
    flex: 1
  },
  name: {
    fontSize: 14,
    color: colors.mainText
  },
  sellerName: {
    fontSize: 12,
    color: colors.mainText,
    marginVertical: 5
  },
  purchaseDate: {
    fontSize: 12,
    color: colors.secondaryText
  },
  amount: {
    marginTop: 20
  },
  directionAndCall: {
    flexDirection: "row"
  },
  directionAndCallItem: {
    height: 40,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ececec",
    borderWidth: 1
  },
  directionAndCallText: {
    color: colors.pinkishOrange,
    marginRight: 6
  },
  directionAndCallIcon: {
    width: 18,
    height: 18
  }
});
export default ProductListItem;
