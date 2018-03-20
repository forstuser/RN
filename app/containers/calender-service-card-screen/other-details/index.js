import React from "react";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import moment from "moment";

import I18n from "../../../i18n";

import {
  updateCalendarServicePaymentDayToAbsent,
  updateCalendarServicePaymentDayToPresent
} from "../../../api";

import { Text, Button } from "../../../elements";
import KeyValueItem from "../../../components/key-value-item";

import { defaultStyles, colors } from "../../../theme";

class Report extends React.Component {
  render() {
    const {
      item,
      activePaymentDetailIndex = 0,
      onPaymentDetailIndexChange
    } = this.props;
    const paymentDetails = item.payment_detail;
    const paymentDetail = paymentDetails[activePaymentDetailIndex];

    const calculationDetails = item.calculation_detail;
    let activeCalculationDetail = calculationDetails[0];
    for (let i = 0; i < calculationDetails.length; i++) {
      const effectiveDate = calculationDetails[i].effective_date.substr(0, 10);
      const diff = moment().diff(moment(effectiveDate), "days");
      if (diff < 0) {
        //if in future
        continue;
      } else {
        activeCalculationDetail = calculationDetails[i];
      }
    }

    const startDate = moment(paymentDetail.start_date).format("DD-MMM-YYYY");
    const endDate = moment(paymentDetail.end_date).format("DD-MMM-YYYY");

    const daysPresent = paymentDetail.total_days;
    const daysAbsent = paymentDetail.absent_day_detail.length;
    return (
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={styles.card}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
            <KeyValueItem
              KeyComponent={() => (
                <Text
                  weight="Bold"
                  style={{
                    flex: 1,
                    color: colors.mainText,
                    fontSize: 12
                  }}
                >
                  {I18n.t("calendar_service_screen_item_details")}
                </Text>
              )}
              ValueComponent={() => (
                <Text
                  weight="Bold"
                  style={{
                    fontSize: 12,
                    textAlign: "right",
                    flex: 1,
                    color: colors.pinkishOrange
                  }}
                >
                  {I18n.t("product_details_screen_edit")}
                </Text>
              )}
            />
          </TouchableOpacity>
          <View style={styles.cardBody}>
            <KeyValueItem
              keyText={I18n.t("calendar_service_screen_product_name")}
              valueText={item.product_name}
            />
            <KeyValueItem
              keyText={I18n.t("calendar_service_screen_provider_name")}
              valueText={item.provider_name}
            />
          </View>
        </View>
        {calculationDetails.map(calculationDetail => (
          <View key={calculationDetail.id} style={styles.card}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
              <KeyValueItem
                KeyComponent={() => (
                  <Text
                    weight="Bold"
                    style={{
                      flex: 1,
                      color: colors.mainText,
                      fontSize: 12
                    }}
                  >
                    {moment(calculationDetail.effective_date).format(
                      "DD MMM YYYY"
                    ) +
                      "-" +
                      moment(calculationDetail.end_date).format("DD MMM YYYY")}
                  </Text>
                )}
                ValueComponent={() => (
                  <Text
                    weight="Bold"
                    style={{
                      fontSize: 12,
                      textAlign: "right",
                      color: colors.pinkishOrange
                    }}
                  >
                    {I18n.t("product_details_screen_edit")}
                  </Text>
                )}
              />
            </TouchableOpacity>
            <View style={styles.cardBody}>
              <KeyValueItem
                keyText={I18n.t("calendar_service_screen_quantity")}
                valueText={calculationDetail.quantity}
              />
              <KeyValueItem
                keyText={I18n.t("calendar_service_screen_price")}
                valueText={calculationDetail.unit_price}
              />
            </View>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    ...defaultStyles.card
  },
  cardBody: {
    paddingHorizontal: 5
  },
  cardPart: {
    flexDirection: "row",
    borderColor: "#efefef",
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 10
  },
  markPaidBtn: {
    marginBottom: 5
  }
});

export default Report;
