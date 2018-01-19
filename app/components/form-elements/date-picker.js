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
      placeholder2Color = colors.secondaryText
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
          {date && (
            <View style={styles.textInput}>
              <Text weight="Medium" style={{ color: colors.mainText }}>
                {moment(date).format("DD MMM, YYYY")}
              </Text>
            </View>
          )}

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
    height: 60,
    marginBottom: 15,
    flexDirection: "row"
  },
  placeholderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end"
  },
  filledInputPlaceholderContainer: {
    alignItems: "flex-start"
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
  calenderIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 10
  },
  textInput: {
    position: "absolute",
    top: 20,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "transparent",
    justifyContent: "center"
  }
});

export default CustomDatePicker;
