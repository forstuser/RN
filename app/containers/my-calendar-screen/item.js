import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button, Image } from "../../elements";
import I18n from "../../i18n";
import { colors, defaultStyles } from "../../theme";
import { API_BASE_URL } from "../../api";
import { SCREENS, MAIN_CATEGORY_IDS } from "../../constants";
import Analytics from "../../analytics";
class Item extends React.Component {
  onPress = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ATTENDANCE_ITEMS);
    const { item } = this.props;
    this.props.navigator.push({
      screen: SCREENS.CALENDAR_SERVICE_CARD_SCREEN,
      passProps: {
        itemId: item.id
      }
    });
  };

  render() {
    const { item, style } = this.props;
    // console.log("Item", item);
    const {
      product_name,
      provider_name,
      wages_type,
      present_days,
      absent_days,
      service_type,
      latest_payment_detail,
      outstanding_amount
    } = item;
    const imageUrl = service_type
      ? API_BASE_URL + service_type.calendarServiceImageUrl
      : "";

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={[styles.container, style]}
      >
        <Image
          style={styles.image}
          source={{ uri: imageUrl }}
          resizeMode="contain"
        />
        <View collapsable={false}  style={styles.texts}>
          <View collapsable={false}  style={styles.nameAndSeller}>
            <View collapsable={false}  style={{ flexDirection: "row" }}>
              <Text weight="Bold" style={styles.name}>
                {product_name}
              </Text>
              {outstanding_amount > 0 ? (
                <Text style={styles.positiveValue}>₹ {outstanding_amount}</Text>
              ) : (
                <Text style={styles.negativeValue}>₹ {outstanding_amount}</Text>
              )}
              {/* <Text weight="Bold" style={styles.value}>
                ₹ {outstanding_amount}
              </Text> */}
            </View>
            <View collapsable={false}  style={{ flexDirection: "row" }}>
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
          <View collapsable={false}  style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>
              {I18n.t("my_calendar_screen_days_present")}:{" "}
            </Text>
            <Text style={styles.presentDays}>
              {I18n.t("my_calendar_screen_days", { count: present_days })}
            </Text>
          </View>
          <View collapsable={false}  style={styles.otherDetailContainer}>
            <Text style={styles.detailName}>
              {I18n.t("my_calendar_screen_days_absent")}:{" "}
            </Text>
            <Text style={styles.absentDays}>
              {I18n.t("my_calendar_screen_days", { count: absent_days })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 3,
    margin: 5
    // ...defaultStyles.card
  },
  image: {
    width: 40,
    height: 40,
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
  positiveValue: {
    marginLeft: 20,
    color: colors.success,
    fontSize: 15
  },
  negativeValue: {
    marginLeft: 20,
    color: colors.pinkishOrange,
    fontSize: 15
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
