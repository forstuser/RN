import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button, Image } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { getProductMetasString } from "../../utils";
import { MAIN_CATEGORY_IDS, SERVICE_TYPE_NAMES } from "../../constants";

const isDateInPastOrInNextTenDays = date => {
  const diff = date.diff(
    moment()
      .utcOffset("+0000")
      .startOf("day"),
    "days"
  );
  return diff <= 10 && diff > -11;
};

const expiringInText = date => {
  const diff = date.diff(
    moment()
      .utcOffset("+0000")
      .startOf("day"),
    "days"
  );
  if (diff < 0) {
    return "Expired!";
  } else if (diff == 0) {
    return "Expiring Today!";
  } else if (diff == 1) {
    return "Expiring Tomorrow!";
  } else {
    return diff + " days left";
  }
};

const ProductListItem = ({ product, onPress }) => {
  let productName = product.productName;
  if (!productName) {
    productName = product.categoryName;
  }

  const meta = getProductMetasString(product.productMetaData);
  let dateText = "Date:";
  if (
    [
      MAIN_CATEGORY_IDS.AUTOMOBILE,
      MAIN_CATEGORY_IDS.ELECTRONICS,
      MAIN_CATEGORY_IDS.FURNITURE
    ].indexOf(product.masterCategoryId) > -1
  ) {
    dateText = "Purchase Date:";
  }

  let value = product.value;

  if (product.categoryId == 664) {
    //healthcare insurance
    value = product.insuranceDetails.reduce(
      (total, insurance) => total + insurance.value,
      0
    );
  }

  const offlineSellerName =
    product.sellers && product.sellers.sellerName
      ? product.sellers.sellerName
      : "";
  const onlineSellerName =
    product.bill && product.bill.sellers && product.bill.sellers.name
      ? product.bill.sellers.name
      : "";

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: API_BASE_URL + product.cImageURL
        }}
        resizeMode="contain"
      />
      <View collapsable={false} style={styles.texts}>
        <View collapsable={false} style={styles.nameAndSeller}>
          <View collapsable={false} style={{ flexDirection: "row" }}>
            <Text weight="Bold" style={styles.name}>
              {productName.toUpperCase()}
            </Text>
            <Text weight="Bold" style={styles.value}>
              ₹ {value}
            </Text>
          </View>

          {offlineSellerName.length > 0 || onlineSellerName.length > 0 ? (
            <View collapsable={false} style={{ flexDirection: "row" }}>
              <Text style={styles.offlineSellerName}>{offlineSellerName}</Text>
              <Text style={styles.onlineSellerName}>{onlineSellerName}</Text>
            </View>
          ) : (
              <View collapsable={false} />
            )}
        </View>
        <View collapsable={false} style={styles.otherDetailContainer}>
          <Text style={styles.detailName}>{dateText} </Text>
          <Text weight="Medium" style={styles.detailValue}>
            {product.purchaseDate
              ? moment(product.purchaseDate).format("MMM DD, YYYY")
              : "-"}
          </Text>
        </View>
        {product.warrantyDetails && product.warrantyDetails.length > 0 ? (
          <View collapsable={false} style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>Warranty till: </Text>
            <Text weight="Medium" style={styles.detailValue}>
              {moment(product.warrantyDetails[0].expiryDate).format(
                "MMM DD, YYYY"
              )}
            </Text>
            {isDateInPastOrInNextTenDays(
              moment(product.warrantyDetails[0].expiryDate)
            ) ? (
                <Text style={styles.expiringText}>
                  {expiringInText(moment(product.warrantyDetails[0].expiryDate))}
                </Text>
              ) : (
                <View collapsable={false} />
              )}
          </View>
        ) : (
            <View collapsable={false} />
          )}
        {product.insuranceDetails && product.insuranceDetails.length > 0 ? (
          <View collapsable={false} style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>Insurance till: </Text>
            <Text weight="Medium" style={styles.detailValue}>
              {moment(product.insuranceDetails[0].expiryDate).format(
                "MMM DD, YYYY"
              )}
            </Text>
            {isDateInPastOrInNextTenDays(
              moment(product.insuranceDetails[0].expiryDate)
            ) ? (
                <Text style={styles.expiringText}>
                  {expiringInText(moment(product.insuranceDetails[0].expiryDate))}
                </Text>
              ) : (
                <View collapsable={false} />
              )}
          </View>
        ) : (
            <View collapsable={false} />
          )}
        {product.amcDetails && product.amcDetails.length > 0 ? (
          <View collapsable={false} style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>AMC till: </Text>
            <Text weight="Medium" style={styles.detailValue}>
              {moment(product.amcDetails[0].expiryDate).format("MMM DD, YYYY")}
            </Text>
            {isDateInPastOrInNextTenDays(
              moment(product.amcDetails[0].expiryDate)
            ) ? (
                <Text style={styles.expiringText}>
                  {expiringInText(moment(product.amcDetails[0].expiryDate))}
                </Text>
              ) : (
                <View collapsable={false} />
              )}
          </View>
        ) : (
            <View collapsable={false} />
          )}
        {product.pucDetails && product.pucDetails.length > 0 ? (
          <View collapsable={false} style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>Polution Certificate: </Text>
            <Text weight="Medium" style={styles.detailValue}>
              {moment(product.pucDetails[0].expiryDate).format("MMM DD, YYYY")}
            </Text>
            {isDateInPastOrInNextTenDays(
              moment(product.pucDetails[0].expiryDate)
            ) ? (
                <Text style={styles.expiringText}>
                  {expiringInText(moment(product.pucDetails[0].expiryDate))}
                </Text>
              ) : (
                <View collapsable={false} />
              )}
          </View>
        ) : (
            <View collapsable={false} />
          )}
        {product.schedule ? (
          <View collapsable={false} style={styles.serviceSchedule}>
            <Text style={styles.detailName}>Next Service Schedule</Text>
            <View collapsable={false} style={{ flexDirection: "row" }}>
              <Text weight="Medium" style={styles.detailValue}>
                {`${moment(product.schedule.due_date).format(
                  "MMM DD, YYYY"
                )} or ${product.schedule.distance} kms (${
                  SERVICE_TYPE_NAMES[product.schedule.service_type]
                  })`}
              </Text>
              {isDateInPastOrInNextTenDays(
                moment(product.schedule.due_date)
              ) ? (
                  <Text style={styles.expiringText}>
                    {expiringInText(moment(product.schedule.due_date))}
                  </Text>
                ) : (
                  <View collapsable={false} />
                )}
            </View>
          </View>
        ) : (
            <View collapsable={false} />
          )}
        <View style={styles.mainCategoryTab}>
          <Text
            weight="Medium"
            style={{ fontSize: 10, color: "#fff", marginTop: -3 }}
          >
            {product.masterCategoryName}
          </Text>
        </View>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 4
  },
  name: {
    fontSize: 14,
    color: colors.mainText,
    flex: 1
  },
  value: {
    marginLeft: 20
  },
  offlineSellerName: {
    fontSize: 12,
    flex: 1
  },
  onlineSellerName: {
    fontSize: 12,
    color: colors.mainBlue,
    flex: 1,
    textAlign: "right"
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
    paddingHorizontal: 2,
    marginLeft: 2
  },
  serviceSchedule: {
    marginTop: 5,
    paddingTop: 10,
    borderColor: "#ececec",
    borderTopWidth: StyleSheet.hairlineWidth
  },
  mainCategoryTab: {
    alignSelf: "flex-start",
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.tomato,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 10
  }
});
export default ProductListItem;
