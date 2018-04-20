import React from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";

import moment from "moment";
import _ from "lodash";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Button } from "../elements";
import { colors } from "../theme";

class DatePickerRn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yearAndMonth: moment(this.props.activeDate).format("YYYY-MM")
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      yearAndMonth: moment(newProps.activeDate).format("YYYY-MM")
    })
  }

  previousMonth = () => {
    this.setState({
      yearAndMonth: moment(this.state.yearAndMonth)
        .subtract(1, "months")
        .format("YYYY-MM")
    });
  };

  nextMonth = () => {
    this.setState({
      yearAndMonth: moment(this.state.yearAndMonth)
        .add(1, "months")
        .format("YYYY-MM")
    });
  };

  onDatePress = (date, isOutOfRange) => {
    if (isOutOfRange) return;
    const { onSelectDate } = this.props;
    if (typeof onSelectDate == 'function') {
      onSelectDate(date);
    }
  }

  render() {
    const { activeDate, maxDate, minDate } = this.props;
    const { yearAndMonth } = this.state;

    const maxDateMoment = maxDate ? moment(maxDate) : null;
    const minDateMoment = minDate ? moment(minDate) : null;

    const daysInMonth = moment(yearAndMonth).daysInMonth();
    let days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isoDate: yearAndMonth + "-" + ("0" + i).slice(-2) });
    }

    const firstWeekDayOfMonth = moment(yearAndMonth)
      .startOf("month")
      .format("e");

    if (firstWeekDayOfMonth > 0) {
      const previousMonthMoment = moment(yearAndMonth)
        .subtract(1, "months");

      const daysInPreviousMonth = previousMonthMoment.daysInMonth();

      const previousMonthYearAndMonth = previousMonthMoment.format('YYYY-MM');
      const daysFromPreviousMonth = [];
      for (
        let i = daysInPreviousMonth - firstWeekDayOfMonth + 1;
        i <= daysInPreviousMonth;
        i++
      ) {
        daysFromPreviousMonth.push({
          date: i,
          isoDate: previousMonthYearAndMonth + "-" + ("0" + i).slice(-2),
          isAdjacentMonthDay: true
        });
      }
      days = [...daysFromPreviousMonth, ...days];
    }

    const lastWeekDayOfMonth = moment(yearAndMonth)
      .endOf("month")
      .format("e");

    const daysFromNextMonth = 6 - lastWeekDayOfMonth;
    if (daysFromNextMonth > 0) {
      const nextMonthMoment = moment(yearAndMonth)
        .add(1, "months")

      const daysInNextMonth = nextMonthMoment.daysInMonth();

      const nextMonthYearAndMonth = nextMonthMoment.format('YYYY-MM');
      for (let i = 1; i <= daysFromNextMonth; i++) {
        days.push({
          date: i,
          isoDate: nextMonthYearAndMonth + "-" + ("0" + i).slice(-2),
          isAdjacentMonthDay: true
        });
      }
    }

    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];


    console.log('activeDate: ', activeDate)
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={this.previousMonth}>
            <View style={[styles.adjacentMonth, styles.previousMonth]}>
              <Text>
                <Icon name="ios-arrow-back" size={30} color={colors.mainBlue} />
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={[styles.activeMonthAndYear]}>
            <Text weight="Bold" style={styles.activeMonthText}>
              {moment(yearAndMonth)
                .format("MMMM")
                .toUpperCase()}
            </Text>
            <Text weight="Bold" style={styles.activeMonthText}>
              {moment(yearAndMonth).format("YYYY")}
            </Text>
          </View>
          <TouchableWithoutFeedback onPress={this.nextMonth}>
            <View style={[styles.adjacentMonth, styles.nextMonth]}>
              <Text>
                <Icon
                  name="ios-arrow-forward"
                  size={30}
                  color={colors.mainBlue}
                />
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.month}>
          <View style={styles.week}>
            {weekDays.map(weekday => (
              <View key={weekday} style={[styles.day, styles.weekday]}>
                <Text weight="Bold" style={styles.dayText}>
                  {weekday}
                </Text>
              </View>
            ))}
          </View>
          {_.chunk(days, 7).map((week, index) => (
            <View key={index} style={styles.week}>
              {week.map(day => {
                let isOutOfRange = false;
                const momentDate = moment(day.isoDate);
                if ((maxDate && momentDate.isAfter(moment(maxDate))) || (minDate && momentDate.isBefore(moment(minDate)))) {
                  isOutOfRange = true;
                }
                return (
                  <TouchableWithoutFeedback onPress={() => this.onDatePress(day.isoDate, isOutOfRange)}>
                    <View style={[styles.day, moment(day.isoDate).isSame(activeDate) ? styles.activeDate : {}]}>
                      <Text
                        weight={day.isAdjacentMonthDay || isOutOfRange ? "Bold" : "Medium"}
                        style={[
                          styles.dayText,
                          day.isAdjacentMonthDay || isOutOfRange ? styles.unavailableDay : {},
                          momentDate.isSame(activeDate) ? styles.activeDateText : {}
                        ]}
                      >
                        {day.date}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row"
  },
  adjacentMonth: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center"
  },
  activeMonthAndYear: {
    flex: 1,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  activeMonthText: {
    fontSize: 18,
    margin: 10
  },
  month: {
    borderColor: colors.lighterText,
    borderWidth: 1
  },
  week: {
    flexDirection: "row"
  },
  day: {
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.lighterText,
    borderWidth: 1
  },
  dayText: {
    color: "#000"
  },
  unavailableDay: {
    color: colors.secondaryText
  },
  activeDate: {
    backgroundColor: colors.mainBlue,
  },
  activeDateText: {
    color: '#fff'
  }
});

export default DatePickerRn;
