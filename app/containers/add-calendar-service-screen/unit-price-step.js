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

import LoadingOverlay from "../../components/loading-overlay";
import SelectOrCreateItem from "../../components/select-or-create-item";
import CustomTextInput from "../../components/form-elements/text-input";

import Step from "../../components/step";

class QuantityStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      unitPrice: ""
    };
  }

  componentWillMount() {
    const { serviceType } = this.props;
    let unitTypes = [];
    switch (serviceType.id) {
      case CALENDAR_SERVICE_TYPES.MILK:
        unitTypes = [UNIT_TYPES.LITRE, UNIT_TYPES.MILLILITRE];
        break;
      case CALENDAR_SERVICE_TYPES.DAIRY:
        unitTypes = [
          UNIT_TYPES.LITRE,
          UNIT_TYPES.MILLILITRE,
          UNIT_TYPES.KILOGRAM,
          UNIT_TYPES.GRAM
        ];
        break;
      case CALENDAR_SERVICE_TYPES.VEGETABLES:
        unitTypes = [UNIT_TYPES.KILOGRAM, UNIT_TYPES.GRAM];
        break;
      default:
        unitTypes = [UNIT_TYPES.UNIT];
        break;
    }
    this.setState({
      unitTypes,
      selectedUnitType: unitTypes[0]
    });
  }

  onPressNext = () => {
    const { onStepDone } = this.props;
    let { unitPrice } = this.state;
    if (!unitPrice || !unitPrice.trim()) {
      return showSnackbar({
        text: "Please enter unit price or skip this step"
      });
    }

    if (typeof onStepDone == "function") {
      onStepDone(unitPrice);
    }
  };

  render() {
    const { serviceType, unitType } = this.props;
    const { isLoading, unitPrice } = this.state;

    let unitPriceText = I18n.t("calendar_service_screen_unit_price");
    let unitPricePlaceholder = I18n.t("calendar_service_screen_unit_price");
    if (serviceType) {
      switch (serviceType.wages_type) {
        case CALENDAR_WAGES_TYPE.WAGES:
          unitPriceText = I18n.t("add_edit_calendar_service_screen_form_wages");
          unitPricePlaceholder = I18n.t(
            "add_edit_calendar_service_screen_form_wages"
          );
          break;
        case CALENDAR_WAGES_TYPE.FEES:
          unitPriceText = I18n.t("add_edit_calendar_service_screen_form_fees");
          unitPricePlaceholder = I18n.t(
            "add_edit_calendar_service_screen_form_fees"
          );
          break;
        case CALENDAR_WAGES_TYPE.RENTAL:
          unitPriceText = I18n.t(
            "add_edit_calendar_service_screen_form_rental_type"
          );
          unitPricePlaceholder = I18n.t(
            "add_edit_calendar_service_screen_form_rental"
          );
          break;
      }
    }

    return (
      <Step title={unitPriceText} {...this.props}>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "row" }}>
            <CustomTextInput
              keyboardType="numeric"
              placeholder={unitPricePlaceholder}
              value={unitPrice}
              onChangeText={unitPrice => this.setState({ unitPrice })}
              rightSideText={unitType ? "₹ per " + unitType.symbol : ""}
              rightSideTextWidth={100}
            />
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
  selectUnitType: {
    width: 80,
    marginLeft: 20
  }
});

export default QuantityStep;
