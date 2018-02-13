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

import { Text } from "../../elements";
import { colors } from "../../theme";

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
      placeholder,
      placeholder2,
      placeholder2Color = colors.secondaryText,
      maxDate = moment().format("YYYY-MM-DD")
    } = this.props;
    const { date } = this.state;
    return (
      <TouchableWithoutFeedback onPress={() => this.datePicker.onPressDate()}>
        <View style={[styles.container, style]}>
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

          <View style={styles.textInput}>
            <Text weight="Medium" style={{ color: colors.mainText }}>
              {date && moment(date).format("DD MMM, YYYY")}
            </Text>
          </View>

          <View style={styles.calenderIconContainer}>
            <CalenderIcon />
          </View>
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
            maxDate={maxDate}
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
    marginBottom: 15,
    width: "100%"
  },
  placeholderContainer: {
    position: "absolute",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    top: 10,
    paddingVertical: 10
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
    fontSize: 10
  },
  textInput: {
    backgroundColor: "transparent",
    justifyContent: "center",
    height: 40,
    width: "100%",
    borderColor: colors.lighterText,
    borderBottomWidth: 2
  },
  calenderIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 20
  },
  hint: {
    fontSize: 12,
    color: colors.mainBlue
  }
});

export default CustomDatePicker;