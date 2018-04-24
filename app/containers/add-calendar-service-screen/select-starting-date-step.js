import React from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import moment from "moment";
import I18n from "../../i18n";
import { API_BASE_URL, updateProduct } from "../../api";
import { MAIN_CATEGORY_IDS } from "../../constants";
import { Text } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../snackbar";

import DatePickerRn from "../../components/date-picker-rn";

import Step from "../../components/step";

class SelectPurchaseDateStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDate: moment().format("YYYY-MM-DD")
    };
  }

  onSelectDate = async date => {
    this.setState({
      activeDate: date
    });
    const { onStepDone } = this.props;
    if (typeof onStepDone == "function") {
      onStepDone(date);
    }
  };

  render() {
    const { activeDate } = this.state;

    return (
      <Step title={`Select Starting Date`} skippable={false} {...this.props}>
        <DatePickerRn
          activeDate={activeDate}
          maxDate={moment().format("YYYY-MM-DD")}
          onSelectDate={this.onSelectDate}
        />
      </Step>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default SelectPurchaseDateStep;
