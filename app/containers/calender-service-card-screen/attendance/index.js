import React from "react";
import { StyleSheet, View } from "react-native";
import moment from "moment";

import { Text } from "../../../elements";
import Month from "../month";
import Day from "./day";

class Attendance extends React.Component {
  onMonthIndexChange = index => {};
  render() {
    const { item, activeMonthIndex = 0 } = this.props;
    const paymentDetails = item.payment_detail;
    const endDate = paymentDetails[activeMonthIndex].end_date;
    const endDateOfMonth = +moment(endDate).format("D");
    const monthAndYear = moment(endDate).format("MMMM YYYY");

    return (
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Month
          paymentDetails={paymentDetails}
          activeMonthIndex={activeMonthIndex}
          onMonthIndexChange={this.onMonthIndexChange}
        />
        <View>
          {Array.from(Array(endDateOfMonth)).map((item, index) => (
            <Day date={index + 1 + " " + monthAndYear} isPresent={true} />
          ))}
        </View>
      </View>
    );
  }
}

export default Attendance;
