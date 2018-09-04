import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import DatePicker from "react-native-datepicker";
import moment from "moment";

import { Text } from "./";
import { colors, defaultStyles } from "../theme";

const CalendarIcon = () => (
  <Icon name="calendar" size={17} color={colors.pinkishOrange} />
);

class CustomDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (props.date) {
      this.setState({ date: props.date });
    }
  };

  onDateChange = newDate => {
    if (typeof this.props.onDateChange == "function") {
      this.props.onDateChange(newDate);
    }
    this.setState({
      date: newDate
    });
  };

  render() {
    const {
      style = {},
      innerContainerStyle = {},
      placeholder,
      placeholder2,
      placeholder2Color = colors.secondaryText,
      maxDate = moment().format("YYYY-MM-DD"),
      minDate,
      hint
    } = this.props;
    const { date } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => this.datePicker.onPressDate()}>
        <View style={[styles.container, style]}>
          <View style={[styles.innerContainer, innerContainerStyle]}>
            <View
              style={[
                styles.placeholderContainer,
                date ? styles.filledInputPlaceholderContainer : {}
              ]}
            >
              <Text
                weight="Medium"
                style={[
                  styles.placeholder,
                  date ? styles.filledInputPlaceholder : {}
                ]}
              >
                {placeholder}
              </Text>
              <Text
                weight="Medium"
                style={[styles.placeholder2, { color: placeholder2Color }]}
              >
                {placeholder2}
              </Text>
            </View>

            <View collapsable={false} style={styles.textInput}>
              <Text weight="Medium" style={{ color: colors.mainText }}>
                {date && moment(date).format("DD MMM, YYYY")}
              </Text>
            </View>

            <View collapsable={false} style={styles.calendarIconContainer}>
              <CalendarIcon />
            </View>
            <DatePicker
              ref={ref => (this.datePicker = ref)}
              style={{
                position: "absolute",
                width: 0,
                height: 0,
                overflow: "hidden"
              }}
              customStyles={{
                btnTextConfirm: {
                  height: 20
                },
                btnTextCancel: {
                  height: 20
                }
              }}
              date={date}
              mode="date"
              placeholder="Choose date"
              format="YYYY-MM-DD"
              minDate={minDate}
              maxDate={maxDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={this.onDateChange}
            />
          </View>
          {hint ? (
            <Text weight="Regular" style={styles.hint}>
              {hint}
            </Text>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15
  },
  innerContainer: {
    width: "100%",
    paddingRight: 10,
    borderBottomColor: "#c2c2c2",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  placeholderContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 10
    // paddingVertical: 10,
  },
  filledInputPlaceholderContainer: {
    alignItems: "flex-start",
    top: 0,
    paddingVertical: 0
  },
  placeholder: {
    color: colors.secondaryText
  },
  filledInputPlaceholder: {
    fontSize: 10
  },
  placeholder2: {
    fontSize: 10,
    marginLeft: 2
  },
  textInput: {
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    paddingBottom: 10,
    height: 45,
    width: "100%"
  },
  calendarIconContainer: {
    position: "absolute",
    right: 6,
    bottom: 10
  },
  hint: {
    color: colors.mainBlue,
    fontSize: 10
  }
});

export default CustomDatePicker;
