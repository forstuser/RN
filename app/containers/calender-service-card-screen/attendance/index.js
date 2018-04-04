import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import moment from "moment";

import I18n from "../../../i18n";
import { showSnackbar } from "../../snackbar";

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

import { CALENDAR_WAGES_TYPE, WAGES_CYCLE } from "../../../constants";

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
      showSnackbar({
        text: e.message
      });
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
      showSnackbar({
        text: e.message
      });
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

    let calculationDetails = item.calculation_detail;
    let activeCalculationDetail = calculationDetails[0];
    for (let i = 0; i < calculationDetails.length; i++) {
      const effectiveDate = calculationDetails[i].effective_date;
      const diff = moment().diff(moment(effectiveDate), "days");
      if (diff < 0) {
        //if in future
        continue;
      } else {
        activeCalculationDetail = calculationDetails[i];
        break;
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
    if (serviceType.wages_type == CALENDAR_WAGES_TYPE.WAGES) {
      unitPriceText = I18n.t("add_edit_calendar_service_screen_form_wages");
    } else if (serviceType.wages_type == CALENDAR_WAGES_TYPE.FEES) {
      unitPriceText = I18n.t("add_edit_calendar_service_screen_form_fees");
    }
    //  Pritam Dirty code here
    console.log("calculation details", calculationDetails);
    console.log("payment detail", paymentDetails);
    // function which will return active days of months
    const calculationFunction = (
      startDateforCalculation,
      endDateForCalculation,
      selectedDaysArray
    ) => {
      const availbaleDays = [];
      const selectedDaysArrayIntoMomentFormat = selectedDaysArray.map(day => {
        if (day == 7) return 0;
        return day;
      });
      console.log(selectedDaysArrayIntoMomentFormat);
      let sDate = +moment(startDateforCalculation).format("D");
      let eDate = +moment(endDateForCalculation).format("D");
      for (let i = sDate; i < eDate + 1; i++) {
        let date = monthAndYear + "-" + ("0" + i).substr(-2);
        const weekday = +moment(date).format("d");
        if (selectedDaysArrayIntoMomentFormat.includes(weekday)) {
          availbaleDays.push(date);
        }
      }
      return availbaleDays;
    };
    // case 1: if current months starting date is greater than effective date of activeCalculation details
    let availableDaysofMonth = [];
    // if (startDate > activeCalculationDetail.effective_date) {
    //   // call function which will give availbale days of months according to calculation detail
    //   availableDaysofMonth.push(calculationFunction(startDate, endDate, activeCalculationDetail.selected_days))
    // } else {
    for (let i = calculationDetails.length - 1; i > -1; i--) {
      let calculationDetailEndDate = +moment(endDate).endOf("month");
      let calculationDetailStartDate = startDate;
      if (calculationDetails[i - 1]) {
        calculationDetailEndDate = calculationDetails[i - 1].effective_date;
        calculationDetailStartDate = calculationDetails[i].effective_date;
      }
      availableDaysofMonth.push(
        calculationFunction(
          calculationDetailStartDate,
          calculationDetailEndDate,
          calculationDetails[i].selected_days
        )
      );
    }
    // }
    availableDaysofMonth = [].concat.apply([], availableDaysofMonth);
    console.log("availableDaysofMonth", availableDaysofMonth);
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
              {serviceType.wages_type == CALENDAR_WAGES_TYPE.PRODUCT && (
                <VerticalKeyValue
                  keyText={I18n.t("my_calendar_screen_no_of_units")}
                  valueText={paymentDetail.total_units}
                />
              )}
              {serviceType.wages_type != CALENDAR_WAGES_TYPE.PRODUCT && (
                <VerticalKeyValue
                  keyText={I18n.t("my_calendar_screen_payment_type")}
                  valueText={
                    item.wages_type == WAGES_CYCLE.DAILY
                      ? I18n.t("daily")
                      : I18n.t("monthly")
                  }
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
            </View>
          </View>
        </View>
        <View>
          {daysOfMonth.map(day => {
            const date = monthAndYear + "-" + ("0" + day).substr(-2);
            const isPresent = absentDates.indexOf(date) == -1;
            // const weekday = +moment(date).format("d");
            // availableDaysofMonth.includes(date) ? null : null;
            if (availableDaysofMonth.includes(date)) {
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
            } else {
              return null;
            }
            console.log(date);
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
