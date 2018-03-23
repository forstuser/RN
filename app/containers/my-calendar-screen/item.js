import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button, AsyncImage } from "../../elements";
import I18n from "../../i18n";
import { colors, defaultStyles } from "../../theme";
import { API_BASE_URL } from "../../api";
import { MAIN_CATEGORY_IDS } from "../../constants";

const Item = ({ item, onPress }) => {
  const {
    product_name,
    provider_name,
    wages_type,
    present_days,
    absent_days,
    service_type,
    latest_payment_detail
  } = item;
  const imageUrl = API_BASE_URL + service_type.calendarServiceImageUrl;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image style={styles.image} source={{ uri: imageUrl }} />
      <View style={styles.texts}>
        <View style={styles.nameAndSeller}>
          <View style={{ flexDirection: "row" }}>
            <Text weight="Bold" style={styles.name}>
              {product_name}
            </Text>
            <Text weight="Bold" style={styles.value}>
              ₹ {latest_payment_detail.total_amount}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.offlineSellerName}>{provider_name}</Text>
            <Text style={styles.onlineSellerName}>
              {I18n.t("my_calendar_screen_till_date", {
                date: moment(latest_payment_detail.end_date).format(
                  "DD MMM YYYY"
                )
              })}
            </Text>
          </View>
        </View>
        <View style={styles.otherDetailContainer}>
          <Text style={styles.detailName}>
            {I18n.t("my_calendar_screen_days_present")}:{" "}
          </Text>
          <Text weight="Medium" style={styles.presentDays}>
            {I18n.t("my_calendar_screen_days", { count: present_days })}
          </Text>
        </View>
        <View style={styles.otherDetailContainer}>
          <Text style={styles.detailName}>
            {I18n.t("my_calendar_screen_days_absent")}:{" "}
          </Text>
          <Text weight="Medium" style={styles.absentDays}>
            {I18n.t("my_calendar_screen_days", { count: absent_days })}
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
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 3,
    margin: 5,
    ...defaultStyles.card
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
    flex: 1,
    textAlign: "right",
    color: colors.secondaryText
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
  presentDays: {
    fontSize: 12,
    color: "#7ed321"
  },
  absentDays: {
    fontSize: 12,
    color: "#eb5d26"
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
export default Item;
