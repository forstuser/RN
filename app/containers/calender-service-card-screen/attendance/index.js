import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import moment from "moment";

import I18n from "../../../i18n";

import {
  updateCalendarServicePaymentDayToAbsent,
  updateCalendarServicePaymentDayToPresent
} from "../../../api";

import { Text } from "../../../elements";
import Month from "../month";
import Day from "./day";

import { defaultStyles, colors } from "../../../theme";

import KeyValueItem from "../../../components/key-value-item";
import VerticalKeyValue from "./vertical-key-value";

class Attendance extends React.Component {
  markDayAbsent = async date => {
    const { item, activePaymentDetailIndex = 0 } = this.props;
    const paymentDetails = item.payment_detail;
    try {
      const res = await updateCalendarServicePaymentDayToAbsent({
        itemId: item.id,
        paymentId: paymentDetails[activePaymentDetailIndex].id,
        date
      });
      this.props.reloadScreen();
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  markDayPresent = async date => {
    const { item, activePaymentDetailIndex = 0 } = this.props;
    const paymentDetails = item.payment_detail;
    try {
      const res = await updateCalendarServicePaymentDayToPresent({
        itemId: item.id,
        paymentId: paymentDetails[activePaymentDetailIndex].id,
        date
      });
      this.props.reloadScreen();
    } catch (e) {
      Alert.alert(e.message);
    }
  };

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
      const effectiveDate = calculationDetails[i].effective_date;
      const diff = moment().diff(moment(effectiveDate), "days");
      if (diff < 0) {
        //if in future
        continue;
      } else {
        activeCalculationDetail = calculationDetails[i];
      }
    }

    const startDate = paymentDetail.start_date;
    const startDateOfMonth = +moment(startDate).format("D");

    const endDate = paymentDetail.end_date;
    const endDateOfMonth = +moment(endDate)
      .endOf("month")
      .format("D");

    const monthAndYear = moment(endDate).format("YYYY-MM");
    const selectedDays = (
      activeCalculationDetail.selected_days || item.selected_days
    ).map(day => {
      if (day == 7) return 0;
      return day;
    });

    const absentDates = paymentDetail.absent_day_detail.map(absentDay =>
      moment(absentDay.absent_date.substr(0, 10)).format("YYYY-MM-DD")
    );

    let daysOfMonth = [];
    for (let i = startDateOfMonth; i <= endDateOfMonth; i++) {
      daysOfMonth.push(i);
    }

    const daysPresent = paymentDetail.total_days;
    const daysAbsent = paymentDetail.absent_day_detail.length;

    const serviceType = item.service_type;
    let unitPriceText = I18n.t("calendar_service_screen_unit_price");
    if (serviceType.main_category_id == 6 && serviceType.category_id == 24) {
      unitPriceText = I18n.t("add_edit_calendar_service_screen_form_wages");
    } else if (
      serviceType.main_category_id == 6 &&
      serviceType.category_id == 123
    ) {
      unitPriceText = I18n.t("add_edit_calendar_service_screen_form_fees");
    }

    return (
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Month
          paymentDetails={paymentDetails}
          activePaymentDetailIndex={activePaymentDetailIndex}
          onPaymentDetailIndexChange={onPaymentDetailIndexChange}
        />
        <View style={styles.card}>
          <View style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
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
                  {I18n.t("my_calendar_screen_summary")}
                </Text>
              )}
            />
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardPart}>
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_from")}
                valueText={moment(startDate).format("DD MMM YYYY")}
              />
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_to")}
                valueText={moment(endDate).format("DD MMM YYYY")}
              />
              <View style={{ flex: 1 }} />
            </View>
            <View style={styles.cardPart}>
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_total_days")}
                valueText={daysPresent + daysAbsent}
              />
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_days_present")}
                valueText={daysPresent}
                valueStyle={{ color: colors.success }}
              />
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_days_absent")}
                valueText={daysAbsent}
                valueStyle={{ color: colors.danger }}
              />
            </View>
            <View style={styles.cardPart}>
              {serviceType.main_category_id == 8 && (
                <VerticalKeyValue
                  keyText={I18n.t("my_calendar_screen_no_of_units")}
                  valueText={paymentDetail.total_units}
                />
              )}
              <VerticalKeyValue
                keyText={unitPriceText}
                valueText={"₹ " + activeCalculationDetail.unit_price}
              />
              <VerticalKeyValue
                keyText={I18n.t("calendar_service_screen_total_amount")}
                valueText={"₹ " + paymentDetail.total_amount}
              />
              {serviceType.main_category_id != 8 && (
                <View style={{ flex: 1 }} />
              )}
            </View>
          </View>
        </View>
        <View>
          {daysOfMonth.map(day => {
            const date = monthAndYear + "-" + ("0" + day).substr(-2);
            const weekday = +moment(date).format("d");
            if (selectedDays.indexOf(weekday) == -1) return null;
            const isPresent = absentDates.indexOf(date) == -1;
            return (
              <Day
                key={date}
                date={date}
                isPresent={isPresent}
                toggleAttendance={() => {
                  if (isPresent) {
                    this.markDayAbsent(date);
                  } else {
                    this.markDayPresent(date);
                  }
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    marginTop: 10,
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
  },
  modalCard: {
    maxWidth: 300,
    alignSelf: "center",
    alignItems: "center",
    padding: 16
  },
  modalCloseIcon: {
    position: "absolute",
    right: 15,
    top: 10
  },
  modalImage: {
    marginTop: 15,
    marginBottom: 30,
    width: 90,
    height: 90,
    backgroundColor: "#4b5aa7",
    borderRadius: 45
  },
  modalBtn: {
    width: 200
  }
});

export default Attendance;
