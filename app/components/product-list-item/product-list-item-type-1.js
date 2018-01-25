import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { getProductMetasString } from "../../utils";
import { SERVICE_TYPE_NAMES } from "../../constants";

const isDateInNextTenDays = date => {
  const diff = date.diff(moment(), "days");
  return diff >= 0 && diff <= 10;
};

const expiringInText = date => {
  const diff = date.diff(moment().startOf("day"), "days");
  if (diff < 0) {
    return "Expired!";
  } else if (diff == 0) {
    return "Expiring Today!";
  } else if (diff == 1) {
    return "Expiring Tomorrow!";
  } else {
    return "Expiring in " + diff + " days!";
  }
};
const ProductListItem = ({ product, onPress }) => {
  const meta = getProductMetasString(product.productMetaData);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: API_BASE_URL + product.cImageURL + "1" }}
      />
      <View style={styles.texts}>
        <View style={styles.nameAndSeller}>
          <View style={styles.nameAndValue}>
            <Text weight="Bold" style={styles.name}>
              {product.productName}
            </Text>
            <Text weight="Bold" style={styles.value}>
              ₹{product.value}
            </Text>
          </View>

          {product.sellers != null && (
            <Text style={styles.sellerName}>{product.sellers.sellerName}</Text>
          )}

          {product.sellers == null &&
            product.bill &&
            product.bill.sellers && (
              <Text style={styles.sellerName}>
                {product.bill.sellers.sellerName}
              </Text>
            )}
        </View>
        <View style={styles.otherDetailContainer}>
          <Text style={styles.detailName}>Purchase Date: </Text>
          <Text weight="Medium" style={styles.detailValue}>
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
            {isDateInNextTenDays(
              moment(product.warrantyDetails[0].expiryDate)
            ) && (
              <Text style={styles.expiringText}>
                {expiringInText(moment(product.warrantyDetails[0].expiryDate))}
              </Text>
            )}
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
            {isDateInNextTenDays(
              moment(product.insuranceDetails[0].expiryDate)
            ) && (
              <Text style={styles.expiringText}>
                {expiringInText(moment(product.insuranceDetails[0].expiryDate))}
              </Text>
            )}
          </View>
        )}
        {product.amcDetails.length > 0 && (
          <View style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>AMC till: </Text>
            <Text weight="Medium" style={styles.detailValue}>
              {moment(product.amcDetails[0].expiryDate).format("MMM DD, YYYY")}
            </Text>
            {isDateInNextTenDays(moment(product.amcDetails[0].expiryDate)) && (
              <Text style={styles.expiringText}>
                {expiringInText(moment(product.amcDetails[0].expiryDate))}
              </Text>
            )}
          </View>
        )}
        {product.schedule && (
          <View style={styles.serviceSchedule}>
            <Text style={styles.detailName}>Next Service Schedule</Text>
            <Text weight="Medium" style={styles.detailValue}>
              {`${moment(product.schedule.due_date).format(
                "MMM DD, YYYY"
              )} or ${product.schedule.distance}Kms (${
                SERVICE_TYPE_NAMES[product.schedule.service_type]
              })`}
            </Text>
            {isDateInNextTenDays(moment(product.schedule.due_date)) && (
              <Text style={styles.expiringText}>
                {expiringInText(moment(product.schedule.due_date))}
              </Text>
            )}
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
  nameAndSeller: {
    paddingBottom: 10,
    borderColor: "#ececec",
    borderBottomWidth: 1,
    marginBottom: 4
  },
  nameAndValue: {
    flexDirection: "row"
  },
  name: {
    fontSize: 14,
    color: colors.mainText,
    flex: 1
  },
  sellerName: {
    fontSize: 12,
    marginTop: 5
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
  },
  expiringText: {
    color: "#fff",
    backgroundColor: "rgba(255,0,0,0.7)",
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginLeft: 10
  },
  serviceSchedule: {
    marginTop: 5,
    paddingTop: 10,
    borderColor: "#ececec",
    borderTopWidth: 1
  }
});
export default ProductListItem;
