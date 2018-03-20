import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import moment from "moment";

import {
  updateCalendarServicePaymentDayToAbsent,
  updateCalendarServicePaymentDayToPresent
} from "../../../api";

import { Text } from "../../../elements";
import Month from "../month";
import Day from "./day";

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
      const effectiveDate = calculationDetails[i].effective_date.substr(0, 10);
      const diff = moment().diff(moment(effectiveDate), "days");
      if (diff < 0) {
        //if in future
        continue;
      } else {
        activeCalculationDetail = calculationDetails[i];
      }
    }

    const endDate = paymentDetail.end_date;
    const endDateOfMonth = +moment(endDate).format("D");
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

    return (
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Month
          paymentDetails={paymentDetails}
          activePaymentDetailIndex={activePaymentDetailIndex}
          onPaymentDetailIndexChange={onPaymentDetailIndexChange}
        />
        <View>
          {Array.from(Array(endDateOfMonth)).map((item, index) => {
            const date = monthAndYear + "-" + ("0" + (index + 1)).substr(-2);
            const weekday = +moment(date).format("d");
            if (selectedDays.indexOf(weekday) == -1) return null;
            const isPresent = absentDates.indexOf(date) == -1;
            return (
              <Day
                key={index}
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

export default Attendance;
