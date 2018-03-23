import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import moment from "moment";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import I18n from "../../i18n";
import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import KeyValueItem from "../../components/key-value-item";

import { openBillsPopUp } from "../../navigation";

import { colors } from "../../theme";
import { getProductMetasString } from "../../utils";

import { MAIN_CATEGORY_IDS } from "../../constants";

const headerBg = require("../../images/product_card_header_bg.png");

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      item,
      navigator,
      activeTabIndex = 0,
      onTabChange,
      activePaymentDetailIndex = 0,
      onPaymentDetailIndexChange
    } = this.props;

    const paymentDetails = item.payment_detail;
    const payments = item.payments;

    const daysPresent = paymentDetails.reduce(
      (total, paymentDetail) => total + paymentDetail.total_days,
      0
    );
    const daysAbsent = paymentDetails.reduce(
      (total, paymentDetail) => total + paymentDetail.absent_day_detail.length,
      0
    );

    const totalCalulatedAmount = paymentDetails.reduce(
      (total, paymentDetail) => total + paymentDetail.total_amount,
      0
    );

    const totalPaidAmount = payments.reduce(
      (total, payment) => total + payment.amount_paid,
      0
    );

    let imageSource = {
      uri: API_BASE_URL + item.service_type.calendarServiceImageUrl
    };

    return (
      <View style={styles.container}>
        <View style={styles.upparHalf}>
          <Image style={styles.bg} source={headerBg} resizeMode="cover" />
          <Image
            style={styles.image}
            source={imageSource}
            resizeMode="contain"
          />
        </View>
        <View style={styles.lowerHalf}>
          <View style={styles.lowerHalfInner}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text weight="Bold" style={styles.name}>
                {item.product_name}
              </Text>
            </View>
            <Text weight="Medium" style={styles.key}>
              {item.provider_name}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text weight="Medium" style={styles.key}>
                  {I18n.t("calendar_service_screen_total_present")}:{" "}
                </Text>
                <Text
                  weight="Medium"
                  style={[styles.key, { color: colors.success }]}
                >
                  {daysPresent}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text weight="Medium" style={styles.key}>
                  {I18n.t("calendar_service_screen_total_absent")}:{" "}
                </Text>
                <Text
                  weight="Medium"
                  style={[styles.key, { color: colors.danger }]}
                >
                  {item.absent_days}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
                <Text weight="Medium" style={styles.key}>
                  {I18n.t("calendar_service_screen_total_calculated_amount")}:{" "}
                </Text>
                <Text
                  weight="Medium"
                  style={[styles.key, { color: colors.mainText }]}
                >
                  {"₹ " + totalCalulatedAmount}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text weight="Medium" style={styles.key}>
                  {I18n.t("calendar_service_screen_total_paid_amount")}:{" "}
                </Text>
                <Text
                  weight="Medium"
                  style={[styles.key, { color: colors.mainText }]}
                >
                  {"₹ " + totalPaidAmount}
                </Text>
              </View>
            </View>

            <View style={styles.tabs}>
              {[
                I18n.t("calendar_service_screen_attendance"),
                I18n.t("calendar_service_screen_payments"),
                I18n.t("calendar_service_screen_other_details")
              ].map((tab, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => onTabChange(index)}
                    key={index}
                    style={[styles.tab]}
                  >
                    <Text
                      numberOfLines={1}
                      weight="Bold"
                      style={[
                        styles.tabText,
                        index == activeTabIndex ? styles.activeTabText : {}
                      ]}
                    >
                      {tab.toUpperCase()}
                    </Text>
                    <View
                      style={
                        index == activeTabIndex ? styles.activeIndicator : {}
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  upparHalf: {
    backgroundColor: "#fff",
    height: 216,
    width: "100%",
    alignItems: "center"
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  },
  image: {
    marginTop: 60,
    width: 100,
    height: 70
  },
  lowerHalf: {
    marginTop: -65,
    width: "100%",
    paddingHorizontal: 16
  },
  lowerHalfInner: {
    backgroundColor: "#fff",
    padding: 10,
    paddingBottom: 0,
    borderRadius: 3,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  name: {
    flex: 1,
    fontSize: 18,
    marginRight: 85
  },
  key: {
    marginTop: 10,
    fontSize: 12,
    color: colors.secondaryText
  },
  tabs: {
    marginTop: 5,
    height: 40,
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row"
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#fff",
    flex: 1
  },
  tabText: {
    color: colors.lighterText,
    fontSize: 11
  },
  activeTabText: {
    fontWeight: "500",
    color: colors.mainBlue
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.mainBlue
  }
});

export default Header;
