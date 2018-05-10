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
import I18n from "../../i18n";
import { API_BASE_URL, addCalendarItemCalculationDetail } from "../../api";
import {
  SCREENS,
  WAGES_CYCLE,
  CALENDAR_WAGES_TYPE,
  UNIT_TYPES,
  CALENDAR_SERVICE_TYPES
} from "../../constants";
import { Text, Button } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../snackbar";

import SelectModal from "../../components/select-modal";
import SelectWeekDays from "../../components/select-week-days";
import LoadingOverlay from "../../components/loading-overlay";
import SelectOrCreateItem from "../../components/select-or-create-item";
import CustomTextInput from "../../components/form-elements/text-input";

import Step from "../../components/step";

class SelectedDaysStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedDays: this.props.selectedDays
    };
  }

  onPressNext = async () => {
    const { onStepDone } = this.props;
    let { selectedDays } = this.state;
    if (selectedDays.length == 0) {
      return showSnackbar({
        text: "Please select some days or skip this step"
      });
    }

    if (typeof onStepDone == "function") {
      onStepDone(selectedDays);
    }
  };

  toggleDay = day => {
    let selectedDays = [...this.state.selectedDays];
    const idx = selectedDays.indexOf(day);
    if (idx == -1) {
      selectedDays.push(day);
    } else {
      selectedDays.splice(idx, 1);
    }
    this.setState({
      selectedDays
    });
  };

  render() {
    const { isLoading, selectedDays } = this.state;

    return (
      <Step title={`Deselect Service weekly off days`} {...this.props}>
        <View style={{ padding: 20 }}>
          <SelectWeekDays
            selectedDays={selectedDays}
            onDayPress={this.toggleDay}
          />
          <Button
            onPress={this.onPressNext}
            text="Done"
            style={{
              width: 100,
              height: 40,
              alignSelf: "center",
              marginTop: 20
            }}
          />
        </View>
      </Step>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  selectUnitType: {
    width: 80,
    marginLeft: 20
  }
});

export default SelectedDaysStep;
