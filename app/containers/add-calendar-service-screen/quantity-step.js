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
      quantity: "",
      unitTypes: [],
      selectedUnitType: null
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

  onPressNext = async () => {
    const { onStepDone } = this.props;
    let {
      quantity,
      unitTypes,
      selectedUnitType,
      actualSelectedUnitType
    } = this.state;
    if (!quantity || !quantity.trim()) {
      return showSnackbar({ text: "Please enter quantity or skip this step" });
    }

    if (selectedUnitType.id == UNIT_TYPES.GRAM.id) {
      selectedUnitType = UNIT_TYPES.KILOGRAM;
    } else if (selectedUnitType.id == UNIT_TYPES.MILLILITRE.id) {
      selectedUnitType = UNIT_TYPES.LITRE;
    }

    if (
      (selectedUnitType.id == UNIT_TYPES.GRAM.id ||
        selectedUnitType.id == UNIT_TYPES.MILLILITRE.id) &&
      quantity
    ) {
      quantity = quantity / 1000;
    }

    if (typeof onStepDone == "function") {
      onStepDone({ quantity, unitType: selectedUnitType });
    }
  };

  render() {
    const { isLoading, unitTypes, selectedUnitType, quantity } = this.state;

    return (
      <Step title={`Add Quantity`} {...this.props}>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "row" }}>
            <CustomTextInput
              keyboardType="numeric"
              style={{ flex: 1 }}
              placeholder={I18n.t("calendar_service_screen_quantity")}
              value={quantity}
              onChangeText={quantity => this.setState({ quantity })}
              rightSideTextWidth={70}
            />
            <SelectModal
              style={styles.selectUnitType}
              visibleKey="symbol"
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="Choose Unit Type"
              placeholderRenderer={({ placeholder }) => (
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              )}
              selectedOption={selectedUnitType}
              options={unitTypes}
              onOptionSelect={value => {
                this.setState({
                  selectedUnitType: value
                });
              }}
              hideAddNew={true}
              hideSearch={true}
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
