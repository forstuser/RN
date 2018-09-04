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
import Icon from "react-native-vector-icons/Ionicons";
import {
  SCREENS,
  WAGES_CYCLE,
  CALENDAR_WAGES_TYPE,
  UNIT_TYPES,
  CALENDAR_SERVICE_TYPES
} from "../../constants";
import { Text, Button } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";

import SelectModal from "../../components/select-modal";

import LoadingOverlay from "../../components/loading-overlay";
import SelectOrCreateItem from "../../components/select-or-create-item";
import CustomTextInput from "../../components/form-elements/text-input";

import Step from "../../components/step";

class WagesCycleStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wagesCycle: WAGES_CYCLE.MONTHLY
    };
  }

  onPressNext = async () => {
    const { onStepDone } = this.props;
    let { wagesCycle } = this.state;

    if (typeof onStepDone == "function") {
      onStepDone(wagesCycle);
    }
  };

  render() {
    const { serviceType } = this.props;
    const { wagesCycle } = this.state;

    return (
      <Step title={`Select Cycle`} {...this.props}>
        <View collapsable={false}  style={{ padding: 20 }}>
          <View collapsable={false}  style={{ flexDirection: "row", marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  wagesCycle: WAGES_CYCLE.MONTHLY
                });
              }}
              style={styles.radioBtn}
            >
              <Icon
                name={
                  wagesCycle == WAGES_CYCLE.MONTHLY
                    ? "md-radio-button-on"
                    : "md-radio-button-off"
                }
                color={
                  wagesCycle == WAGES_CYCLE.MONTHLY
                    ? colors.pinkishOrange
                    : colors.secondaryText
                }
                size={20}
              />
              <Text
                style={[
                  styles.radioBtnLabel,
                  {
                    color:
                      wagesCycle == WAGES_CYCLE.MONTHLY
                        ? colors.pinkishOrange
                        : colors.secondaryText
                  }
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  wagesCycle: WAGES_CYCLE.DAILY
                });
              }}
              style={styles.radioBtn}
            >
              <Icon
                name={
                  wagesCycle == WAGES_CYCLE.DAILY
                    ? "md-radio-button-on"
                    : "md-radio-button-off"
                }
                color={
                  wagesCycle == WAGES_CYCLE.DAILY
                    ? colors.pinkishOrange
                    : colors.secondaryText
                }
                size={20}
              />
              <Text
                style={[
                  styles.radioBtnLabel,
                  {
                    color:
                      wagesCycle == WAGES_CYCLE.DAILY
                        ? colors.pinkishOrange
                        : colors.secondaryText
                  }
                ]}
              >
                Daily
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            onPress={this.onPressNext}
            text="Next"
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
  radioBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  radioBtnLabel: {
    marginLeft: 10
  }
});

export default WagesCycleStep;
