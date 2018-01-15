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

import { Text } from "../../../elements";
import { colors } from "../../../theme";

const CalenderIcon = () => (
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
    if (this.props.date) {
      this.setState({ date: this.props.date });
    }
  }

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
      placeholder,
      placeholder2,
      placeholder2Color = colors.secondaryText
    } = this.props;
    const { date } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => this.datePicker.onPressDate()}>
        <View style={[styles.container, style]}>
          {!date && (
            <View style={styles.placeholderContainer}>
              <Text weight="Medium" style={styles.placeholder}>
                {placeholder}
              </Text>
              <Text
                weight="Medium"
                style={[styles.placeholder2, { color: placeholder2Color }]}
              >
                {placeholder2}
              </Text>
            </View>
          )}
          {date && (
            <View style={styles.placeholderContainer}>
              <Text weight="Medium" style={{ color: colors.mainText }}>
                {moment(date).format("DD MMM, YYYY")}
              </Text>
            </View>
          )}

          <CalenderIcon />

          <DatePicker
            ref={ref => (this.datePicker = ref)}
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              overflow: "hidden"
            }}
            date={date}
            mode="date"
            placeholder="Choose date"
            format="YYYY-MM-DD"
            minDate="1990-01-01"
            maxDate={moment().format("YYYY-MM-DD")}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={this.onDateChange}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 40,
    marginBottom: 32,
    flexDirection: "row"
  },
  placeholderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  placeholder: {
    color: colors.secondaryText
  },
  placeholder2: {
    fontSize: 10
  },
  textInput: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "transparent"
  }
});

export default CustomDatePicker;
