import React from "React";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Alert
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

import Analytics from "../../../analytics";

import {
  SCREENS,
  CALENDAR_WAGES_TYPE,
  WAGES_CYCLE,
  UNIT_TYPES,
  CALENDAR_SERVICE_TYPES
} from "../../../constants";

import { addCalendarItemCalculationDetail } from "../../../api";

import I18n from "../../../i18n";
import { showSnackbar } from "../../snackbar";

import { updateCalendarItem } from "../../../api";
import { Text, Button } from "../../../elements";
import KeyValueItem from "../../../components/key-value-item";
import CustomTextInput from "../../../components/form-elements/text-input";
import CustomDatePicker from "../../../components/form-elements/date-picker";
import LoadingOverlay from "../../../components/loading-overlay";
import SelectModal from "../../../components/select-modal";
import SelectWeekDays from "../../../components/select-week-days";

import { defaultStyles, colors } from "../../../theme";

class CalculationDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isSavingDetails: false,
      unitPrice: "",
      quantity: "",
      startingDate: moment().format("YYYY-MM-DD"),
      endDate: null,
      selectedDays: [1, 2, 3, 4, 5, 6, 7],
      unitTypes: [],
      selectedUnitType: null,
      actualSelectedUnitType: null
    };
  }

  componentDidMount = () => {
    const { item } = this.props;

    let unitTypes = [];
    switch (item.service_id) {
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
      selectedUnitType: unitTypes[0],
      actualSelectedUnitType: unitTypes[0],
      selectedDays: item.calculation_detail[0].selected_days,
      unitPrice: item.calculation_detail[0].unit_price,
      quantity: item.calculation_detail[0].quantity
    });
  };

  onUnitTypeSelect = unitType => {
    let actualSelectedUnitType = unitType;
    if (unitType == UNIT_TYPES.GRAM) {
      actualSelectedUnitType = UNIT_TYPES.KILOGRAM;
    } else if (unitType == UNIT_TYPES.MILLILITRE) {
      actualSelectedUnitType = UNIT_TYPES.LITRE;
    }
    this.setState({
      selectedUnitType: unitType,
      actualSelectedUnitType
    });
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

  onSavePress = async () => {
    const { item, reloadScreen } = this.props;
    const {
      unitPrice,
      quantity,
      startingDate,
      endDate,
      selectedDays,
      selectedUnitType,
      actualSelectedUnitType
    } = this.state;

    if (!startingDate) {
      return showSnackbar({
        text: "Please select a starting date"
      });
    }
    if (selectedDays.length == 0) {
      return showSnackbar({
        text: "Please select week days for this service"
      });
    }

    this.setState({
      isSavingDetails: true
    });

    let actualQuantity = quantity;
    if (
      selectedUnitType.id == UNIT_TYPES.GRAM.id ||
      selectedUnitType.id == UNIT_TYPES.MILLILITRE.id
    ) {
      actualQuantity = quantity / 1000;
    }

    Analytics.logEvent(Analytics.EVENTS.CLICK_CHANGE_CALENDAR);

    try {
      await addCalendarItemCalculationDetail({
        itemId: item.id,
        unitType: actualSelectedUnitType.id,
        unitPrice: unitPrice,
        quantity: actualQuantity,
        effectiveDate: startingDate,
        selectedDays: selectedDays
      });

      if (endDate) {
        await addCalendarItemCalculationDetail({
          itemId: item.id,
          effectiveDate: moment(endDate)
            .add(1, "days")
            .format("YYYY-MM-DD"),
          unitType: item.calculation_detail[0].unit.id,
          selectedDays: item.calculation_detail[0].selected_days,
          unitPrice: item.calculation_detail[0].unit_price,
          quantity: item.calculation_detail[0].quantity
        });
      }
      this.setState({
        isModalVisible: false,
        isSavingDetails: false
      });

      setTimeout(() => {
        reloadScreen();
      }, 200);
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      this.setState({
        isSavingDetails: false
      });
    }
  };

  show = () => {
    this.setState({
      isModalVisible: true
    });
  };

  hide = () => {
    this.setState({
      isModalVisible: false
    });
  };

  render() {
    const {
      isModalVisible,
      isSavingDetails,
      unitPrice,
      quantity,
      startingDate,
      endDate,
      selectedDays,
      unitTypes,
      selectedUnitType,
      actualSelectedUnitType
    } = this.state;
    const { item } = this.props;
    const serviceType = item.service_type;
    let priceText = I18n.t("calendar_service_screen_unit_price");
    if (serviceType.wages_type == CALENDAR_WAGES_TYPE.WAGES) {
      priceText = I18n.t("add_edit_calendar_service_screen_form_wages");
    } else if (serviceType.wages_type == CALENDAR_WAGES_TYPE.FEES) {
      priceText = I18n.t("add_edit_calendar_service_screen_form_fees");
    }
    return (
      <Modal
        isVisible={isModalVisible}
        avoidKeyboard={Platform.OS == "ios"}
        animationIn="slideInUp"
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        onBackdropPress={this.hide}
        onBackButtonPress={this.hide}
      >
        <View style={[styles.card, styles.modalCard]}>
          <LoadingOverlay visible={isSavingDetails} />
          <TouchableOpacity style={styles.modalCloseIcon} onPress={this.hide}>
            <Icon name="md-close" size={30} color={colors.mainText} />
          </TouchableOpacity>
          {serviceType.wages_type != CALENDAR_WAGES_TYPE.PRODUCT && (
            <CustomTextInput
              placeholder={priceText}
              value={String(unitPrice)}
              onChangeText={unitPrice => this.setState({ unitPrice })}
            />
          )}
          {serviceType.wages_type == CALENDAR_WAGES_TYPE.PRODUCT && (
            <View style={{ width: "100%" }}>
              <View style={{ flexDirection: "row" }}>
                <SelectModal
                  visibleKey="symbol"
                  style={styles.selectUnitType}
                  dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                  placeholder="Choose Unit Type"
                  placeholderRenderer={({ placeholder }) => (
                    <Text
                      weight="Medium"
                      style={{ color: colors.secondaryText }}
                    >
                      {placeholder}
                    </Text>
                  )}
                  selectedOption={selectedUnitType}
                  options={unitTypes}
                  onOptionSelect={value => {
                    this.onUnitTypeSelect(value);
                  }}
                  hideAddNew={true}
                  hideSearch={true}
                />
                <CustomTextInput
                  keyboardType="numeric"
                  style={{ flex: 1 }}
                  placeholder={I18n.t("calendar_service_screen_quantity")}
                  value={quantity !== null ? String(quantity) : ""}
                  onChangeText={quantity => this.setState({ quantity })}
                  rightSideText={selectedUnitType ? selectedUnitType.name : ""}
                  rightSideTextWidth={70}
                />
              </View>
              <CustomTextInput
                keyboardType="numeric"
                placeholder={I18n.t("calendar_service_screen_unit_price")}
                value={String(unitPrice)}
                onChangeText={unitPrice => this.setState({ unitPrice })}
                rightSideText={
                  "Per " +
                  (actualSelectedUnitType ? actualSelectedUnitType.name : "")
                }
                rightSideTextWidth={100}
              />
            </View>
          )}
          <CustomDatePicker
            date={startingDate}
            placeholder={I18n.t(
              "add_edit_calendar_service_screen_form_starting_date"
            )}
            onDateChange={startingDate => {
              this.setState({ startingDate, endDate: null });
            }}
            maxDate={item.end_date}
          />
          {startingDate != item.end_date && (
            <CustomDatePicker
              maxDate={item.end_date}
              minDate={moment(startingDate)
                .add(1, "days")
                .format("YYYY-MM-DD")}
              date={endDate}
              placeholder={I18n.t(
                "add_edit_calendar_service_screen_form_end_date"
              )}
              onDateChange={endDate => {
                this.setState({ endDate });
              }}
            />
          )}
          <Text weight="Medium" style={styles.label}>
            Days
          </Text>
          <SelectWeekDays
            selectedDays={selectedDays}
            onDayPress={this.toggleDay}
            itemSize={28}
          />
          <Button
            onPress={this.onSavePress}
            style={[styles.modalBtn]}
            text={I18n.t("calendar_service_screen_save")}
            color="secondary"
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
    padding: 16,
    paddingTop: 50,
    ...defaultStyles.card
  },
  modalCloseIcon: {
    position: "absolute",
    right: 15,
    top: 10
  },
  modalBtn: {
    marginTop: 30,
    width: 250,
    alignSelf: "center"
  },
  form: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 10,
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth
  },
  label: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 10
  },
  selectUnitType: {
    width: 60,
    marginRight: 10
  }
});

export default CalculationDetailModal;
