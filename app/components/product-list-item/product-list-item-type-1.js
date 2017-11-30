import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { getProductMetasString } from "../../utils";

const ProductListItem = ({ product, onPress }) => {
  const meta = getProductMetasString(product.productMetaData);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: API_BASE_URL + "/" + product.cImageURL + "1" }}
      />
      <View style={styles.texts}>
        <Text weight="Bold" style={styles.name}>
          {product.productName}
        </Text>
        <View style={styles.metaContainer}>
          <Text numberOfLines={1} style={styles.meta}>
            {meta}
          </Text>
        </View>
        <View style={styles.purchaseDateContainer}>
          <Text weight="Medium" style={styles.purchaseDateText}>
            Purchase Date:{" "}
          </Text>
          <Text weight="Medium" style={styles.purchaseDate}>
            {moment(product.purchaseDate).format("MMM DD, YYYY")}
          </Text>
        </View>
        {product.warrantyDetails.length > 0 && (
          <View style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>Warrenty till: </Text>
            <Text weight="Medium" style={styles.detailValue}>
              {moment(product.warrantyDetails[0].expiryDate).format(
                "MMM DD, YYYY"
              )}
            </Text>
          </View>
        )}
        {product.insuranceDetails.length > 0 && (
          <View style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>Insurance till: </Text>
            <Text weight="Medium" style={styles.detailValue}>
              {moment(product.insuranceDetails[0].expiryDate).format(
                "MMM DD, YYYY"
              )}
            </Text>
          </View>
        )}
        {product.amcDetails.length > 0 && (
          <View style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>AMC till: </Text>
            <Text weight="Medium" style={styles.detailValue}>
              {moment(product.amcDetails[0].expiryDate).format("MMM DD, YYYY")}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12
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
  metaContainer: {
    paddingTop: 4,
    paddingBottom: 10
  },
  meta: {
    fontSize: 12,
    color: colors.mainText
  },
  purchaseDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderColor: "#ececec",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginBottom: 5
  },
  purchaseDateText: {
    fontSize: 14,
    color: colors.secondaryText
  },
  purchaseDate: {
    fontSize: 12,
    color: colors.mainText
  },
  otherDetailContainer: {
    paddingVertical: 3,
    flexDirection: "row"
  },
  detailName: {
    fontSize: 12
  },
  detailValue: {
    fontSize: 12
  }
});
export default ProductListItem;
